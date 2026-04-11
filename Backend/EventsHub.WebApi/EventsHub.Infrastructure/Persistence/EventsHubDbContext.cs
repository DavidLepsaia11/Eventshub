using EventsHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventsHub.Infrastructure.Persistence;

public class EventsHubDbContext(DbContextOptions<EventsHubDbContext> options) : DbContext(options)
{
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Description)
                .HasMaxLength(2000);

            entity.Property(e => e.Location)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.StartDate)
                .IsRequired();

            entity.Property(e => e.EndDate)
                .IsRequired();

            entity.Property(e => e.IsPublished)
                .IsRequired()
                .HasDefaultValue(false);

            entity.Property(e => e.CoverImageUrl)
                .HasMaxLength(1000)
                .IsRequired(false);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired(false);

            entity.HasOne(e => e.Category)
                .WithMany(c => c.Events)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Concerts" },
            new Category { Id = 2, Name = "Sports" },
            new Category { Id = 3, Name = "Theatre" },
            new Category { Id = 4, Name = "Festivals" },
            new Category { Id = 5, Name = "Art & Culture" },
            new Category { Id = 6, Name = "Tech & Business" }
        );
    }
}
