# Admin Dashboard Routing Guide

## Overview
The admin dashboard is accessible through the `/admin` path with proper authentication and role-based access control.

## Routes

### Main Admin Dashboard
- **Path**: `/admin`
- **Component**: `AdminControls`
- **Access**: Requires `admin` or `super_admin` role
- **Features**:
  - Dashboard overview
  - Theme controls
  - Feature toggles
  - Product management
  - Category management
  - Order management
  - User role management
  - CMS pages
  - Analytics
  - AI settings

### Multi-Store Admin
- **Path**: `/admin/multi-store`
- **Component**: `MultiStoreAdmin`
- **Access**: Requires `super_admin` role only
- **Features**:
  - Store management
  - CMS page builder
  - Bulk operations

## Authentication Flow

### 1. Unauthenticated Users
- Accessing `/admin` redirects to `/auth` (login page)
- User must authenticate before accessing admin features

### 2. Authenticated Non-Admin Users
- Access denied message displayed
- Cannot access any admin features
- Must have `admin` or `super_admin` role in database

### 3. Authenticated Admin Users
- Full access to `/admin` dashboard
- Role-based feature visibility within dashboard

### 4. Authenticated Super Admin Users
- Full access to `/admin` dashboard
- Additional access to `/admin/multi-store`
- Highest level of privileges

## Security Implementation

### Role-Based Access Control (RBAC)
- Roles stored in `user_roles` table in Supabase
- Server-side validation using RLS policies
- No client-side credential storage
- Roles: `super_admin`, `admin`, `manager`, `content_creator`, `inventory_manager`, `marketing_manager`, `support_agent`, `user`

### Authentication Hook
```typescript
const { user, loading: authLoading } = useAuth();
const { isAdmin, isSuperAdmin, loading: roleLoading } = useUserRole();
```

### Protection Pattern
1. Check if user is authenticated
2. Check if user has required role
3. Redirect or show access denied if unauthorized
4. Display loading state during auth checks

## Adding New Admin Routes

To add a new admin route:

1. **Create the admin component**:
```typescript
// src/pages/admin/MyNewAdminPage.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function MyNewAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || roleLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <div>Access Denied</div>;
  }

  return <div>My Admin Page Content</div>;
}
```

2. **Add route in App.tsx**:
```typescript
<Route path="/admin/my-route" element={<MyNewAdminPage />} />
```

3. **Add navigation link** (if needed):
Update `AdminSidebar.tsx` to include the new route

## Folder Structure

```
src/
├── pages/
│   ├── AdminControls.tsx          # Main admin dashboard (/admin)
│   ├── MultiStoreAdmin.tsx        # Multi-store admin (/admin/multi-store)
│   └── Auth.tsx                   # Login/signup page
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx       # Admin navigation
│       ├── DashboardOverview.tsx  # Dashboard home
│       ├── ProductManagement.tsx  # Product CRUD
│       ├── CategoryManagement.tsx # Category CRUD
│       └── ...                    # Other admin components
├── hooks/
│   └── useUserRole.ts             # Role checking hook
└── contexts/
    └── AuthContext.tsx            # Auth state management
```

## Testing Admin Access

### As Admin User
1. Log in with admin credentials
2. Navigate to `/admin`
3. Should see full admin dashboard
4. Cannot access `/admin/multi-store` (super admin only)

### As Super Admin User
1. Log in with super admin credentials (epixshots001@gmail.com)
2. Navigate to `/admin`
3. Should see full admin dashboard
4. Can access `/admin/multi-store`

### As Regular User
1. Log in with regular user credentials
2. Navigate to `/admin`
3. Should see "Access Denied" message

### As Unauthenticated User
1. Navigate to `/admin`
2. Should redirect to `/auth` login page

## Common Issues

### "Access Denied" for Admin User
- Verify user has correct role in `user_roles` table
- Check `useUserRole` hook is returning correct data
- Ensure RLS policies allow role reading

### Redirect Loop
- Check authentication state is properly initialized
- Verify `useEffect` dependencies are correct
- Ensure loading states are handled

### Route Not Found
- Verify route is added in `App.tsx`
- Check component import path is correct
- Ensure route path matches navigation links

## Best Practices

1. **Always use role-based access**: Never hardcode credentials or use localStorage for auth
2. **Handle loading states**: Show loading UI while checking auth/roles
3. **Redirect early**: Check auth in `useEffect` and redirect before rendering
4. **Clear error messages**: Show helpful messages for access denied
5. **Server-side validation**: Always validate roles on backend too
6. **Consistent patterns**: Use same auth pattern across all admin pages
