using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces.Repositories;
using EventsHub.Application.Interfaces.Services;
using EventsHub.Application.Mappers;

namespace EventsHub.Application.Services;

public class EventService(
    IEventRepository repository,
    IFileStorageService fileStorage,
    IFavouriteRepository favouriteRepository,
    IEventAttendanceRepository attendanceRepository) : IEventService
{
    public async Task<PagedResultDto<EventDto>> GetAllEventsAsync(
        int page,
        int pageSize,
        bool onlyPublished = false,
        string? visitorUserId = null,
        CancellationToken cancellationToken = default)
    {
        var (events, totalCount) = await repository.GetAllAsync(page, pageSize, onlyPublished, cancellationToken);

        IEnumerable<EventDto> dtos;

        if (visitorUserId is null)
        {
            dtos = events.Select(e => EventMapper.ToDto(e));
        }
        else
        {
            var favouriteIds = await favouriteRepository.GetFavouriteEventIdsAsync(visitorUserId, cancellationToken);
            var attendanceIds = await attendanceRepository.GetAttendedEventIdsAsync(visitorUserId, cancellationToken);
            dtos = events.Select(e => EventMapper.ToDto(e, favouriteIds.Contains(e.Id), attendanceIds.Contains(e.Id)));
        }

        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PagedResultDto<EventDto>(dtos, page, pageSize, totalCount, totalPages);
    }

    public async Task<EventDto?> GetEventByIdAsync(int id, string? visitorUserId = null, CancellationToken cancellationToken = default)
    {
        var @event = await repository.GetByIdAsync(id, cancellationToken);
        if (@event is null) return null;

        if (visitorUserId is null)
            return EventMapper.ToDto(@event);

        var favouriteExists = await favouriteRepository.GetAsync(visitorUserId, id, cancellationToken);
        var attendanceExists = await attendanceRepository.GetAsync(visitorUserId, id, cancellationToken);
        return EventMapper.ToDto(@event, favouriteExists is not null, attendanceExists is not null);
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
