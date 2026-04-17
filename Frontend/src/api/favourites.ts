// src/api/favourites.ts
// Favourites API — requires Visitor role Bearer token.

import type { EventDto } from '@/types/event';
import { request } from './client';

export interface ToggleFavouriteResponse {
  eventId: number;
  isFavourited: boolean;
}

// POST /api/Favourites/{eventId}/toggle
export function toggleFavourite(eventId: number): Promise<ToggleFavouriteResponse> {
  return request<ToggleFavouriteResponse>(`/api/Favourites/${eventId}/toggle`, { method: 'POST' });
}

// GET /api/Favourites
export function fetchFavourites(): Promise<EventDto[]> {
  return request<EventDto[]>('/api/Favourites');
}
