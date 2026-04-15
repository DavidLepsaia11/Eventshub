using EventsHub.Domain.Entities;
using EventsHub.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EventsHub.Infrastructure.Persistence;

public class EventsHubDbContext(DbContextOptions<EventsHubDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Favourite> Favourites => Set<Favourite>();
    public DbSet<EventAttendance> Attendances => Set<EventAttendance>();

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

        modelBuilder.Entity<Favourite>(entity =>
        {
            entity.HasKey(f => f.Id);

            entity.Property(f => f.UserId)
                .IsRequired()
                .HasMaxLength(450);

            entity.Property(f => f.CreatedAt)
                .IsRequired();

            entity.HasIndex(f => new { f.UserId, f.EventId })
                .IsUnique();

            entity.HasOne(f => f.Event)
                .WithMany()
                .HasForeignKey(f => f.EventId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<EventAttendance>(entity =>
        {
            entity.HasKey(a => a.Id);

            entity.Property(a => a.UserId)
                .IsRequired()
                .HasMaxLength(450);

            entity.Property(a => a.CreatedAt)
                .IsRequired();

            entity.HasIndex(a => new { a.UserId, a.EventId })
                .IsUnique();

            entity.HasOne(a => a.Event)
                .WithMany()
                .HasForeignKey(a => a.EventId)
                .OnDelete(DeleteBehavior.Cascade);
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
