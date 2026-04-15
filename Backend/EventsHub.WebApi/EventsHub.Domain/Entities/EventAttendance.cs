namespace EventsHub.Domain.Entities;

public class EventAttendance
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int EventId { get; set; }
    public Event? Event { get; set; }
    public DateTime CreatedAt { get; set; }
}
