using EventsHub.Application.DTOs;

namespace EventsHub.Application.Interfaces;

public interface IEventService
{
    Task<IEnumerable<EventDto>> GetAllEventsAsync(CancellationToken cancellationToken = default);
    Task<EventDto?> GetEventByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<EventDto> CreateEventAsync(CreateEventDto dto, CancellationToken cancellationToken = default);
    Task<EventDto?> UpdateEventAsync(int id, UpdateEventDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteEventAsync(int id, CancellationToken cancellationToken = default);
}
