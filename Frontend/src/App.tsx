// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import AdminPage from '@/pages/admin/AdminPage';
import AdminEventFormPage from '@/pages/admin/AdminEventFormPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/events/new" element={<AdminEventFormPage />} />
        <Route path="/admin/events/:id/edit" element={<AdminEventFormPage />} />
      </Routes>
    </div>
  );
}
