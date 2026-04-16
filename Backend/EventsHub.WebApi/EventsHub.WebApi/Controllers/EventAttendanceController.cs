using System.Security.Claims;
using EventsHub.Application.Constants;
using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventsHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize(Roles = Roles.Visitor)]
public class EventAttendanceController(IEventAttendanceService attendanceService) : ControllerBase
{
    /// <summary>Toggles the current visitor's going status for the given event.</summary>
    [HttpPost("{eventId:int}/toggle")]
    [ProducesResponseType(typeof(ToggleAttendanceResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Toggle(int eventId, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        var result = await attendanceService.ToggleAsync(userId, eventId, cancellationToken);
        if (result is null)
            return NotFound();

        return Ok(result);
    }

    /// <summary>Gets all events the current visitor has marked as going.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<EventDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetGoingEvents(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        var events = await attendanceService.GetGoingEventsAsync(userId, cancellationToken);
        return Ok(events);
    }
}
