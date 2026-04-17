// src/api/events.ts
// All API calls for the /api/events resource.
// Shared fetch primitives (BASE, authHeaders, request) live in ./client.

import type { EventDto, CreateEventDto, UpdateEventDto, CategoryDto, PagedResultDto } from '@/types/event';
import { BASE, request } from './client';

// GET /api/categories
export function fetchCategories(): Promise<CategoryDto[]> {
  return request<CategoryDto[]>('/api/categories');
}

// GET /api/events?page=&pageSize=[&search=][&categoryId=]
export function fetchEvents(
  page = 1,
  pageSize = 20,
  search?: string,
  categoryId?: number,
): Promise<PagedResultDto<EventDto>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search && search.trim() !== '') params.set('search', search.trim());
  if (categoryId != null) params.set('categoryId', String(categoryId));
  return request<PagedResultDto<EventDto>>(`/api/events?${params.toString()}`);
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

// Resolves a server-relative image path to an absolute URL.
// Absolute URLs (starting with "http") are returned as-is.
// Relative paths (e.g. "/uploads/events/image.jpg") are prefixed with the API base URL.
// This is the ONLY place VITE_API_URL should be used outside of request functions.
export function resolveMediaUrl(url: string): string {
  return url.startsWith('http') ? url : `${BASE}${url}`;
}
