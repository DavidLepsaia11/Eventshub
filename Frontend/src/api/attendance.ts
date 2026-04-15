// src/api/attendance.ts
// Attendance (Going) API — requires Visitor role Bearer token.

import type { EventDto } from '@/types/event';

const BASE = import.meta.env.VITE_API_URL as string;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('eventhub_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(init?.headers as Record<string, string> | undefined) },
  });
  if (!res.ok) {
    let message = res.statusText;
    try { const b = await res.json(); message = b?.message ?? b?.title ?? message; } catch { /* ignore */ }
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export interface ToggleAttendanceResponse {
  eventId: number;
  isGoing: boolean;
}

// POST /api/EventAttendance/{eventId}/toggle
export function toggleAttendance(eventId: number): Promise<ToggleAttendanceResponse> {
  return request<ToggleAttendanceResponse>(`/api/EventAttendance/${eventId}/toggle`, { method: 'POST' });
}

// GET /api/EventAttendance
export function fetchGoingEvents(): Promise<EventDto[]> {
  return request<EventDto[]>('/api/EventAttendance');
}
