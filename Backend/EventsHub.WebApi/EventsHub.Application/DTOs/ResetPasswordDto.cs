using System.ComponentModel.DataAnnotations;

namespace EventsHub.Application.DTOs;

public record ResetPasswordDto(
    [Required, EmailAddress] string Email,
    [Required] string Token,
    [Required, MinLength(6)] string NewPassword
);
