using EventsHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventsHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Visitor")]
public class EventAttendanceController(IEventAttendanceService attendanceService) : ControllerBase
{
    [HttpPost("{eventId:int}/toggle")]
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

    [HttpGet]
    public async Task<IActionResult> GetGoingEvents(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        var events = await attendanceService.GetGoingEventsAsync(userId, cancellationToken);
        return Ok(events);
    }
}
