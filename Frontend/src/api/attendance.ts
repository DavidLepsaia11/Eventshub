// src/api/attendance.ts
// Attendance (Going) API — requires Visitor role Bearer token.

import type { EventDto } from '@/types/event';
import { request } from './client';

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
