using EventsHub.Domain.Entities;
using EventsHub.Domain.Interfaces;
using EventsHub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventsHub.Infrastructure.Repositories;

public class EventRepository(EventsHubDbContext context) : IEventRepository
{
    public async Task<IEnumerable<Event>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await context.Events
            .AsNoTracking()
            .Include(e => e.Category)
            .OrderByDescending(e => e.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Event?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await context.Events
            .Include(e => e.Category)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task AddAsync(Event @event, CancellationToken cancellationToken = default)
    {
        await context.Events.AddAsync(@event, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Event @event, CancellationToken cancellationToken = default)
    {
        context.Events.Update(@event);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Event @event, CancellationToken cancellationToken = default)
    {
        context.Events.Remove(@event);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default)
    {
        return await context.Events
            .AnyAsync(e => e.Id == id, cancellationToken);
    }
}
