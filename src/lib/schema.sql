-- =============================================================
-- RestaurantOS — Supabase Database Schema
-- =============================================================
-- This file documents the expected database schema.
-- Run these statements in the Supabase SQL Editor when connecting.
-- =============================================================

-- 1. ENUMS
create type public.app_role as enum ('owner', 'manager', 'kitchen', 'waiter', 'delivery', 'customer');
create type public.tenant_status as enum ('onboarding', 'active', 'suspended');
create type public.order_status as enum ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled');

-- 2. TENANTS (restaurants) — the isolation boundary
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  cuisine_type text,
  address text,
  phone text,
  email text,
  logo_url text,
  status tenant_status not null default 'onboarding',
  settings jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. PROFILES (linked to auth.users, never stores roles)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. USER ROLES — separate table, scoped per tenant
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, tenant_id, role)
);

-- 5. TENANT MEMBERS — maps users to tenants
create table public.tenant_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  invited_by uuid references auth.users(id),
  joined_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

-- 6. MENU CATEGORIES
create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- 7. MENU ITEMS
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  category_id uuid references public.menu_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_available boolean default true,
  is_veg boolean default false,
  allergens text[],
  prep_time_min int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid references auth.users(id),
  status order_status not null default 'pending',
  total numeric(10,2) not null default 0,
  notes text,
  source text default 'direct', -- direct, zomato, swiggy, etc.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. ORDER ITEMS
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id),
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  notes text
);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.tenant_members enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Helper: check role without recursion
create or replace function public.has_role(_user_id uuid, _tenant_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and tenant_id = _tenant_id and role = _role
  )
$$;

-- Helper: get user's tenant IDs
create or replace function public.user_tenant_ids(_user_id uuid)
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select tenant_id from public.tenant_members where user_id = _user_id
$$;

-- Profiles: users can read/update their own
create policy "Users can view own profile" on public.profiles
  for select using (id = auth.uid());
create policy "Users can update own profile" on public.profiles
  for update using (id = auth.uid());

-- Tenants: members can view their tenants
create policy "Members can view tenant" on public.tenants
  for select using (id in (select public.user_tenant_ids(auth.uid())));

-- Tenant members: members can view co-members
create policy "Members can view co-members" on public.tenant_members
  for select using (tenant_id in (select public.user_tenant_ids(auth.uid())));

-- Menu: tenant members can view, owners/managers can modify
create policy "Members can view menu categories" on public.menu_categories
  for select using (tenant_id in (select public.user_tenant_ids(auth.uid())));
create policy "Members can view menu items" on public.menu_items
  for select using (tenant_id in (select public.user_tenant_ids(auth.uid())));

-- Orders: scoped to tenant
create policy "Members can view tenant orders" on public.orders
  for select using (tenant_id in (select public.user_tenant_ids(auth.uid())));

-- Order items: accessible if parent order is accessible
create policy "Members can view order items" on public.order_items
  for select using (
    order_id in (
      select id from public.orders
      where tenant_id in (select public.user_tenant_ids(auth.uid()))
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
