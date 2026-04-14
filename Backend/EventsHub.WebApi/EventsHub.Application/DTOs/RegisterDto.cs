using System.ComponentModel.DataAnnotations;

namespace EventsHub.Application.DTOs;

public record RegisterDto(
    [Required, MaxLength(50)] string UserName,
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password
);
