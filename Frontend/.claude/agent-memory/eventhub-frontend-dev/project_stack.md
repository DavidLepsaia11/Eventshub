---
name: EventHub Frontend Stack & Conventions
description: Tech stack, styling approach, API layer, and key conventions established during initial scaffold
type: project
---

Vite + React 18 + TypeScript project scaffolded from scratch (not via create-vite CLI — files written manually). Build is clean, zero TS errors.

**Why:** The create-vite CLI cancelled interactively in this Windows environment, so all config files were written by hand.

**Stack:**
- Vite 5, React 18, TypeScript strict mode
- Tailwind CSS v3 — chosen over CSS Modules for all styling
- React Router v6 (BrowserRouter)
- TanStack Query v5 (React Query) — all data fetching, cache invalidation via queryClient.invalidateQueries
- React Hook Form v7 — used in EventForm component
- date-fns v3 — all date formatting (format, parseISO)
- lucide-react — all icons
- fetch() (not axios) — project uses native fetch wrapped in a typed request<T> helper in src/api/events.ts

**API layer:**
- All calls live in src/api/events.ts
- Base URL from import.meta.env.VITE_API_URL (set in .env as http://localhost:5000)
- Typed request<T> helper handles non-ok responses and 204 No Content

**Tailwind extensions (tailwind.config.js):**
- brand-600 = #2563EB (primary)
- Custom border-radius scale: xs=6px, sm=10px, md=14px, lg=18px, xl=24px
- Custom shadows: brand, brand-lg, xs, sm, md, lg, xl
- backgroundImage: brand-gradient, brand-deep, hero-mesh
- Font: Inter (Google Fonts loaded in index.html)

**Routes:**
- / → EventsPage (public, hero + grid)
- /events/:id → EventDetailPage
- /admin → AdminPage (table with CRUD)
- /admin/events/new → AdminEventFormPage (create)
- /admin/events/:id/edit → AdminEventFormPage (edit)

**How to apply:** Always use fetch via src/api/events.ts, never axios or a new fetch wrapper. Always use Tailwind utility classes — no CSS Modules. Use TanStack Query for all server state; no useState for remote data.
