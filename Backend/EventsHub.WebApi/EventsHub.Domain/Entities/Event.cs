namespace EventsHub.Domain.Entities;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsPublished { get; set; }
    public string? CoverImageUrl { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
