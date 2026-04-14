namespace EventsHub.Application.Interfaces.Services;

public interface ITokenService
{
    string GenerateToken(string userId, string userName, string email, IEnumerable<string> roles);
}
