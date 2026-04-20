---
name: EventHub API Endpoints (Ground Truth)
description: Authoritative endpoint list derived from actual controller source — corrects stale info in 04_Tester_Agent.md
type: project
---

**CRITICAL NOTE:** The 04_Tester_Agent.md file contains stale information. The actual endpoints differ. This file is the ground truth sourced from the C# controllers.

**Why:** The INSTRUCTIONS.md "Known Stale Information" table explicitly flags that the Tester MD references .NET 8, Dapper, /api/admin/events routes, and POST-not-toggle semantics — all wrong.

**How to apply:** Always use endpoints below when writing test scripts. Never use /api/admin/events or assume 409 for duplicate favourite/attendance.

## AUTH — /api/Auth (AuthController.cs)

| Method | Route | Auth | Request Body | Success Response | Notes |
|--------|-------|------|-------------|-----------------|-------|
| POST | /api/Auth/register | None | RegisterDto: UserName(max50), Email, Password(min6) | 201 AuthResponseDto | InvalidOperationException → 400 |
| POST | /api/Auth/login | None | LoginDto: Email, Password | 200 AuthResponseDto | null result → 401 |
| POST | /api/Auth/logout | [Authorize] any | None | 200 { message } | Revokes jti in in-memory blacklist |

**AuthResponseDto:** `{ token, userId, userName, email, roles: string[] }`

**RegisterDto constraints:**
- Password: RequireDigit=true, RequiredLength=6, RequireUppercase=true, RequireLowercase=true, RequireNonAlphanumeric=false
- Email: RequireUniqueEmail=true

## EVENTS — /api/Events (EventsController.cs)

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| GET | /api/Events | None (role-aware) | Admin → all events; Visitor/Guest → published only. Query params: page, pageSize, search, categoryId. Returns PagedResultDto<EventDto> |
| GET | /api/Events/{id} | None (role-aware) | Admin → any; Visitor/Guest → 404 if not published |
| POST | /api/Events | [Authorize(Roles=Admin)] | [FromForm] CreateEventDto (multipart) |
| PUT | /api/Events/{id} | [Authorize(Roles=Admin)] | [FromForm] UpdateEventDto (multipart) |
| DELETE | /api/Events/{id} | [Authorize(Roles=Admin)] | 204 No Content / 404 |

**EventDto response shape:**
```
{
  id, title, description, location,
  startDate (ISO), endDate (ISO),
  isPublished, coverImageUrl?,
  categoryId, categoryName,
  createdAt, updatedAt?,
  isFavourited?, isGoing?
}
```

**CreateEventDto / UpdateEventDto (multipart/form-data):**
```
title (required, max200), description (max2000), location (required, max500),
startDate (required), endDate (required), isPublished (bool),
coverImage (IFormFile?), removeCoverImage (bool), categoryId (required int)
```

**PagedResultDto<T> shape:**
```
{ items, page, pageSize, totalCount, totalPages, publishedCount, draftCount }
```

## FAVOURITES — /api/Favourites (FavouritesController.cs)

**Controller-level:** [Authorize(Roles=Visitor)] — Admin cannot use these endpoints

| Method | Route | Success Response | Notes |
|--------|-------|-----------------|-------|
| POST | /api/Favourites/{eventId}/toggle | 200 ToggleFavouriteResponseDto | TOGGLE — idempotent. Not 201/409 — always 200 |
| GET | /api/Favourites | 200 IEnumerable<EventDto> | Only this user's favourites |

**ToggleFavouriteResponseDto:** `{ eventId: int, isFavourited: bool }`

**IMPORTANT:** NOT POST/DELETE semantics. It's a toggle. Calling again removes the favourite. No 409 Conflict.

## ATTENDANCE — /api/EventAttendance (EventAttendanceController.cs)

**Controller-level:** [Authorize(Roles=Visitor)] — Admin cannot use these endpoints

| Method | Route | Success Response | Notes |
|--------|-------|-----------------|-------|
| POST | /api/EventAttendance/{eventId}/toggle | 200 ToggleAttendanceResponseDto | TOGGLE — idempotent |
| GET | /api/EventAttendance | 200 IEnumerable<EventDto> | Only this user's going events |

**ToggleAttendanceResponseDto:** `{ eventId: int, isGoing: bool }`

## CATEGORIES — /api/Categories (CategoriesController.cs)

| Method | Route | Auth | Response |
|--------|-------|------|----------|
| GET | /api/Categories | None | 200 IEnumerable<CategoryDto> |

**CategoryDto:** `{ id: int, name: string }`
