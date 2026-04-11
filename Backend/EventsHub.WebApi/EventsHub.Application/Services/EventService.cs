using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces;
using EventsHub.Application.Mappers;
using EventsHub.Domain.Interfaces;

namespace EventsHub.Application.Services;

public class EventService(IEventRepository repository, IFileStorageService fileStorage) : IEventService
{
    public async Task<IEnumerable<EventDto>> GetAllEventsAsync(CancellationToken cancellationToken = default)
    {
        var events = await repository.GetAllAsync(cancellationToken);
        return events.Select(EventMapper.ToDto);
    }

    public async Task<EventDto?> GetEventByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var @event = await repository.GetByIdAsync(id, cancellationToken);
        return @event is null ? null : EventMapper.ToDto(@event);
    }

    public async Task<EventDto> CreateEventAsync(CreateEventDto dto, CancellationToken cancellationToken = default)
    {
        var coverImageUrl = await fileStorage.SaveAsync(dto.CoverImage, "events");
        var @event = EventMapper.ToEntity(dto, coverImageUrl);
        await repository.AddAsync(@event, cancellationToken);
        return EventMapper.ToDto(@event);
    }

    public async Task<EventDto?> UpdateEventAsync(int id, UpdateEventDto dto, CancellationToken cancellationToken = default)
    {
        var @event = await repository.GetByIdAsync(id, cancellationToken);
        if (@event is null) return null;

        string? coverImageUrl = @event.CoverImageUrl;

        if (dto.CoverImage != null)
        {
            fileStorage.Delete(@event.CoverImageUrl);
            coverImageUrl = await fileStorage.SaveAsync(dto.CoverImage, "events");
        }
        else if (dto.RemoveCoverImage)
        {
            fileStorage.Delete(@event.CoverImageUrl);
            coverImageUrl = null;
        }

        EventMapper.ApplyUpdate(@event, dto, coverImageUrl);
        await repository.UpdateAsync(@event, cancellationToken);
        return EventMapper.ToDto(@event);
    }

    public async Task<bool> DeleteEventAsync(int id, CancellationToken cancellationToken = default)
    {
        var @event = await repository.GetByIdAsync(id, cancellationToken);
        if (@event is null) return false;

        fileStorage.Delete(@event.CoverImageUrl);
        await repository.DeleteAsync(@event, cancellationToken);
        return true;
    }
}
