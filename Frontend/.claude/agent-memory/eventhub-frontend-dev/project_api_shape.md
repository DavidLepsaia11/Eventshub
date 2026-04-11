---
name: EventHub Backend API Shape
description: Confirmed EventDto shape and endpoint signatures from initial scaffold brief
type: project
---

Backend runs at http://localhost:5000. All endpoints are under /api/events.

**EventDto (response shape):**
```ts
{
  id: number
  title: string
  description: string
  location: string
  startDate: string   // ISO 8601
  endDate: string     // ISO 8601
  isPublished: boolean
  createdAt: string
  updatedAt: string | null
}
```

**CreateEventDto / UpdateEventDto (request body):**
```ts
{
  title: string        // required, max 200
  description: string  // max 2000
  location: string     // required, max 500
  startDate: string    // required ISO
  endDate: string      // required ISO
}
```

**Endpoints:**
- GET    /api/events        → EventDto[]
- GET    /api/events/{id}   → EventDto
- POST   /api/events        → 201 EventDto
- PUT    /api/events/{id}   → EventDto
- DELETE /api/events/{id}   → 204 No Content

**Note:** No auth/token endpoints exist yet. No published-only filter on GET /api/events — all events are returned; client-side filtering handles published vs draft.

**How to apply:** Types live in src/types/event.ts. API calls in src/api/events.ts only.
