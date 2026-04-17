// src/components/ProtectedRoute.tsx
// Wraps routes that require any authenticated user.
// Redirects to /login if the user is not authenticated, preserving the intended
// destination in location state so LoginPage can redirect back after a successful login.

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}
