# Migration Guide: Supabase to Appwrite

This document outlines the changes made during the migration from Supabase to Appwrite.

## Summary of Changes

### 1. Dependencies
- **Removed:** `@supabase/supabase-js`, `lovable-tagger`
- **Added:** `appwrite`

### 2. Configuration Files

**Before (.env.example):**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**After (.env.example):**
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
```

### 3. Library Files

**Removed:**
- `src/lib/supabase.ts` - Supabase client configuration
- `src/lib/schema.sql` - SQL schema file

**Added:**
- `src/lib/appwrite.ts` - Appwrite client configuration

### 4. Key API Differences

#### Authentication

**Supabase:**
```typescript
// Sign up
await supabase.auth.signUp({ email, password })

// Sign in
await supabase.auth.signInWithPassword({ email, password })

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

**Appwrite:**
```typescript
// Sign up
await account.create('unique()', email, password, name)

// Sign in
await account.createEmailPasswordSession(email, password)

// Sign out
await account.deleteSession('current')

// Get current user
const user = await account.get()
```

#### Database Queries

**Supabase:**
```typescript
// List documents
const { data } = await supabase
  .from('user_roles')
  .select('*')
  .eq('user_id', userId)

// Create document
const { data } = await supabase
  .from('tenants')
  .insert({ name, slug })
  .select()
  .single()
```

**Appwrite:**
```typescript
// List documents
const response = await databases.listDocuments(
  DATABASE_ID,
  COLLECTIONS.USER_ROLES,
  [Query.equal('user_id', userId)]
)

// Create document
const document = await databases.createDocument(
  DATABASE_ID,
  COLLECTIONS.TENANTS,
  ID.unique(),
  { name, slug }
)
```

### 5. Type System Changes

**Supabase:**
- Used `id` for document IDs
- Used `created_at`, `updated_at` for timestamps

**Appwrite:**
- Uses `$id` for document IDs
- Uses `$createdAt`, `$updatedAt` for timestamps
- All system fields are prefixed with `$`

### 6. AuthContext Updates

The `AuthContext` has been completely rewritten to use Appwrite's authentication system:

- Replaced Supabase auth methods with Appwrite equivalents
- Updated user session management
- Implemented proper error handling for Appwrite API calls
- Added role-based access control using Appwrite database queries

## Migration Steps for Developers

1. **Update Environment Variables:**
   - Create an Appwrite project
   - Update `.env` file with Appwrite credentials

2. **Set Up Appwrite Database:**
   - Follow instructions in `APPWRITE_SETUP.md`
   - Create all required collections
   - Configure permissions

3. **Update Import Statements:**
   ```typescript
   // Old
   import { supabase } from '@/lib/supabase'
   
   // New
   import { account, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
   ```

4. **Update Database Queries:**
   - Replace Supabase query syntax with Appwrite equivalents
   - Update field names (`id` → `$id`, `created_at` → `$createdAt`)
   - Use Appwrite's Query helpers for filtering

5. **Test Authentication Flow:**
   - Test signup, login, and logout
   - Verify session persistence
   - Check role-based access control

## Performance Optimizations

1. **Removed Unnecessary Dependencies:**
   - Removed `lovable-tagger` (development tool)
   - Cleaned up unused Supabase packages

2. **Added Build Scripts:**
   - `npm run lint:fix` - Auto-fix linting issues
   - `npm run type-check` - Type checking without build

3. **Code Structure:**
   - Centralized Appwrite configuration
   - Improved type definitions
   - Better error handling

## Breaking Changes

1. **Document ID Format:**
   - Supabase uses UUID v4
   - Appwrite uses custom ID format
   - Update any hardcoded ID references

2. **Timestamp Fields:**
   - Field names changed (snake_case → $camelCase)
   - Update any date formatting logic

3. **Query Syntax:**
   - Completely different query builders
   - Update all database queries

4. **Real-time Subscriptions:**
   - Appwrite uses different real-time API
   - Update any subscription logic (if implemented)

## Rollback Plan

If you need to rollback to Supabase:

1. Restore `src/lib/supabase.ts` from git history
2. Restore `src/contexts/AuthContext.tsx` from git history
3. Run `npm install @supabase/supabase-js`
4. Run `npm uninstall appwrite`
5. Update environment variables back to Supabase

## Support

For Appwrite-specific questions:
- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord](https://appwrite.io/discord)
- [Appwrite GitHub](https://github.com/appwrite/appwrite)
