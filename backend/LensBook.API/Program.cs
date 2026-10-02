using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using LensBook.Infrastructure.Data;
using LensBook.Application.Interfaces;
using LensBook.Infrastructure.Repositories; // Asegúrate de importar la carpeta donde está tu implementación

var builder = WebApplication.CreateBuilder(args);

// Carga el archivo .env de forma segura
Env.Load(Path.Combine(builder.Environment.ContentRootPath, ".env"));

builder.Services.AddDbContext<LensBookDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

// --- REGISTRO DE INYECCIÓN DE DEPENDENCIAS ---
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();

builder.Services.AddControllers();

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "LensBook API v1");
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();