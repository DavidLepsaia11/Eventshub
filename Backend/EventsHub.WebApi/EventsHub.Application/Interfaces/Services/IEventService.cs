using EventsHub.Application.DTOs;

namespace EventsHub.Application.Interfaces.Services;

public interface IEventService
{
    Task<IEnumerable<EventDto>> GetAllEventsAsync(string? visitorUserId = null, CancellationToken cancellationToken = default);
    Task<EventDto?> GetEventByIdAsync(int id, string? visitorUserId = null, CancellationToken cancellationToken = default);
    Task<EventDto> CreateEventAsync(CreateEventDto dto, CancellationToken cancellationToken = default);
    Task<EventDto?> UpdateEventAsync(int id, UpdateEventDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteEventAsync(int id, CancellationToken cancellationToken = default);
}
