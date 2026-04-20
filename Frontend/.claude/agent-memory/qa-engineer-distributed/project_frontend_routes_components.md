---
name: EventHub Frontend Routes and Key Components
description: All routes, access guards, page components, and reusable component APIs for the EventHub frontend
type: project
---

**Why:** Route guard logic and component prop APIs are critical for writing accurate frontend and E2E test cases.

**How to apply:** Reference when writing route guard tests, form validation tests, and UI behaviour tests.

## Route Map (App.tsx)

| Route | Component | Guard | Access |
|-------|-----------|-------|--------|
| / | EventsPage | None | Public |
| /events/:id | EventDetailPage | None | Public |
| /login | LoginPage | None | Public (guest) |
| /register | RegisterPage | None | Public (guest) |
| /favourites | FavouritesPage | ProtectedRoute | Visitor (isAuthenticated) |
| /going | GoingPage | ProtectedRoute | Visitor (isAuthenticated) |
| /admin | AdminPage | AdminRoute | Admin role only |
| /admin/events/new | AdminEventFormPage | AdminRoute | Admin role only |
| /admin/events/:id/edit | AdminEventFormPage | AdminRoute | Admin role only |

## Auth State (AuthContext.tsx)
- Stored in localStorage: eventhub_token, eventhub_user
- Exposed: user, isAuthenticated, isAdmin, isVisitor, login(), logout()
- Auto-logout: setTimeout based on JWT exp claim fires logout() at expiry
- On logout: calls logoutRequest() (POST /api/Auth/logout) but catches failure — local cleanup always proceeds
- **BUG/GAP (per INSTRUCTIONS.md):** Frontend logout is NOT YET wired to POST /api/auth/logout as of April 2026

## Key Component Interfaces

### EventCard
Props: event: EventDto, showStatus?, isFavourited?, onToggleFavourite?(id, newState), isGoing?, onToggleGoing?(id, newState)
- Navigates to /events/:id on click
- Heart button (top-right, Visitor only): active = red bg
- CalendarCheck button (only if onToggleGoing provided): active = green bg
- Cover: 175px tall, gradient fallback (event.id % 6) if no coverImageUrl
- Parent owns state; EventCard does NOT copy props into local state

### EventForm
Props: defaultValues?, onSubmit(v), onCancel, isSubmitting?, mode: 'create'|'edit'
- Uses React Hook Form v7
- No API calls inside — caller owns mutation
- datetime-local inputs; caller converts ISO → "yyyy-MM-dd'T'HH:mm" before passing defaultValues

### ConfirmDialog
Props: isOpen, title, message, confirmLabel?, onConfirm, onCancel, isLoading?

### Navbar (adapts by auth state)
- Guest: Sign in + Register buttons
- Visitor: Favourites + Going nav links + avatar + sign out
- Admin: Admin nav link + violet "Admin" badge + avatar + sign out

## API Layer Structure
- src/api/client.ts → BASE url, authHeaders(), request<T>() — only file reading VITE_API_URL
- src/api/events.ts → fetchEvents, fetchEvent, createEvent, updateEvent, deleteEvent, resolveMediaUrl
- src/api/favourites.ts → toggle, get favourites
- src/api/attendance.ts → toggle, get going events
- src/api/auth.ts → login, register, logoutRequest

## TanStack Query Keys
- ['events', 'paged', page] — paged event list
- ['events', 'all'] — full event list (admin)
- ['categories'] — category list
- ['favourites'] — user favourites
- ['going'] — user going events
