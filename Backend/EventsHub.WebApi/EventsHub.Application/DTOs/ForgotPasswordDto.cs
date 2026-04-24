using System.ComponentModel.DataAnnotations;

namespace EventsHub.Application.DTOs;

public record ForgotPasswordDto(
    [Required, EmailAddress] string Email
);
