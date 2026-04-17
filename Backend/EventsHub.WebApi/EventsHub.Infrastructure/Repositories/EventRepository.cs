// EventsHub.Infrastructure/Repositories/EventRepository.cs
using EventsHub.Application.Interfaces.Repositories;
using EventsHub.Domain.Entities;
using EventsHub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventsHub.Infrastructure.Repositories;

public class EventRepository(EventsHubDbContext context) : IEventRepository
{
    public async Task<(IEnumerable<Event> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        bool onlyPublished = false,
        string? search = null,
        int? categoryId = null,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Event> query = context.Events
            .AsNoTracking()
            .Include(e => e.Category);

        if (onlyPublished)
        {
            // Visitors: published events only, soonest start date first
            query = query
                .Where(e => e.IsPublished)
                .OrderBy(e => e.StartDate);
        }
        else
        {
            // Admin: all events, most recently created first
            query = query.OrderByDescending(e => e.CreatedAt);
        }

        // Apply server-side filters BEFORE counting and paging
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(e => e.Title.Contains(search) || e.Location.Contains(search));

        if (categoryId.HasValue)
            query = query.Where(e => e.CategoryId == categoryId.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<(int Total, int Published, int Drafts)> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        var total = await context.Events.AsNoTracking().CountAsync(cancellationToken);
        var published = await context.Events.AsNoTracking().CountAsync(e => e.IsPublished, cancellationToken);
        return (total, published, total - published);
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
