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
    private readonly IValidator<CreateUsuarioRequestDto> _validator;

    public UsuariosController(IUsuarioRepository repository, IValidator<CreateUsuarioRequestDto> validator)
    {
        _repository = repository;
        _validator = validator;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsuarios()
    {
        var usuarios = await _repository.GetAllAsync();

        var response = usuarios.Select(u => new UsuarioResponseDto
        {
            Id = u.Id,
            Nombre = u.Nombre,
            Email = u.Email,
            Rol = u.Rol.ToString(),
            Estado = u.Estado.ToString(),
            Verificado = u.Verificado
        });

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CrearUsuario([FromBody] CreateUsuarioRequestDto request)
    {
        // 1. Validar con FluentValidation (reemplaza el `if` manual de la Clase 6)
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        // 2. Mapeo manual: DTO -> Entidad (solo lo permitido; PasswordHash real se calculará con
        //    hashing cuando lleguemos a autenticación — por ahora lo dejamos como placeholder)
        var nuevoUsuario = new Usuario
        {
            Nombre = request.Nombre,
            Email = request.Email,
            PasswordHash = request.Password // TODO: reemplazar por hash real en la Fase de Auth
        };

        // 3. Persistencia
        var usuarioCreado = await _repository.AddAsync(nuevoUsuario);

        // 4. Mapeo de retorno: Entidad -> DTO (nunca devolvemos PasswordHash)
        var response = new UsuarioResponseDto
        {
            Id = usuarioCreado.Id,
            Nombre = usuarioCreado.Nombre,
            Email = usuarioCreado.Email,
            Rol = usuarioCreado.Rol.ToString(),
            Estado = usuarioCreado.Estado.ToString(),
            Verificado = usuarioCreado.Verificado
        };

        return CreatedAtAction(nameof(GetUsuarios), new { id = response.Id }, response);
    }
}