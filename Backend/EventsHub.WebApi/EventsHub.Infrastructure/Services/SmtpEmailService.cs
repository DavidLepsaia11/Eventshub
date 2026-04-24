using System.Net;
using System.Net.Mail;
using EventsHub.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EventsHub.Infrastructure.Services;

/// <summary>
/// Sends real password-reset emails via Gmail SMTP (App Password auth).
/// Configuration is read from the "Email" section of appsettings.
/// </summary>
public class SmtpEmailService(
    IConfiguration configuration,
    ILogger<SmtpEmailService> logger) : IEmailService
{
    public async Task SendPasswordResetEmailAsync(
        string toEmail,
        string resetToken,
        CancellationToken cancellationToken = default)
    {
        var cfg = configuration.GetSection("Email");

        var smtpHost        = cfg["SmtpHost"]!;
        var smtpPort        = int.Parse(cfg["SmtpPort"] ?? "587");
        var senderEmail     = cfg["SenderEmail"]!;
        var senderName      = cfg["SenderName"] ?? "EventsHub";
        var appPassword     = cfg["AppPassword"]!;
        var frontendBaseUrl = cfg["FrontendBaseUrl"] ?? "http://localhost:5173";

        // Build the clickable reset link
        var encodedToken = Uri.EscapeDataString(resetToken);
        var encodedEmail = Uri.EscapeDataString(toEmail);
        var resetLink    = $"{frontendBaseUrl}/reset-password?token={encodedToken}&email={encodedEmail}";

        var body = $"""
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2>Password Reset Request</h2>
                <p>You requested a password reset for your <strong>EventsHub</strong> account.</p>
                <p>Click the button below to set a new password. This link expires after use.</p>
                <p style="margin: 24px 0;">
                    <a href="{resetLink}"
                       style="background:#6d28d9;color:#fff;padding:12px 24px;
                              border-radius:6px;text-decoration:none;font-weight:bold;">
                        Reset My Password
                    </a>
                </p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p><a href="{resetLink}">{resetLink}</a></p>
                <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
                <p style="color:#888;font-size:12px;">
                    If you didn't request a password reset you can safely ignore this email.
                </p>
            </body>
            </html>
            """;

        using var smtp = new SmtpClient(smtpHost, smtpPort)
        {
            EnableSsl   = true,   // Gmail requires STARTTLS on port 587 / SSL on 465
            Credentials = new NetworkCredential(senderEmail, appPassword),
            DeliveryMethod = SmtpDeliveryMethod.Network
        };

        using var message = new MailMessage
        {
            From       = new MailAddress(senderEmail, senderName),
            Subject    = "EventsHub — Reset Your Password",
            Body       = body,
            IsBodyHtml = true
        };
        message.To.Add(toEmail);

        try
        {
            await smtp.SendMailAsync(message, cancellationToken);
            logger.LogInformation("Password reset email sent to {Email}", toEmail);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send password reset email to {Email}", toEmail);
            throw;   // Let the caller surface a 500; do not silently swallow
        }
    }
}
