using DotNetEnv;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

// Capas de la aplicación
using LensBook.Application;
using LensBook.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Carga el archivo .env
Env.Load(Path.Combine(builder.Environment.ContentRootPath, ".env"));

// Obtiene la cadena de conexión
var connectionString = builder.Configuration
    .GetConnectionString("PostgresConnection")
    ?? throw new InvalidOperationException(
        "No se encontró la cadena de conexión PostgresConnection.");

// Registro de las capas
builder.Services.AddApplication();
builder.Services.AddInfrastructure(connectionString);

// Enums como texto en los controladores
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters
            .Add(new JsonStringEnumConverter());
    });

// Enums como texto en las respuestas HTTP
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters
        .Add(new JsonStringEnumConverter());
});

// Generación de OpenAPI
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