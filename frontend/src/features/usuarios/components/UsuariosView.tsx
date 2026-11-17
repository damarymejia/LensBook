// frontend/src/features/usuarios/components/UsuariosView.tsx
import { useState, useEffect } from 'react'
import type { Usuario } from '../types/usuario.types'
import { obtenerUsuariosAsync, eliminarUsuarioAsync, extraerMensajeErrorBackend } from '../api/usuariosApi'
import { UsuarioCard } from './UsuarioCard'
import { CrearUsuarioForm } from './CrearUsuarioForm'

export function UsuariosView() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  const [errorRed, setErrorRed] = useState<string | null>(null)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState<string>('')
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false)

  useEffect(() => {
    obtenerUsuariosAsync()
      .then((datosDesdePostgres) => {
        setUsuarios(datosDesdePostgres)
        setErrorRed(null)
      })
      .catch((error) => {
        console.error('Auditoría de Error en la Petición HTTP:', error)
        setErrorRed(extraerMensajeErrorBackend(error))
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  // Inserción inmutable: nuevo arreglo con spread
  const manejarUsuarioCreado = (nuevoUsuarioDesdeBD: Usuario) => {
    setUsuarios((usuariosActuales) => [...usuariosActuales, nuevoUsuarioDesdeBD])
    setMostrarFormulario(false)
  }

  // Eliminación: primero el servidor (PostgreSQL), después la pantalla
  const manejarEliminar = async (id: number) => {
    const confirmado = window.confirm('¿Eliminar este usuario? El registro se borra de PostgreSQL.')
    if (!confirmado) return

    try {
      setErrorEliminar(null)
      await eliminarUsuarioAsync(id) // DELETE /api/usuarios/{id} -> 204 No Content
      // .filter() devuelve un arreglo NUEVO sin el usuario eliminado -> dispara el Re-render
      setUsuarios((usuariosActuales) => usuariosActuales.filter((u) => u.id !== id))
    } catch (error) {
      console.error('🚨 Rechazo del DELETE en el Backend .NET:', error)
      setErrorEliminar(extraerMensajeErrorBackend(error))
    }
  }

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Usuarios de LensBook</h1>
          <p className="text-slate-400 text-sm mt-1">
            Conectado en tiempo real vía HTTP/CORS con <code className="text-indigo-400 font-mono">PostgreSQL</code>.
          </p>
        </div>

        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            + Nuevo Usuario
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <CrearUsuarioForm
          onUsuarioCreado={manejarUsuarioCreado}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="🔍 Filtrar usuarios provenientes de PostgreSQL..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:max-w-md bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <span className="text-xs text-slate-400">
          Mostrando <strong className="text-white">{usuariosFiltrados.length}</strong> de {usuarios.length} registros en BD
        </span>
      </div>

      {/* Banner de error de la operación DELETE */}
      {errorEliminar && (
        <div className="mb-6 bg-red-950/60 border border-red-500/40 rounded-lg p-3 text-xs text-red-300 flex items-center gap-2">
          <span className="text-base">🛡️</span>
          <span><strong>Respuesta del Backend (.NET):</strong> {errorEliminar}</span>
        </div>
      )}

      {cargando && (
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-indigo-400 font-semibold animate-pulse text-lg">
            ⏳ Consultando endpoint GET /api/usuarios en .NET...
          </p>
        </div>
      )}

      {!cargando && errorRed && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-6 text-center">
          <p className="text-red-400 font-bold text-base mb-1">🚨 Error de Comunicación Full-Stack</p>
          <p className="text-slate-300 text-sm">{errorRed}</p>
        </div>
      )}

      {!cargando && !errorRed && (
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
              onEliminar={manejarEliminar}
            />
          ))}
        </section>
      )}
    </div>
  )
}