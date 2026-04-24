using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventsHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController(IAuthService authService, ITokenBlacklistService blacklist) : ControllerBase
{
    /// <summary>Registers a new user. Assigns the Visitor role by default.</summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var result = await authService.RegisterAsync(dto, cancellationToken);
            return StatusCode(StatusCodes.Status201Created, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Logs in with email and password. Returns a JWT token.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken cancellationToken)
    {
        var result = await authService.LoginAsync(dto, cancellationToken);
        if (result is null)
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(result);
    }

    /// <summary>
    /// Sends a password reset token to the given email address.
    /// Always returns 200 to prevent email enumeration.
    /// In development the token is printed to the server console.
    /// </summary>
    [HttpPost("forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto, CancellationToken cancellationToken)
    {
        await authService.ForgotPasswordAsync(dto, cancellationToken);
        return Ok(new { message = "If that email is registered, a reset token has been sent." });
    }

    /// <summary>
    /// Resets the user's password using the token from the forgot-password step.
    /// </summary>
    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto, CancellationToken cancellationToken)
    {
        var success = await authService.ResetPasswordAsync(dto, cancellationToken);
        if (!success)
            return BadRequest(new { message = "Invalid or expired reset token." });

        return Ok(new { message = "Password has been reset successfully." });
    }

    /// <summary>
    /// Logs out the current user by revoking the JWT token.
    /// The token remains invalid until its original expiry time.
    /// </summary>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Logout()
    {
        var jti = User.FindFirstValue(JwtRegisteredClaimNames.Jti);
        var expClaim = User.FindFirstValue(JwtRegisteredClaimNames.Exp);

        if (string.IsNullOrEmpty(jti) || string.IsNullOrEmpty(expClaim))
            return Unauthorized();

        var expUnix = long.Parse(expClaim);
        var expiry = DateTimeOffset.FromUnixTimeSeconds(expUnix);

        blacklist.Revoke(jti, expiry);

        return Ok(new { message = "Logged out successfully." });
    }
}
