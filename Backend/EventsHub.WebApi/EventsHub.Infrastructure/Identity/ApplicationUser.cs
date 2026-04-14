using Microsoft.AspNetCore.Identity;

namespace EventsHub.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    // IdentityUser already provides: Id (string), UserName, Email, PasswordHash, etc.
    // Add extra profile fields here if needed in the future.
}
