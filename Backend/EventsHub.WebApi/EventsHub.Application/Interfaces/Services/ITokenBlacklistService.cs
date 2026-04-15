namespace EventsHub.Application.Interfaces.Services;

public interface ITokenBlacklistService
{
    /// <summary>Adds a JWT ID to the blacklist. Entry expires automatically when the token expires.</summary>
    void Revoke(string jti, DateTimeOffset tokenExpiry);

    /// <summary>Returns true if the JWT ID has been revoked.</summary>
    bool IsRevoked(string jti);
}
