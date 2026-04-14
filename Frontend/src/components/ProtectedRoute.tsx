// src/components/ProtectedRoute.tsx
// Wraps routes that require any authenticated user.
// Redirects to /login if the user is not authenticated.

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
