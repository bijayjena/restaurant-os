# Restaurant OS

Complete restaurant management system with customer ordering, kitchen display, delivery tracking, and owner dashboard.

## Features

- Customer ordering interface
- Kitchen display system
- Delivery management
- Staff management
- Owner dashboard with analytics
- Multi-role authentication

## Technologies

- React + TypeScript
- Vite
- Tailwind CSS + shadcn-ui
- Appwrite (Auth & Database)
- React Router
- React Query

## Getting Started

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Setup

Create a `.env` file with your Appwrite credentials:

```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
```

## Appwrite Setup

1. Create a new project in [Appwrite Console](https://cloud.appwrite.io)
2. Create a database and note the Database ID
3. Create the following collections:
   - `tenants` - Restaurant tenant information
   - `profiles` - User profiles
   - `user_roles` - User role assignments
   - `menu_items` - Menu items
   - `orders` - Customer orders
   - `order_items` - Order line items
4. Configure authentication methods (Email/Password)
5. Update your `.env` file with the credentials
