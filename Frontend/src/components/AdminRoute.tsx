// src/components/AdminRoute.tsx
// Wraps routes that require the Admin role.
// Redirects to / if the user is not authenticated or does not have Admin role.

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin)         return <Navigate to="/" replace />;
  return <Outlet />;
}
