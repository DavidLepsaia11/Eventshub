---
name: EventHub Design System
description: Complete design tokens, color palette, typography, and component patterns for the EventHub events platform
type: project
---

**Why:** Extracted from live codebase (tailwind.config.js, index.css, all pages/components) to inform future design work on this project.

## Brand Color Palette

| Token | Hex | Usage |
|---|---|---|
| brand-50 | #EFF6FF | Backgrounds, chip hover states, badge backgrounds |
| brand-100 | #DBEAFE | Light backgrounds |
| brand-200 | #BFDBFE | Hover borders |
| brand-300 | #93C5FD | Feature icon accents (left panels) |
| brand-400 | #60A5FA | Hero gradient start |
| brand-500 | #3B82F6 | Mid brand |
| brand-600 | #2563EB | **PRIMARY** — buttons, active states, icons |
| brand-700 | #1D4ED8 | Button hover |
| brand-800 | #1E40AF | Dark brand |
| brand-900 | #1E3A8A | Darkest brand, left panel gradient start |

## Slate (Neutral) Scale

slate-50 #F8FAFC · slate-100 #F1F5F9 · slate-200 #E2E8F0 · slate-300 #CBD5E1
slate-400 #94A3B8 · slate-500 #64748B · slate-600 #475569 · slate-700 #334155
slate-800 #1E293B · slate-900 #0F172A

## Semantic Background Colors (used by category/status)
- Blue gradient: #1E3A8A → #2563EB → #38BDF8
- Green gradient: #064E3B → #059669 → #34D399
- Purple gradient: #4C1D95 → #7C3AED → #A78BFA
- Amber gradient: #78350F → #D97706 → #FCD34D
- Rose gradient: #831843 → #E11D48 → #FB7185
- Cyan gradient: #0C4A6E → #0EA5E9 → #7DD3FC

## Typography
- Font: Inter (Google Fonts CDN)
- Weights used: 300, 400, 500, 600, 700, 800, 900
- Page titles: 22–30px, font-weight 800–900, tracking -0.4px to -0.6px
- Hero heading: 52px, font-weight 900, tracking -1.5px
- Body: 14–15px, font-weight 400–500
- Labels/captions: 11–13px

## Shadows
- shadow-brand: 0 4px 14px rgba(37,99,235,0.35)
- shadow-brand-lg: 0 6px 20px rgba(37,99,235,0.40)
- shadow-xs: 0 1px 2px rgba(0,0,0,0.05)
- shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)
- shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)

## Border Radii (custom tokens)
- xs: 6px · sm: 10px · md: 14px · lg: 18px · xl: 24px

## Background Gradients (named)
- brand-gradient: linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)
- brand-deep: linear-gradient(155deg, #1E3A8A 0%, #2563EB 50%, #0EA5E9 100%)
- hero-mesh: triple radial gradient with blue/cyan/violet

## Navbar
- Height: 60px, sticky, bg-white/92 with backdrop-blur-nav (12px)
- Logo: 32x32px rounded-8px brand-gradient icon + "EventHub" 17px extrabold
- Nav links: 13.5px font-medium, active = text-brand-600 bg-brand-50 font-semibold
- Max content width: 1300px, horizontal padding: 28px (px-7)

## How to apply:
When proposing any new UI for EventHub, use these exact token values. Don't deviate to generic Material/Bootstrap colors. The brand-600 (#2563EB) is the single source-of-truth primary.
