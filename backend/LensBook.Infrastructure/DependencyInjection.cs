using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using LensBook.Application.Interfaces;
using LensBook.Infrastructure.Data;
using LensBook.Infrastructure.Repositories;

namespace LensBook.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<LensBookDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IUsuarioRepository, UsuarioRepository>();

        return services;
    }
}