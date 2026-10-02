namespace LensBook.Domain.Entities;

public class Usuario
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Rol { get; set; } = "Cliente";
    public string Estado { get; set; } = "Activo";
    public bool Verificado { get; set; } = false;
}