using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using LensBook.Infrastructure.Data;
using LensBook.Application.Interfaces;
using LensBook.Infrastructure.Repositories;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Carga el archivo .env de forma segura
Env.Load(Path.Combine(builder.Environment.ContentRootPath, ".env"));

builder.Services.AddDbContext<LensBookDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

// --- REGISTRO DE INYECCIÓN DE DEPENDENCIAS ---
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();

// Enums como texto en los controladores (lo que recibe y devuelve la API)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Enums como texto en la documentación OpenAPI (lo que muestra Scalar)
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Generación nativa de OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();