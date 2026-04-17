
// EventsHub.Application/DTOs/PagedResultDto.cs
namespace EventsHub.Application.DTOs;

public record PagedResultDto<T>(
    IEnumerable<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages,
    int PublishedCount,
    int DraftCount
);
