using Microsoft.AspNetCore.Mvc;
using LensBook.Application.Interfaces;
using LensBook.Domain.Entities;

namespace LensBook.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioRepository _repository;

    public UsuariosController(IUsuarioRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsuarios()
    {
        var usuarios = await _repository.GetAllAsync();
        return Ok(usuarios);
    }

    [HttpPost]
    public async Task<IActionResult> CrearUsuario([FromBody] Usuario usuario)
    {
        if (string.IsNullOrWhiteSpace(usuario.Nombre) || string.IsNullOrWhiteSpace(usuario.Email))
        {
            return BadRequest("Nombre y Email son obligatorios.");
        }

        var nuevoUsuario = await _repository.AddAsync(usuario);
        return CreatedAtAction(nameof(GetUsuarios), new { id = nuevoUsuario.Id }, nuevoUsuario);
    }
}