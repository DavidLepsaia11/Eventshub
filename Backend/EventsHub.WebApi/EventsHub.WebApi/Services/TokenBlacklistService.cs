using EventsHub.Application.Interfaces.Services;
using Microsoft.Extensions.Caching.Memory;

namespace EventsHub.WebApi.Services;

/// <summary>
/// In-memory JWT blacklist. Revoked tokens are stored until their original expiry,
/// so the blacklist self-cleans — no extra migration or DB table needed.
/// Note: this is per-process. A restart clears the list (acceptable since tokens
/// issued before the restart are also unlikely to be replayed).
/// </summary>
public class TokenBlacklistService(IMemoryCache cache) : ITokenBlacklistService
{
    private const string KeyPrefix = "blacklist_";

    public void Revoke(string jti, DateTimeOffset tokenExpiry)
    {
        var options = new MemoryCacheEntryOptions
        {
            AbsoluteExpiration = tokenExpiry
        };
        cache.Set(KeyPrefix + jti, true, options);
    }

    public bool IsRevoked(string jti) =>
        cache.TryGetValue(KeyPrefix + jti, out _);
}
