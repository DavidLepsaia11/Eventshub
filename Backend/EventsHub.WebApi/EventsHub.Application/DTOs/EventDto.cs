namespace EventsHub.Application.DTOs;

public record EventDto(
    int Id,
    string Title,
    string Description,
    string Location,
    DateTime StartDate,
    DateTime EndDate,
    bool IsPublished,
    string? CoverImageUrl,
    int CategoryId,
    string CategoryName,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
