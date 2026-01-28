// Supabase client placeholder
// Replace with actual Supabase URL and anon key when connecting
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================================
// Type definitions matching schema.sql
// =============================================================

export type AppRole = 'owner' | 'manager' | 'kitchen' | 'waiter' | 'delivery' | 'customer';
export type TenantStatus = 'onboarding' | 'active' | 'suspended';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  cuisine_type?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  status: TenantStatus;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  tenant_id: string;
  role: AppRole;
  created_at: string;
}

export interface MenuItem {
  id: string;
  tenant_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  is_veg: boolean;
  allergens?: string[];
  prep_time_min?: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_id?: string;
  status: OrderStatus;
  total: number;
  notes?: string;
  source: string;
  created_at: string;
  updated_at: string;
}
