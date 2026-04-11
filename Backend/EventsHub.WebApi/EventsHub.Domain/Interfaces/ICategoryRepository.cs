using EventsHub.Domain.Entities;

namespace EventsHub.Domain.Interfaces;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync(CancellationToken cancellationToken = default);
}
