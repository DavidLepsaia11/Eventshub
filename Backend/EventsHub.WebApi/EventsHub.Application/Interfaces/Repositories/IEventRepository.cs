using EventsHub.Domain.Entities;

namespace EventsHub.Application.Interfaces.Repositories;

public interface IEventRepository
{
    /// <summary>
    /// Returns one page of events and the total record count.
    /// Filtering, ordering, skip, and take are applied inside the repository via IQueryable.
    /// </summary>
    Task<(IEnumerable<Event> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        bool onlyPublished = false,
        CancellationToken cancellationToken = default);

    Task<Event?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Event @event, CancellationToken cancellationToken = default);
    Task UpdateAsync(Event @event, CancellationToken cancellationToken = default);
    Task DeleteAsync(Event @event, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default);
}
