using Microsoft.AspNetCore.Http;

namespace EventsHub.Application.Interfaces.Services;

public interface IFileStorageService
{
    Task<string?> SaveAsync(IFormFile? file, string folder);
    void Delete(string? fileUrl);
}
