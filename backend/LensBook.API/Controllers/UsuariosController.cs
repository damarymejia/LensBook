using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using LensBook.Application.Interfaces;
using LensBook.Domain.Entities;
using LensBook.Application.Features.Usuarios.DTOs;

namespace LensBook.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioRepository _repository;
    private readonly IValidator<CreateUsuarioRequestDto> _createValidator;
    private readonly IValidator<UpdateUsuarioRequestDto> _updateValidator;

    public UsuariosController(
        IUsuarioRepository repository,
        IValidator<CreateUsuarioRequestDto> createValidator,
        IValidator<UpdateUsuarioRequestDto> updateValidator)
    {
        _repository = repository;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    // GET /api/usuarios  ->  200 OK
    [HttpGet]
    public async Task<IActionResult> GetUsuarios()
    {
        var usuarios = await _repository.GetAllAsync();
        return Ok(usuarios.Select(MapToResponse));
    }

    // GET /api/usuarios/{id}  ->  200 OK | 404 Not Found
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUsuarioPorId(int id)
    {
        var usuario = await _repository.GetByIdAsync(id);
        if (usuario is null)
        {
            return NotFound();
        }

        return Ok(MapToResponse(usuario));
    }

    // POST /api/usuarios  ->  201 Created | 400 Bad Request
    [HttpPost]
    public async Task<IActionResult> CrearUsuario([FromBody] CreateUsuarioRequestDto request)
    {
        var validationResult = await _createValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var nuevoUsuario = new Usuario
        {
            Nombre = request.Nombre,
            Email = request.Email,
            PasswordHash = request.Password // TODO: reemplazar por hash real en la Fase de Auth
        };

        var usuarioCreado = await _repository.AddAsync(nuevoUsuario);
        var response = MapToResponse(usuarioCreado);

        return CreatedAtAction(nameof(GetUsuarioPorId), new { id = response.Id }, response);
    }

    // PUT /api/usuarios/{id}  ->  204 No Content | 400 Bad Request | 404 Not Found
    [HttpPut("{id:int}")]
    public async Task<IActionResult> ActualizarUsuario(int id, [FromBody] UpdateUsuarioRequestDto request)
    {
        var validationResult = await _updateValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var usuario = await _repository.GetByIdAsync(id);
        if (usuario is null)
        {
            return NotFound();
        }

        usuario.Nombre = request.Nombre;
        await _repository.UpdateAsync(usuario);

        return NoContent();
    }

    // DELETE /api/usuarios/{id}  ->  204 No Content | 404 Not Found
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarUsuario(int id)
    {
        var usuario = await _repository.GetByIdAsync(id);
        if (usuario is null)
        {
            return NotFound();
        }

        await _repository.DeleteAsync(usuario);

        return NoContent();
    }

    // Mapeo Entidad -> DTO (nunca devolvemos PasswordHash)
    private static UsuarioResponseDto MapToResponse(Usuario u) => new()
    {
        Id = u.Id,
        Nombre = u.Nombre,
        Email = u.Email,
        Rol = u.Rol.ToString(),
        Estado = u.Estado.ToString(),
        Verificado = u.Verificado
    };
}