using EventsHub.Domain.Entities;
using EventsHub.Domain.Interfaces;
using EventsHub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventsHub.Infrastructure.Repositories;

public class CategoryRepository(EventsHubDbContext context) : ICategoryRepository
{
    public async Task<IEnumerable<Category>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await context.Categories
            .AsNoTracking()
            .OrderBy(c => c.Id)
            .ToListAsync(cancellationToken);
    }
}
