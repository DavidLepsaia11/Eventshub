using EventsHub.Application.Interfaces;
using EventsHub.Application.Services;
using EventsHub.Domain.Interfaces;
using EventsHub.Infrastructure.Persistence;
using EventsHub.Infrastructure.Repositories;
using EventsHub.WebApi.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<EventsHubDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EventsHubDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "EventsHub API";
        options.Theme = ScalarTheme.Purple;
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("FrontendPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
