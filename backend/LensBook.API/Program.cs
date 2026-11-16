// backend/LensBook.API/Program.cs
using DotNetEnv;
using LensBook.Application;
using LensBook.Infrastructure;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
Env.Load();

var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__PostgresConnection")
                       ?? throw new InvalidOperationException("Falta la cadena de conexión a PostgreSQL.");

// Leemos los orígenes permitidos desde el archivo .env del Backend
var corsAllowedOrigins = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS")
                         ?? throw new InvalidOperationException("Falta la variable CORS_ALLOWED_ORIGINS en el archivo .env.");

// Inyección de nuestras capas de Clean Architecture
builder.Services.AddApplication();
builder.Services.AddInfrastructure(connectionString);

// =========================================================================
// 1. DEFINICIÓN DE LA POLÍTICA DE SEGURIDAD CORS DINÁMICA (.env + Wildcards)
// =========================================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaCorsLensBook", policy =>
    {
        // Separamos por coma por si existen múltiples orígenes
        var origenes = corsAllowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        policy.WithOrigins(origenes)
              .SetIsOriginAllowedToAllowWildcardSubdomains() // Habilita comodines de subdominio
              .AllowAnyHeader()                              // Autoriza encabezados JSON
              .AllowAnyMethod();                             // Autoriza GET y los Preflights (POST, PUT, DELETE)
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// =========================================================================
// 2. ACTIVACIÓN DEL MIDDLEWARE CORS EN LA PUERTA DE ENTRADA HTTP
// Regla crítica: siempre debe ubicarse ANTES de MapControllers()
// =========================================================================
app.UseCors("PoliticaCorsLensBook");

app.MapControllers();
app.Run();