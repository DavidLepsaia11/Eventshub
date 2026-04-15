---
name: Shared Component Prop APIs
description: Prop interfaces for all reusable components established during scaffold
type: project
---

**Badge** — `variant: 'published'|'draft'|'brand'|'amber'|'red'|'violet'|'cyan'|'slate'`, `children`, `showIcon?: boolean`
- published = emerald, draft = amber, with optional CheckCircle/Clock icon

**LoadingSpinner** — `fullPage?: boolean` (fixed overlay), `size?: number` (px, default 32)

**ErrorMessage** — `message: string`, `onRetry?: () => void`

**PageHeader** — `title: string`, `subtitle?: string`, `actions?: ReactNode`

**ConfirmDialog** — `isOpen: boolean`, `title`, `message`, `confirmLabel?`, `onConfirm`, `onCancel`, `isLoading?`

**EventCard** — `event: EventDto`, `showStatus?: boolean`, `isFavourited?: boolean`, `onToggleFavourite?: (id, newState) => void`, `isGoing?: boolean`, `onToggleGoing?: (id, newState) => void`
- navigates to /events/:id on click, shows deterministic gradient cover based on event.id % 6
- Heart button (top-right cover): active = red bg; only shown when isVisitor
- CalendarCheck button (left of heart): active = green bg; only rendered when `onToggleGoing` prop is provided
- Parent owns canonical state; EventCard never copies props into local state

**EventForm** — `defaultValues?: Partial<EventFormValues>`, `onSubmit: (v) => void`, `onCancel`, `isSubmitting?`, `mode: 'create'|'edit'`
- EventFormValues = CreateEventDto (title, description, location, startDate, endDate)
- datetime-local inputs; caller must convert ISO → "yyyy-MM-dd'T'HH:mm" before passing defaultValues
- No API calls inside — caller owns mutation

**Navbar** — no props; uses NavLink with active state styling

**How to apply:** Always import from @/components/... Use TanStack Query mutations in pages/admin, not inside EventForm.
