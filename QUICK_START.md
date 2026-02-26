# Quick Start Guide

Get your Restaurant OS up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Appwrite account (free at [cloud.appwrite.io](https://cloud.appwrite.io))

## Step 1: Clone & Install

```bash
# Install dependencies
npm install
```

## Step 2: Set Up Appwrite

### 2.1 Create Appwrite Project
1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Create a new project
3. Note your Project ID

### 2.2 Create Database
1. Navigate to Databases
2. Create a new database
3. Note your Database ID

### 2.3 Create Collections
Create these collections with the specified attributes:

**tenants:**
- name (string, required)
- slug (string, required, unique)
- status (enum: onboarding, active, suspended)
- settings (string, optional)

**profiles:**
- user_id (string, required, unique)
- full_name (string, optional)
- phone (string, optional)

**user_roles:**
- user_id (string, required)
- tenant_id (string, required)
- role (enum: owner, manager, kitchen, waiter, delivery, customer)

**menu_items:**
- tenant_id (string, required)
- name (string, required)
- price (float, required)
- is_available (boolean, default: true)
- is_veg (boolean, default: false)

**orders:**
- tenant_id (string, required)
- customer_id (string, optional)
- status (enum: pending, confirmed, preparing, ready, picked_up, delivered, cancelled)
- total (float, required)
- source (string, required)

**order_items:**
- order_id (string, required)
- menu_item_id (string, required)
- quantity (integer, required)
- price (float, required)

### 2.4 Enable Authentication
1. Go to Auth settings
2. Enable Email/Password authentication
3. Configure your app's domain

## Step 3: Configure Environment

Create a `.env` file in the project root:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
```

Replace the values with your actual Appwrite credentials.

## Step 4: Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

The app will be available at `http://localhost:8080`

## Step 5: Create Your First User

1. Navigate to the signup page
2. Create an account with email and password
3. You'll be redirected to the onboarding flow

## Common Issues & Solutions

### Issue: "Cannot connect to Appwrite"
**Solution:** Check your environment variables and ensure Appwrite project is active.

### Issue: "Collection not found"
**Solution:** Verify all collections are created with correct IDs in Appwrite Console.

### Issue: "Authentication failed"
**Solution:** Ensure Email/Password auth is enabled in Appwrite Console.

### Issue: "Permission denied"
**Solution:** Check collection permissions in Appwrite Console.

## Development Tips

### Hot Reload
The dev server supports hot module replacement. Changes will reflect immediately.

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Building for Production
```bash
npm run build
```

## Project Structure

```
restaurant-os/
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # shadcn-ui components
│   │   ├── CustomerApp.tsx
│   │   ├── KitchenDisplay.tsx
│   │   └── ...
│   ├── contexts/       # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/           # Utilities & config
│   │   ├── appwrite.ts
│   │   └── utils.ts
│   ├── pages/         # Page components
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── ...
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── .env              # Environment variables
└── package.json      # Dependencies
```

## Key Features

### Multi-Role System
- **Owner:** Full access to all features
- **Manager:** Manage staff and operations
- **Kitchen:** View and update orders
- **Waiter:** Take and manage orders
- **Delivery:** Track deliveries
- **Customer:** Place orders

### Authentication
- Email/Password signup and login
- Secure session management
- Role-based access control

### Database
- Multi-tenant architecture
- Real-time updates (coming soon)
- Optimized queries with indexes

## Next Steps

1. **Customize Branding:** Update colors, logo, and theme
2. **Add Menu Items:** Populate your restaurant menu
3. **Invite Staff:** Add team members with appropriate roles
4. **Configure Settings:** Set up restaurant details
5. **Test Orders:** Place test orders to verify workflow

## Need Help?

- 📖 Read the [Migration Guide](MIGRATION_GUIDE.md)
- 🔧 Check [Appwrite Setup](APPWRITE_SETUP.md)
- ⚡ See [Optimizations](OPTIMIZATIONS.md)
- 📝 Review [Refactoring Summary](REFACTORING_SUMMARY.md)

## Support

- **Appwrite Issues:** [Appwrite Discord](https://appwrite.io/discord)
- **Project Issues:** Create an issue in the repository
- **Documentation:** [Appwrite Docs](https://appwrite.io/docs)

---

Happy coding! 🚀
