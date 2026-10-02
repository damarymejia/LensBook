using LensBook.Domain.Entities;

namespace LensBook.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<IEnumerable<Usuario>> GetAllAsync();
    Task<Usuario> AddAsync(Usuario usuario);
}