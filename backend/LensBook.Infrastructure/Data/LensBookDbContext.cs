using Microsoft.EntityFrameworkCore;
using LensBook.Domain.Entities;

namespace LensBook.Infrastructure.Data;

public class LensBookDbContext : DbContext
{
    public LensBookDbContext(DbContextOptions<LensBookDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>()
            .Property(u => u.Rol)
            .HasConversion<string>()
            .HasMaxLength(20);

        modelBuilder.Entity<Usuario>()
            .Property(u => u.Estado)
            .HasConversion<string>()
            .HasMaxLength(20);
    }
}