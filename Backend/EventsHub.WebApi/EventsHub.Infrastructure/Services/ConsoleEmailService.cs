using EventsHub.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace EventsHub.Infrastructure.Services;

/// <summary>
/// Development-only email service that logs the reset token to the console
/// instead of sending a real email. Swap for SmtpEmailService before production.
/// </summary>
public class ConsoleEmailService(ILogger<ConsoleEmailService> logger) : IEmailService
{
    public Task SendPasswordResetEmailAsync(
        string toEmail,
        string resetToken,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation(
            "[DEV] Password reset token for {Email}: {Token}",
            toEmail,
            resetToken);

        return Task.CompletedTask;
    }
}
