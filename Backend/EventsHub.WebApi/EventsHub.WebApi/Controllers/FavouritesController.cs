using System.Security.Claims;
using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventsHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize(Roles = "Visitor")]
public class FavouritesController(IFavouriteService favouriteService) : ControllerBase
{
    /// <summary>Toggles the current visitor's favourite for the given event.</summary>
    [HttpPost("{eventId:int}/toggle")]
    [ProducesResponseType(typeof(ToggleFavouriteResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Toggle(int eventId, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var result = await favouriteService.ToggleAsync(userId, eventId, cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    /// <summary>Gets all events favourited by the current visitor.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<EventDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetFavouritesByUserId(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var events = await favouriteService.GetUserFavouritesAsync(userId, cancellationToken);
        return Ok(events);
    }
}
