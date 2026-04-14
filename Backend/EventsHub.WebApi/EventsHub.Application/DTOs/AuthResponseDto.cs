namespace EventsHub.Application.DTOs;

public record AuthResponseDto(
    string Token,
    string UserId,
    string UserName,
    string Email,
    IEnumerable<string> Roles
);
