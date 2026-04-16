using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces.Repositories;
using EventsHub.Application.Interfaces.Services;
using EventsHub.Application.Mappers;
using EventsHub.Domain.Entities;

namespace EventsHub.Application.Services;

public class EventAttendanceService(
    IEventAttendanceRepository attendanceRepository,
    IEventRepository eventRepository) : IEventAttendanceService
{
    public async Task<ToggleAttendanceResponseDto?> ToggleAsync(string userId, int eventId, CancellationToken cancellationToken = default)
    {
        if (!await eventRepository.ExistsAsync(eventId, cancellationToken))
            return null;

        var existing = await attendanceRepository.GetAsync(userId, eventId, cancellationToken);

        if (existing is not null)
        {
            await attendanceRepository.DeleteAsync(existing, cancellationToken);
            return new ToggleAttendanceResponseDto(eventId, false);
        }

        var attendance = new EventAttendance
        {
            UserId = userId,
            EventId = eventId,
            CreatedAt = DateTime.UtcNow
        };

        await attendanceRepository.AddAsync(attendance, cancellationToken);
        return new ToggleAttendanceResponseDto(eventId, true);
    }

    public async Task<IEnumerable<EventDto>> GetGoingEventsAsync(string userId, CancellationToken cancellationToken = default)
    {
        var events = await attendanceRepository.GetAttendedEventsAsync(userId, cancellationToken);
        return events.Select(e => EventMapper.ToDto(e, isGoing: true));
    }
}
