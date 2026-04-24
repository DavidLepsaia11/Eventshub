using EventsHub.Application.DTOs;

namespace EventsHub.Application.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generates a password-reset token and delivers it via IEmailService.
    /// Always returns true regardless of whether the email exists (no enumeration).
    /// </summary>
    Task<bool> ForgotPasswordAsync(ForgotPasswordDto dto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Resets the user's password using the token issued by ForgotPasswordAsync.
    /// Returns false if the email/token combination is invalid.
    /// </summary>
    Task<bool> ResetPasswordAsync(ResetPasswordDto dto, CancellationToken cancellationToken = default);
}
