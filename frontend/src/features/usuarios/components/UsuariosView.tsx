// frontend/src/features/usuarios/components/UsuariosView.tsx
import { useState, useEffect } from 'react'
import type { Usuario } from '../types/usuario.types'
import { obtenerUsuariosAsync } from '../api/usuariosApi'
import { UsuarioCard } from './UsuarioCard'

export function UsuariosView() {
  // --- ZONA 3: CEREBRO DEL MÓDULO ---
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  const [busqueda, setBusqueda] = useState<string>('')

  useEffect(() => {
    // Consumimos nuestra capa de servicio (api/usuariosApi.ts)
    obtenerUsuariosAsync().then((datos) => {
      setUsuarios(datos)
      setCargando(false)
    })
  }, [])

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  // --- ZONA 4: RENDERIZADO EXCLUSIVO DEL MÓDULO ---
  return (
    <div>
      {/* Barra Superior de Título y Acción Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Usuarios de LensBook</h1>
          <p className="text-slate-400 text-sm mt-1">
            Módulo desacoplado bajo arquitectura <code className="text-indigo-400 font-mono">Vertical Slicing</code>.
          </p>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm self-start sm:self-auto cursor-pointer">
          + Nuevo Usuario
        </button>
      </div>

      {/* Buscador Reactivo */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="🔍 Filtrar usuarios por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:max-w-md bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <span className="text-xs text-slate-400">
          Mostrando <strong className="text-white">{usuariosFiltrados.length}</strong> de {usuarios.length} registros
        </span>
      </div>

      {/* Renderizado Condicional y Rejilla */}
      {cargando ? (
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-indigo-400 font-semibold animate-pulse text-lg">
            ⏳ Consultando capa de servicios (usuariosApi.ts)...
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {usuariosFiltrados.map((usuario) => (
            <UsuarioCard
              key={usuario.id}
              id={usuario.id}
              nombre={usuario.nombre}
              email={usuario.email}
              rol={usuario.rol}
              estado={usuario.estado}
              verificado={usuario.verificado}
            />
          ))}
        </section>
      )}
    </div>
  )
}