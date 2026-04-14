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
    /// <summary>Gets all events. Includes IsFavourited flag when a Visitor is signed in.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<EventDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var visitorUserId = GetVisitorUserId();
        var events = await eventService.GetAllEventsAsync(visitorUserId, cancellationToken);
        return Ok(events);
    }

    /// <summary>Gets a single event by ID. Includes IsFavourited flag when a Visitor is signed in.</summary>
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

    private string? GetVisitorUserId() =>
        User.Identity?.IsAuthenticated == true && User.IsInRole("Visitor")
            ? User.FindFirstValue(ClaimTypes.NameIdentifier)
            : null;
}
