import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export utilities
export { ID, Query };
export const DATABASE_ID = APPWRITE_DATABASE_ID;

// Collection IDs (to be created in Appwrite Console)
export const COLLECTIONS = {
  TENANTS: 'tenants',
  PROFILES: 'profiles',
  USER_ROLES: 'user_roles',
  MENU_ITEMS: 'menu_items',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
} as const;

// Type definitions
export type AppRole = 'owner' | 'manager' | 'kitchen' | 'waiter' | 'delivery' | 'customer';
export type TenantStatus = 'onboarding' | 'active' | 'suspended';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';

export interface Tenant {
  $id: string;
  name: string;
  slug: string;
  cuisine_type?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  status: TenantStatus;
  settings: Record<string, unknown>;
  $createdAt: string;
  $updatedAt: string;
}

export interface Profile {
  $id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface UserRole {
  $id: string;
  user_id: string;
  tenant_id: string;
  role: AppRole;
  $createdAt: string;
}

export interface MenuItem {
  $id: string;
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
  $createdAt: string;
  $updatedAt: string;
}

export interface Order {
  $id: string;
  tenant_id: string;
  customer_id?: string;
  status: OrderStatus;
  total: number;
  notes?: string;
  source: string;
  $createdAt: string;
  $updatedAt: string;
}
