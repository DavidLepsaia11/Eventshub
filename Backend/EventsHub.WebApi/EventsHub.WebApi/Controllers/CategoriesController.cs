using EventsHub.Application.DTOs;
using EventsHub.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EventsHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    /// <summary>Gets all categories.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var categories = await categoryService.GetAllCategoriesAsync(cancellationToken);
        return Ok(categories);
    }
}
