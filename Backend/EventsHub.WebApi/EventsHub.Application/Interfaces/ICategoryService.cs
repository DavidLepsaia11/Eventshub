using EventsHub.Application.DTOs;

namespace EventsHub.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync(CancellationToken cancellationToken = default);
}
