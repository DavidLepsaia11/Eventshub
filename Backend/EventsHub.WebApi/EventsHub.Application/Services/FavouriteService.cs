using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces.Repositories;
using EventsHub.Application.Interfaces.Services;
using EventsHub.Application.Mappers;
using EventsHub.Domain.Entities;

namespace EventsHub.Application.Services;

public class FavouriteService(
    IFavouriteRepository favouriteRepository,
    IEventRepository eventRepository) : IFavouriteService
{
    public async Task<ToggleFavouriteResponseDto?> ToggleAsync(string userId, int eventId, CancellationToken cancellationToken = default)
    {
        if (!await eventRepository.ExistsAsync(eventId, cancellationToken))
            return null;

        var existing = await favouriteRepository.GetAsync(userId, eventId, cancellationToken);

        if (existing is not null)
        {
            await favouriteRepository.DeleteAsync(existing, cancellationToken);
            return new ToggleFavouriteResponseDto(eventId, false);
        }

        var favourite = new Favourite
        {
            UserId = userId,
            EventId = eventId,
            CreatedAt = DateTime.UtcNow
        };
        await favouriteRepository.AddAsync(favourite, cancellationToken);
        return new ToggleFavouriteResponseDto(eventId, true);
    }

    public async Task<IEnumerable<EventDto>> GetUserFavouritesAsync(string userId, CancellationToken cancellationToken = default)
    {
        var events = await favouriteRepository.GetFavouriteEventsAsync(userId, cancellationToken);
        return events.Select(e => EventMapper.ToDto(e, true));
    }
}
