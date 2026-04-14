using EventsHub.Application.DTOs;

namespace EventsHub.Application.Interfaces.Services;

public interface IFavouriteService
{
    Task<ToggleFavouriteResponseDto?> ToggleAsync(string userId, int eventId, CancellationToken cancellationToken = default);
    Task<IEnumerable<EventDto>> GetUserFavouritesAsync(string userId, CancellationToken cancellationToken = default);
}
