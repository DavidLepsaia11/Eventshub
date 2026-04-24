using EventsHub.Application.Constants;
using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces.Services;
using EventsHub.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace EventsHub.Infrastructure.Services;

public class AuthService(
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    IEmailService emailService) : IAuthService
{
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default)
    {
        var user = new ApplicationUser
        {
            UserName = dto.UserName,
            Email = dto.Email
        };

        var result = await userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException(errors);
        }

        await userManager.AddToRoleAsync(user, Roles.Visitor);

        var roles = await userManager.GetRolesAsync(user);
        var token = tokenService.GenerateToken(user.Id, user.UserName!, user.Email!, roles);

        return new AuthResponseDto(token, user.Id, user.UserName!, user.Email!, roles);
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null) return null;

        var valid = await userManager.CheckPasswordAsync(user, dto.Password);
        if (!valid) return null;

        var roles = await userManager.GetRolesAsync(user);
        var token = tokenService.GenerateToken(user.Id, user.UserName!, user.Email!, roles);

        return new AuthResponseDto(token, user.Id, user.UserName!, user.Email!, roles);
    }

    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto dto, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);

        // Always return true — never reveal whether the email exists
        if (user is null)
            return true;

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        await emailService.SendPasswordResetEmailAsync(user.Email!, token, cancellationToken);

        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user is null)
            return false;

        var result = await userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
        return result.Succeeded;
    }
}
