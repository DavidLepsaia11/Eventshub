using EventsHub.Application.Interfaces.Repositories;
using EventsHub.Domain.Entities;
using EventsHub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventsHub.Infrastructure.Repositories;

public class FavouriteRepository(EventsHubDbContext context) : IFavouriteRepository
{
    public async Task<Favourite?> GetAsync(string userId, int eventId, CancellationToken cancellationToken = default)
    {
        return await context.Favourites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.EventId == eventId, cancellationToken);
    }

    public async Task AddAsync(Favourite favourite, CancellationToken cancellationToken = default)
    {
        await context.Favourites.AddAsync(favourite, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Favourite favourite, CancellationToken cancellationToken = default)
    {
        context.Favourites.Remove(favourite);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetFavouriteEventsAsync(string userId, CancellationToken cancellationToken = default)
    {
        return await context.Favourites
            .AsNoTracking()
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Include(f => f.Event!)
            .ThenInclude(e => e.Category)
            .Select(f => f.Event!)
            .ToListAsync(cancellationToken);
    }

    public async Task<HashSet<int>> GetFavouriteEventIdsAsync(string userId, CancellationToken cancellationToken = default)
    {
        var ids = await context.Favourites
            .AsNoTracking()
            .Where(f => f.UserId == userId)
            .Select(f => f.EventId)
            .ToListAsync(cancellationToken);
        return [.. ids];
    }
}
