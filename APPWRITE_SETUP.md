# Appwrite Database Setup Guide

This document outlines the database structure for the Restaurant OS application.

## Collections

### 1. tenants
Restaurant tenant information

**Attributes:**
- `name` (string, required) - Restaurant name
- `slug` (string, required, unique) - URL-friendly identifier
- `cuisine_type` (string, optional) - Type of cuisine
- `address` (string, optional) - Physical address
- `phone` (string, optional) - Contact phone
- `email` (string, optional) - Contact email
- `logo_url` (string, optional) - Logo image URL
- `status` (enum, required) - Status: onboarding, active, suspended
- `settings` (string, optional) - JSON settings object

**Indexes:**
- `slug` (unique)
- `status`

### 2. profiles
User profile information

**Attributes:**
- `user_id` (string, required) - Appwrite user ID
- `full_name` (string, optional) - User's full name
- `avatar_url` (string, optional) - Profile picture URL
- `phone` (string, optional) - Contact phone

**Indexes:**
- `user_id` (unique)

### 3. user_roles
User role assignments per tenant

**Attributes:**
- `user_id` (string, required) - Appwrite user ID
- `tenant_id` (string, required) - Reference to tenants collection
- `role` (enum, required) - Role: owner, manager, kitchen, waiter, delivery, customer

**Indexes:**
- `user_id`
- `tenant_id`
- `user_id_tenant_id` (compound, unique)

**Relationships:**
- `tenant_id` → tenants.$id

### 4. menu_items
Restaurant menu items

**Attributes:**
- `tenant_id` (string, required) - Reference to tenants collection
- `category_id` (string, optional) - Menu category
- `name` (string, required) - Item name
- `description` (string, optional) - Item description
- `price` (float, required) - Item price
- `image_url` (string, optional) - Item image URL
- `is_available` (boolean, required, default: true) - Availability status
- `is_veg` (boolean, required, default: false) - Vegetarian flag
- `allergens` (string, optional) - JSON array of allergens
- `prep_time_min` (integer, optional) - Preparation time in minutes

**Indexes:**
- `tenant_id`
- `category_id`
- `is_available`

**Relationships:**
- `tenant_id` → tenants.$id

### 5. orders
Customer orders

**Attributes:**
- `tenant_id` (string, required) - Reference to tenants collection
- `customer_id` (string, optional) - Appwrite user ID of customer
- `status` (enum, required) - Status: pending, confirmed, preparing, ready, picked_up, delivered, cancelled
- `total` (float, required) - Order total amount
- `notes` (string, optional) - Order notes
- `source` (string, required) - Order source: app, web, phone

**Indexes:**
- `tenant_id`
- `customer_id`
- `status`
- `$createdAt`

**Relationships:**
- `tenant_id` → tenants.$id

### 6. order_items
Order line items

**Attributes:**
- `order_id` (string, required) - Reference to orders collection
- `menu_item_id` (string, required) - Reference to menu_items collection
- `quantity` (integer, required) - Item quantity
- `price` (float, required) - Item price at time of order
- `notes` (string, optional) - Item-specific notes

**Indexes:**
- `order_id`
- `menu_item_id`

**Relationships:**
- `order_id` → orders.$id
- `menu_item_id` → menu_items.$id

## Permissions

### Collection-level Permissions

**tenants:**
- Read: Any authenticated user
- Create: Any authenticated user (for onboarding)
- Update: Users with owner/manager role for that tenant
- Delete: Users with owner role for that tenant

**profiles:**
- Read: Any authenticated user
- Create: Any authenticated user (auto-created on signup)
- Update: Document owner only
- Delete: Document owner only

**user_roles:**
- Read: Any authenticated user
- Create: Users with owner/manager role for that tenant
- Update: Users with owner role for that tenant
- Delete: Users with owner role for that tenant

**menu_items:**
- Read: Any user (public menu)
- Create: Users with owner/manager role for that tenant
- Update: Users with owner/manager role for that tenant
- Delete: Users with owner/manager role for that tenant

**orders:**
- Read: Order creator or staff of that tenant
- Create: Any authenticated user
- Update: Staff of that tenant
- Delete: Users with owner/manager role for that tenant

**order_items:**
- Read: Order creator or staff of that tenant
- Create: Any authenticated user (during order creation)
- Update: Staff of that tenant
- Delete: Users with owner/manager role for that tenant

## Setup Steps

1. Create a new Appwrite project
2. Create a database and note the Database ID
3. Create each collection listed above with their attributes
4. Set up indexes for better query performance
5. Configure collection permissions as specified
6. Enable Email/Password authentication
7. Update your `.env` file with the credentials
