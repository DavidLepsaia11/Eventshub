namespace EventsHub.Application.Interfaces.Services;

public interface IEmailService
{
    /// <summary>
    /// Sends a password reset token to the specified email address.
    /// In development, the token is printed to the console instead of sent via SMTP.
    /// </summary>
    Task SendPasswordResetEmailAsync(string toEmail, string resetToken, CancellationToken cancellationToken = default);
}
