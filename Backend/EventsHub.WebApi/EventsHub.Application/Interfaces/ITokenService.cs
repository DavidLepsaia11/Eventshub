using EventsHub.Application.DTOs;

namespace EventsHub.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(string userId, string userName, string email, IEnumerable<string> roles);
}
