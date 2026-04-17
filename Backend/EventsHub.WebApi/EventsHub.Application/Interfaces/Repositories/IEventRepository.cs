// EventsHub.Application/Interfaces/Repositories/IEventRepository.cs
using EventsHub.Domain.Entities;

namespace EventsHub.Application.Interfaces.Repositories;

public interface IEventRepository
{
    /// <summary>
    /// Returns one page of events and the total filtered record count.
    /// All filtering, ordering, skip, and take are applied inside the repository via IQueryable.
    /// </summary>
    Task<(IEnumerable<Event> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        bool onlyPublished = false,
        string? search = null,
        int? categoryId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns aggregate counts across ALL events (not filtered, not paged).
    /// Used to populate PublishedCount and DraftCount on the admin response.
    /// </summary>
    Task<(int Total, int Published, int Drafts)> GetStatsAsync(CancellationToken cancellationToken = default);

    Task<Event?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Event @event, CancellationToken cancellationToken = default);
    Task UpdateAsync(Event @event, CancellationToken cancellationToken = default);
    Task DeleteAsync(Event @event, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default);
}
