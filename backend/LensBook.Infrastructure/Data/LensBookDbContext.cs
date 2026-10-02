using Microsoft.EntityFrameworkCore;
using LensBook.Domain.Entities;

namespace LensBook.Infrastructure.Data;

public class LensBookDbContext : DbContext
{
    public LensBookDbContext(DbContextOptions<LensBookDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
}