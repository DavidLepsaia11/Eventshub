using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace EventsHub.Application.DTOs;

public record UpdateEventDto(
    [Required, MaxLength(200)] string Title,
    [MaxLength(2000)] string Description,
    [Required, MaxLength(500)] string Location,
    [Required] DateTime StartDate,
    [Required] DateTime EndDate,
    bool IsPublished,
    IFormFile? CoverImage,
    bool RemoveCoverImage,
    [Required] int CategoryId
);
