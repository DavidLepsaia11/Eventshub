using EventsHub.Application.DTOs;

namespace EventsHub.Application.Interfaces.Services;

public interface IEventAttendanceService
{
    Task<ToggleAttendanceResponseDto?> ToggleAsync(string userId, int eventId, CancellationToken cancellationToken = default);
    Task<IEnumerable<EventDto>> GetGoingEventsAsync(string userId, CancellationToken cancellationToken = default);
}
