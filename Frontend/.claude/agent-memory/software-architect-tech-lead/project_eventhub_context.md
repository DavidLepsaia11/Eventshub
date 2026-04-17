---
name: EventsHub Project Context
description: Core project facts — stack, agent files location, key architectural decisions in force
type: project
---

Full-stack events platform. Admin creates/publishes events; Visitor browses, favourites, RSVPs.

Frontend: React 18 + TypeScript, Vite, TanStack Query, react-router-dom v6, Tailwind CSS.
Backend: ASP.NET Core 10, Clean Architecture, EF Core 10, SQL Server, JWT Bearer auth.

Agent MD files: `C:\Users\PCZONE.GE\OneDrive-CaucasusUniversity\Desktop\agents\`
Frontend source: `C:\Users\PCZONE.GE\OneDrive-CaucasusUniversity\Desktop\EventsProjectAI\Frontend\src\`

**Why:** Multi-agent project where each agent has a markdown file defining its contract. The Architect agent (00_Software_Architect_Agent.md) is the authority over all others.

**How to apply:** Always read the agent MD files before reviewing. Findings must be logged in the Architecture Review Log section of 00_Software_Architect_Agent.md. Resolved risks must be marked in the Known Risks table.
