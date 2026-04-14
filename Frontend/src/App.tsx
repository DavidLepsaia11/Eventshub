// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';

import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

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
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/register"   element={<RegisterPage />} />

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
