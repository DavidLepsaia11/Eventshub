// src/api/events.ts
// All API calls for the /api/events resource.
// Base URL is read exclusively from import.meta.env.VITE_API_URL — never hardcoded.

import type { EventDto, CreateEventDto, UpdateEventDto, CategoryDto } from '@/types/event';

const BASE = import.meta.env.VITE_API_URL as string;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body?.message ?? body?.title ?? message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

// GET /api/categories
export function fetchCategories(): Promise<CategoryDto[]> {
  return request<CategoryDto[]>('/api/categories');
}

// GET /api/events
export function fetchEvents(): Promise<EventDto[]> {
  return request<EventDto[]>('/api/events');
}

// GET /api/events/:id
export function fetchEvent(id: number): Promise<EventDto> {
  return request<EventDto>(`/api/events/${id}`);
}

// Builds a FormData from a DTO + optional cover image file
// removeCoverImage=true  → user explicitly removed the image (backend should delete it)
// removeCoverImage=false + no file → user didn't touch it (backend should keep existing)
// coverImage provided → user picked a new file (backend should replace it)
function buildFormData(
  dto: CreateEventDto | UpdateEventDto,
  coverImage?: File | null,
  removeCoverImage?: boolean,
): FormData {
  const fd = new FormData();
  fd.append('title', dto.title);
  fd.append('description', dto.description);
  fd.append('location', dto.location);
  fd.append('startDate', dto.startDate);
  fd.append('endDate', dto.endDate);
  fd.append('isPublished', String(dto.isPublished));
  if (dto.categoryId != null) fd.append('categoryId', String(dto.categoryId));
  if (coverImage) {
    fd.append('coverImage', coverImage);
  } else {
    fd.append('removeCoverImage', String(!!removeCoverImage));
  }
  return fd;
}

// POST /api/events
export function createEvent(dto: CreateEventDto, coverImage?: File | null): Promise<EventDto> {
  return request<EventDto>('/api/events', {
    method: 'POST',
    body: buildFormData(dto, coverImage),
  });
}

// PUT /api/events/:id
// coverImage = new File to upload, null = no change or explicit remove
// removeCoverImage = true means user clicked "Remove" in the form
export function updateEvent(
  id: number,
  dto: UpdateEventDto,
  coverImage?: File | null,
  removeCoverImage?: boolean,
): Promise<EventDto> {
  return request<EventDto>(`/api/events/${id}`, {
    method: 'PUT',
    body: buildFormData(dto, coverImage, removeCoverImage),
  });
}

// DELETE /api/events/:id  → 204
export function deleteEvent(id: number): Promise<void> {
  return request<void>(`/api/events/${id}`, { method: 'DELETE' });
}
