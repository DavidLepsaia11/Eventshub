// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import GuestRoute from '@/components/GuestRoute';

import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';

import FavouritesPage from '@/pages/FavouritesPage';
import GoingPage from '@/pages/GoingPage';
import AdminPage from '@/pages/admin/AdminPage';
import AdminEventFormPage from '@/pages/admin/AdminEventFormPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"           element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />

        {/* Guest only */}
        <Route element={<GuestRoute />}>
          <Route path="/login"            element={<LoginPage />} />
          <Route path="/register"         element={<RegisterPage />} />
          <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
          <Route path="/reset-password"   element={<ResetPasswordPage />} />
        </Route>

        {/* Visitor protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/going"      element={<GoingPage />} />
        </Route>

        {/* Admin only */}
        <Route element={<AdminRoute />}>
          <Route path="/admin"                 element={<AdminPage />} />
          <Route path="/admin/events/new"      element={<AdminEventFormPage />} />
          <Route path="/admin/events/:id/edit" element={<AdminEventFormPage />} />
        </Route>
      </Routes>
    </div>
  );
}
