// src/api/events.ts
// All API calls for the /api/events resource.
// Base URL is read exclusively from import.meta.env.VITE_API_URL — never hardcoded.

import type { EventDto, CreateEventDto, UpdateEventDto, CategoryDto, PagedResultDto } from '@/types/event';

const BASE = import.meta.env.VITE_API_URL as string;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('eventhub_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const merged: RequestInit = {
    ...options,
    headers: {
      // For FormData let the browser set Content-Type with boundary automatically
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders(),
      ...(options?.headers as Record<string, string> | undefined),
    },
  };
  const res = await fetch(`${BASE}${path}`, merged);

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      // ASP.NET Core model validation returns { errors: { Field: ["msg", ...] } }
      if (body?.errors && typeof body.errors === 'object') {
        const messages = Object.values(body.errors as Record<string, string[]>)
          .flat()
          .filter(Boolean);
        if (messages.length > 0) {
          message = messages.join(' · ');
        }
      } else {
        message = body?.message ?? body?.title ?? message;
      }
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

// GET /api/events?page=&pageSize=
export function fetchEvents(page = 1, pageSize = 20): Promise<PagedResultDto<EventDto>> {
  return request<PagedResultDto<EventDto>>(`/api/events?page=${page}&pageSize=${pageSize}`);
}

// GET /api/events — fetches ALL events in one shot (used when a client-side filter is active).
// The backend does not support search/category query params, so the only correct way to filter
// across all pages is to request the full dataset. Call this only when filtering is active.
export async function fetchAllEvents(): Promise<EventDto[]> {
  // First request with a large pageSize to get totalCount, then fetch remaining if needed.
  const first = await request<PagedResultDto<EventDto>>('/api/events?page=1&pageSize=200');
  if (first.totalCount <= 200) return first.items;

  // More than 200 events: fetch the rest page by page (edge case for large datasets)
  const remaining: EventDto[] = [...first.items];
  const totalPages = Math.ceil(first.totalCount / 200);
  const requests = Array.from({ length: totalPages - 1 }, (_, i) =>
    request<PagedResultDto<EventDto>>(`/api/events?page=${i + 2}&pageSize=200`),
  );
  const pages = await Promise.all(requests);
  for (const p of pages) remaining.push(...p.items);
  return remaining;
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
