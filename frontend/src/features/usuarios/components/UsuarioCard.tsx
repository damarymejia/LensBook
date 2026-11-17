// frontend/src/features/usuarios/components/UsuarioCard.tsx
import type { Usuario } from '../types/usuario.types'

// El contrato de la tarjeta = el DTO de lectura + la acción que le delega el padre
interface UsuarioCardProps extends Usuario {
    onEliminar: (id: number) => void;
}

export function UsuarioCard({ id, nombre, email, rol, estado, verificado, onEliminar }: UsuarioCardProps) {
    return (
        <article className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500 transition-colors shadow-sm">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-500/20">
                        ID Usuario #{id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{rol}</span>
                </div>

                <h3 className="text-lg font-bold text-white">{nombre}</h3>
                <p className="text-sm text-slate-400 mb-4 break-all">{email}</p>

                <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className={estado === 'Activo'
                        ? 'text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-xs font-medium px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-400 border border-slate-600'}>
                        {estado}
                    </span>
                    <span className="text-xs text-slate-400">
                        {verificado ? '✔ Verificado' : '✖ Sin verificar'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <button
                    disabled
                    className="w-full bg-slate-900/80 text-slate-400 text-sm font-medium py-2.5 px-4 rounded-lg cursor-not-allowed border border-slate-700"
                >
                    🔒 Ver detalle (Requiere Sesión)
                </button>

                <button
                    type="button"
                    onClick={() => onEliminar(id)}
                    className="w-full bg-transparent text-red-300 hover:bg-red-500/10 text-sm font-medium py-2.5 px-4 rounded-lg cursor-pointer border border-red-500/40 transition-colors"
                >
                    🗑 Eliminar
                </button>
            </div>
        </article>
    );
}