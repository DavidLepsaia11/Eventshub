using System.Security.Claims;
using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventsHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class EventsController(IEventService eventService) : ControllerBase
{
    /// <summary>
    /// Gets a page of events (default 20 per page).
    /// Admin: all events regardless of IsPublished.
    /// Visitor / anonymous: only published events. IsFavourited flag included when Visitor is signed in.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResultDto<EventDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var onlyPublished = !User.IsInRole("Admin");
        var visitorUserId = GetVisitorUserId();
        var result = await eventService.GetAllEventsAsync(page, pageSize, onlyPublished, visitorUserId, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Gets a single event by ID.
    /// Admin: can see unpublished events. Visitor / anonymous: 404 if not published.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var visitorUserId = GetVisitorUserId();
        var @event = await eventService.GetEventByIdAsync(id, visitorUserId, cancellationToken);
        return @event is null ? NotFound() : Ok(@event);
    }

    /// <summary>Creates a new event.</summary>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromForm] CreateEventDto dto, CancellationToken cancellationToken)
    {
        var created = await eventService.CreateEventAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Updates an existing event.</summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromForm] UpdateEventDto dto, CancellationToken cancellationToken)
    {
        var updated = await eventService.UpdateEventAsync(id, dto, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>Deletes an event.</summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await eventService.DeleteEventAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    // Returns the user ID only when the caller is a Visitor (not Admin, not anonymous).
    private string? GetVisitorUserId() =>
        User.Identity?.IsAuthenticated == true && User.IsInRole("Visitor")
            ? User.FindFirstValue(ClaimTypes.NameIdentifier)
            : null;
}
