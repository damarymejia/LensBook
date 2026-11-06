using Microsoft.EntityFrameworkCore;
using LensBook.Application.Interfaces;
using LensBook.Domain.Entities;
using LensBook.Infrastructure.Data;

namespace LensBook.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly LensBookDbContext _context;

    public UsuarioRepository(LensBookDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Usuario>> GetAllAsync()
    {
        return await _context.Usuarios.ToListAsync();
    }

    public async Task<Usuario?> GetByIdAsync(int id)
    {
        // FindAsync busca directamente por llave primaria
        return await _context.Usuarios.FindAsync(id);
    }

    public async Task<Usuario> AddAsync(Usuario usuario)
    {
        await _context.Usuarios.AddAsync(usuario);
        await _context.SaveChangesAsync();
        return usuario;
    }

    public async Task UpdateAsync(Usuario usuario)
    {
        _context.Usuarios.Update(usuario);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Usuario usuario)
    {
        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();
    }
}