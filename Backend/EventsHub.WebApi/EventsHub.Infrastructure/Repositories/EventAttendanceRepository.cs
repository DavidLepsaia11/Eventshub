using EventsHub.Application.Interfaces.Repositories;
using EventsHub.Domain.Entities;
using EventsHub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventsHub.Infrastructure.Repositories;

public class EventAttendanceRepository(EventsHubDbContext context) : IEventAttendanceRepository
{
    public async Task<EventAttendance?> GetAsync(string userId, int eventId, CancellationToken cancellationToken = default)
    {
        return await context.Attendances
            .FirstOrDefaultAsync(a => a.UserId == userId && a.EventId == eventId, cancellationToken);
    }

    public async Task AddAsync(EventAttendance attendance, CancellationToken cancellationToken = default)
    {
        await context.Attendances.AddAsync(attendance, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(EventAttendance attendance, CancellationToken cancellationToken = default)
    {
        context.Attendances.Remove(attendance);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetAttendedEventsAsync(string userId, CancellationToken cancellationToken = default)
    {
        return await context.Attendances
            .AsNoTracking()
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Include(f => f.Event!)
            .ThenInclude(e => e.Category)
            .Select(f => f.Event!)
            .ToListAsync(cancellationToken);
    }

    public async Task<HashSet<int>> GetAttendedEventIdsAsync(string userId, CancellationToken cancellationToken = default)
    {
        var ids = await context.Attendances
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .Select(a => a.EventId)
            .ToListAsync(cancellationToken);
        return [.. ids];
    }
}
