using EventsHub.Application.DTOs;
using EventsHub.Domain.Entities;

namespace EventsHub.Application.Mappers;

public static class EventMapper
{
    public static EventDto ToDto(Event @event, bool? isFavourited = null) => new(
        @event.Id,
        @event.Title,
        @event.Description,
        @event.Location,
        @event.StartDate,
        @event.EndDate,
        @event.IsPublished,
        @event.CoverImageUrl,
        @event.CategoryId,
        @event.Category?.Name ?? string.Empty,
        @event.CreatedAt,
        @event.UpdatedAt,
        isFavourited);

    public static Event ToEntity(CreateEventDto dto, string? coverImageUrl) => new()
    {
        Title = dto.Title,
        Description = dto.Description,
        Location = dto.Location,
        StartDate = dto.StartDate,
        EndDate = dto.EndDate,
        IsPublished = dto.IsPublished,
        CoverImageUrl = coverImageUrl,
        CategoryId = dto.CategoryId,
        CreatedAt = DateTime.UtcNow
    };

    public static void ApplyUpdate(Event @event, UpdateEventDto dto, string? coverImageUrl)
    {
        @event.Title = dto.Title;
        @event.Description = dto.Description;
        @event.Location = dto.Location;
        @event.StartDate = dto.StartDate;
        @event.EndDate = dto.EndDate;
        @event.IsPublished = dto.IsPublished;
        @event.CoverImageUrl = coverImageUrl;
        @event.CategoryId = dto.CategoryId;
        @event.UpdatedAt = DateTime.UtcNow;
    }
}
