---
name: EventHub Domain Entities and Architecture
description: Domain model, Clean Architecture layers, identity setup, token blacklist, and key architectural rules
type: project
---

**Why:** Understanding the domain model is essential for writing valid test data and understanding invariants.

**How to apply:** Use these entity shapes when constructing test fixtures and verifying DB state.

## Domain Entities (EventsHub.Domain/Entities/)

### Event
```csharp
int Id, string Title, string Description, string Location,
DateTime StartDate, DateTime EndDate, bool IsPublished,
string? CoverImageUrl, int CategoryId, Category? Category,
DateTime CreatedAt, DateTime? UpdatedAt
```

### Category
```csharp
int Id, string Name, ICollection<Event> Events
```

### Favourite (join table)
```csharp
int Id, string UserId, int EventId, Event? Event, DateTime CreatedAt
```
- UserId = ASP.NET Identity user GUID string

### EventAttendance (join table)
```csharp
int Id, string UserId, int EventId, Event? Event, DateTime CreatedAt
```

### ApplicationUser (Identity)
- Extends IdentityUser
- Roles: "Admin", "Visitor" (string constants in Roles class)

## Clean Architecture Layers

| Layer | Project | Contents |
|-------|---------|---------|
| Domain | EventsHub.Domain | Entities only — no EF/Identity/HTTP |
| Application | EventsHub.Application | DTOs, Interfaces (IRepository, IService), Services, Mappers, Constants |
| Infrastructure | EventsHub.Infrastructure | EF Core DbContext, Repositories, Identity (ApplicationUser), Migrations, AuthService |
| WebApi | EventsHub.WebApi | Controllers, JwtTokenService, LocalFileStorageService, TokenBlacklistService, Program.cs |

## Key Architectural Rules (from INSTRUCTIONS.md)
- IQueryable never leaves the repository layer
- User ID always from JWT ClaimTypes.NameIdentifier — never from request body
- Role names always via Roles.Admin / Roles.Visitor constants
- All write endpoints require [Authorize]
- Layer boundaries are strict — no bleed across layers

## Token Blacklist
- In-memory (IMemoryCache), keyed by "blacklist_" + jti claim
- Self-expiring: cache entry expires at token's original expiry
- Per-process: cleared on server restart
- Risk R-001: acceptable for MVP

## Password Policy (ASP.NET Identity)
RequireDigit=true, RequiredLength=6, RequireUppercase=true, RequireLowercase=true, RequireNonAlphanumeric=false

## Seeded Admin Credentials
- Email: admin@eventshub.com
- Password: Admin123!
- Role: Admin (assigned at startup)

## CORS Policy
- Policy name: "FrontendPolicy"
- Origin whitelist: http://localhost:5173 only
- AllowAnyHeader, AllowAnyMethod
