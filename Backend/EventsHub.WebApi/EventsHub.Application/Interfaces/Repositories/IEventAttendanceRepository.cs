using EventsHub.Domain.Entities;

namespace EventsHub.Application.Interfaces.Repositories;

public interface IEventAttendanceRepository
{
    Task<EventAttendance?> GetAsync(string userId, int eventId, CancellationToken cancellationToken = default);
    Task AddAsync(EventAttendance attendance, CancellationToken cancellationToken = default);
    Task DeleteAsync(EventAttendance attendance, CancellationToken cancellationToken = default);
    Task<IEnumerable<Event>> GetAttendedEventsAsync(string userId, CancellationToken cancellationToken = default);
    Task<HashSet<int>> GetAttendedEventIdsAsync(string userId, CancellationToken cancellationToken = default);
}
