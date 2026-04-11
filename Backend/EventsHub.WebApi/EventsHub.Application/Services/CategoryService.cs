using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces;
using EventsHub.Domain.Interfaces;

namespace EventsHub.Application.Services;

public class CategoryService(ICategoryRepository repository) : ICategoryService
{
    public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync(CancellationToken cancellationToken = default)
    {
        var categories = await repository.GetAllAsync(cancellationToken);
        return categories.Select(c => new CategoryDto(c.Id, c.Name));
    }
}
