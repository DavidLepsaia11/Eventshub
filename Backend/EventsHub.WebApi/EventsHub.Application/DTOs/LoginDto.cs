using System.ComponentModel.DataAnnotations;

namespace EventsHub.Application.DTOs;

public record LoginDto(
    [Required, EmailAddress] string Email,
    [Required] string Password
);
