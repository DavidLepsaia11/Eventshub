---
name: EventHub Pages and Routes
description: All pages, their routes, access roles, and key UI features for the EventHub application
type: project
---

**Why:** Documented from App.tsx and all page files to give instant context for design work on any view.
**How to apply:** Reference when designing any new page or component to ensure consistency with existing navigation and role-based UI patterns.

## Route Map

| Route | Component | Access | Key Features |
|---|---|---|---|
| / | EventsPage | Public | Hero section, category filter chips, event card grid, pagination |
| /events/:id | EventDetailPage | Public | Cover hero (380px), two-column layout, sidebar with date/time/location, fav+going toggles |
| /login | LoginPage | Public (guest) | Split two-column: left=brand panel, right=form |
| /register | RegisterPage | Public (guest) | Split two-column: left=brand panel, right=form (4 fields) |
| /favourites | FavouritesPage | Visitor only | Page header with heart icon, event card grid |
| /going | GoingPage | Visitor only | Month calendar view + List view toggle |
| /admin | AdminPage | Admin only | Stat cards (4), event table with CRUD |
| /admin/events/new | AdminEventFormPage | Admin only | Multi-section form: Basic Info, Date & Time, Cover Photo, Visibility |
| /admin/events/:id/edit | AdminEventFormPage | Admin only | Same form, pre-filled with existing event data |

## User Roles
- **Guest (unauthenticated)**: Can browse events, view detail pages, see login/register
- **Visitor (authenticated, non-admin)**: + Favourites page, Going/Calendar page, heart/going toggles on cards
- **Admin**: + Admin dashboard, create/edit/delete events, sees draft/published status on all views

## EventsPage Dual Mode
The EventsPage renders TWO different views based on role:
- ExploreView (Visitors/Guests): search + category filter chips
- AdminView (Admins): search + published/draft filter tabs

## Key Component: EventCard
Used in EventsPage, FavouritesPage, and AdminPage grid view.
- showStatus=false → shows category badge (explore mode)
- showStatus=true → shows Published/Draft badge (admin mode)
- Visitor overlay: heart (fav) + calendar-check (going) buttons top-right of cover
- Cover: 175px tall, gradient fallback with emoji if no coverImageUrl

## Key Component: Navbar
Adapts by auth state:
- Guest: Sign in + Register buttons
- Visitor: Favourites + Going nav links + avatar + sign out
- Admin: Admin nav link + violet "Admin" badge + avatar + sign out
