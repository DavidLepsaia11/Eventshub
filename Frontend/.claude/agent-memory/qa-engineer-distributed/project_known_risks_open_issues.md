---
name: EventHub Known Risks and Open Issues
description: Architectural risks from the Architect's watch list and known gaps that affect test strategy
type: project
---

**Why:** These are pre-identified weaknesses that directly inform security test cases, chaos testing scope, and acceptance criteria gaps.

**How to apply:** Always check this list when planning a new test run. Security risks (R-009) and data integrity risks are highest priority.

## Architectural Risks (from INSTRUCTIONS.md)

| Risk ID | Description | Priority | Test Implication |
|---------|-------------|----------|-----------------|
| R-001 | JWT blacklist is in-memory — lost on server restart | Low (MVP acceptable) | Test: after restart, previously-revoked token should still fail (currently it WON'T — known gap) |
| R-002 | File storage is local disk — not portable | Medium | Test: upload coverage only needs local path testing for now |
| R-003 | Favourite/attendance GET loads ALL user data regardless of page count | Low | Test: performance regression test if user has 1000+ favourites |
| R-007 | request<T>() helper was noted as possibly duplicated | Low | Check src/api/*.ts files if seeing inconsistent error handling |
| R-009 | JWT stored in localStorage (XSS risk) | Low (pre-launch fix) | Security test: verify no token leakage via XSS, flag as known risk in reports |

## Feature Gaps (as of April 2026)

| Gap | Impact on Testing |
|-----|-----------------|
| Frontend logout NOT wired to POST /api/Auth/logout | Test: logout clears localStorage but does NOT revoke server-side token. Revoked token is still usable until exp. Flag as BUG if testing logout security. |
| No CalendarPage — /going route is list view, not calendar | Test: /calendar route does not exist; /going is the correct route |
| No Toast notification system | UI behaviour tests for success/error toasts will fail — skip or note as unimplemented |

## 04_Tester_Agent.md Correction Status

The 04_Tester_Agent.md was fully corrected and rewritten on 2026-04-17. The stale entries below are now fixed in the file and this section is retained only for historical reference.

Previously stale claims that are now corrected in the document:

| Was Wrong | Now Correct |
|-----------|-------------|
| .NET 8, Dapper | .NET 10, EF Core 10 |
| axios on frontend | native fetch via typed request<T>() helper |
| /api/admin/events routes | /api/Events with role-based auth |
| POST /favourites/1 → 201, duplicate → 409 | POST /api/Favourites/{id}/toggle → 200 { isFavourited: bool } |
| POST /attendances/1 → 201, duplicate → 409 | POST /api/EventAttendance/{id}/toggle → 200 { isGoing: bool } |
| /api/auth/register, /api/auth/login | /api/Auth/register, /api/Auth/login, /api/Auth/logout |
| register returns 200 | register returns 201 |
| role="User" in JWT | role="Visitor" or role="Admin" |
| Swagger UI at /swagger | Scalar UI at /scalar/v1 |
| /calendar frontend route | /my-events frontend route |
| /admin/events frontend route | No separate route — AdminView on / based on role |
| Missing: Admin cannot use Favourites/Attendance | Documented: Admin JWT → 403 on toggle endpoints |
| Missing: logout token gap | Documented as security test case #12 |
| Missing: in-memory blacklist restart risk | Documented in security test and R-001 |

## CORS Security
- Origin whitelist: http://localhost:5173 ONLY
- Test: request from http://localhost:9999 should be rejected by browser (preflight will fail)
- Note: CORS is browser-enforced only; curl/Postman bypasses it by design
