using LensBook.Domain.Enums;

namespace LensBook.Domain.Entities;

public class Usuario
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public RolUsuario Rol { get; set; } = RolUsuario.Cliente;
    public EstadoCuenta Estado { get; set; } = EstadoCuenta.Activo;
    public bool Verificado { get; set; } = false;
}