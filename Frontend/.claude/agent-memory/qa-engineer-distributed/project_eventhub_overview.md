---
name: EventHub Project Overview
description: Full project context for EventHub — purpose, tech stack, architecture, roles, base URLs, and project state as of April 2026
type: project
---

EventHub is a full-stack event discovery and management platform. An Admin creates/publishes events; authenticated Visitors browse, favourite, and RSVP (going) to events; Guests can browse only.

**Base URLs:**
- API: http://localhost:5000 (HTTP) / https://localhost:7021 (HTTPS, dev)
- Frontend: http://localhost:5173

**Why:** Multi-agent educational/portfolio project at Caucasus University, Tbilisi, Georgia. Built by David Lepsaia (davidlepsaia11@gmail.com).

**How to apply:** Always use these base URLs in test scripts. Scalar docs available at /scalar/v1 in dev (purple theme).

## Backend Stack
- ASP.NET Core (.NET 10), Clean Architecture (Domain → Application → Infrastructure → WebApi)
- EF Core 10 + SQL Server (MSSQL)
- ASP.NET Identity + JWT Bearer (40-min expiry, jti claim, in-memory token blacklist)
- Roles: `Admin` / `Visitor` (constants in EventsHub.Application.Constants.Roles)
- Default seeded admin: admin@eventshub.com / Admin123!
- CORS restricted to http://localhost:5173

## Frontend Stack
- React 18 + TypeScript, Vite 5, strict mode
- TanStack Query v5 (React Query) — all server state
- React Router v6 (BrowserRouter)
- Tailwind CSS v3
- React Hook Form v7 (EventForm only)
- date-fns v3, lucide-react
- Native fetch (no axios) via request<T>() helper in src/api/client.ts
- JWT stored in localStorage (key: eventhub_token), user data in localStorage (key: eventhub_user)
- Auto-logout scheduled by JWT exp claim via setTimeout in AuthContext.tsx

## Project Status (April 2026)
### Done
- Full CRUD for events (Admin) with IsPublished filter, server-side paging, search, category filter
- Favourites toggle + list (Visitor)
- EventAttendance (Going) toggle + list (Visitor)
- Auth: register (201) / login / logout (blacklist revocation)
- Dual-mode EventsPage: ExploreView (Visitors/Guests) + AdminView (Admins)
- Route guards: ProtectedRoute (Visitor), AdminRoute (Admin)
- Optimistic UI for favourite/going toggles

### Not Built Yet
- CalendarPage (/calendar route is /going, not calendar view)
- Toast notification system
- Frontend logout NOT yet wired to POST /api/auth/logout (local-only cleanup)
