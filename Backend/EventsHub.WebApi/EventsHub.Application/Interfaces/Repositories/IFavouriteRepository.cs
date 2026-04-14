using EventsHub.Domain.Entities;

namespace EventsHub.Application.Interfaces.Repositories;

public interface IFavouriteRepository
{
    Task<Favourite?> GetAsync(string userId, int eventId, CancellationToken cancellationToken = default);
    Task AddAsync(Favourite favourite, CancellationToken cancellationToken = default);
    Task DeleteAsync(Favourite favourite, CancellationToken cancellationToken = default);
    Task<IEnumerable<Event>> GetFavouriteEventsAsync(string userId, CancellationToken cancellationToken = default);
    Task<HashSet<int>> GetFavouriteEventIdsAsync(string userId, CancellationToken cancellationToken = default);
}
