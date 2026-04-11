using EventsHub.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace EventsHub.WebApi.Services;

public class LocalFileStorageService(IWebHostEnvironment env) : IFileStorageService
{
    private string WebRoot =>
        env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");

    public async Task<string?> SaveAsync(IFormFile? file, string folder)
    {
        if (file == null || file.Length == 0) return null;

        var uploadsDir = Path.Combine(WebRoot, "uploads", folder);
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{file.FileName}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using var stream = File.Create(filePath);
        await file.CopyToAsync(stream);

        return $"/uploads/{folder}/{fileName}";
    }

    public void Delete(string? fileUrl)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return;

        var relativePath = fileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        var fullPath = Path.Combine(WebRoot, relativePath);

        if (File.Exists(fullPath))
            File.Delete(fullPath);
    }
}
