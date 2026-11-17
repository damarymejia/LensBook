// frontend/src/features/usuarios/components/CrearUsuarioForm.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Usuario } from '../types/usuario.types'
import { crearUsuarioAsync, extraerMensajeErrorBackend } from '../api/usuariosApi'
import { crearUsuarioSchema, type CrearUsuarioSchemaType } from '../schemas/usuario.schema'

interface CrearUsuarioFormProps {
    onUsuarioCreado: (nuevoUsuario: Usuario) => void;
    onCancelar: () => void;
}

export function CrearUsuarioForm({ onUsuarioCreado, onCancelar }: CrearUsuarioFormProps) {
    // Mensaje exacto que devuelva .NET si rechaza la petición
    const [errorServidor, setErrorServidor] = useState<string | null>(null)

    // --- CONEXIÓN DEL ARTEFACTO DE VALIDACIÓN SINTÁCTICA EN TIEMPO REAL ---
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CrearUsuarioSchemaType>({
        resolver: zodResolver(crearUsuarioSchema),
        mode: 'onChange', // Evalúa cada tecla mientras el usuario escribe
        defaultValues: {
            nombre: '',
            email: '',
            password: '',
        },
    })

    // Solo se ejecuta cuando Zod garantiza que el dato está limpio
    const procesarEnvioLimpio = async (datosValidados: CrearUsuarioSchemaType) => {
        try {
            setErrorServidor(null)

            const usuarioCreadoEnBd = await crearUsuarioAsync(datosValidados)

            reset()
            onUsuarioCreado(usuarioCreadoEnBd)
        } catch (error) {
            // Si .NET rechaza la operación, mostramos el mensaje exacto del Backend
            const mensajeExactoDeNet = extraerMensajeErrorBackend(error)
            console.error('🚨 Rechazo reportado por el Backend .NET:', error)
            setErrorServidor(mensajeExactoDeNet)
        }
    }

    // Quita el banner del servidor en cuanto el usuario vuelve a escribir
    const limpiarErrorServidor = () => {
        if (errorServidor) setErrorServidor(null)
    }

    // Borde del campo: ámbar si Zod detecta error, rojo si el servidor rechazó, normal en otro caso
    const claseInput = (hayErrorZod: boolean) =>
        `w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
            hayErrorZod
                ? 'border-amber-500 focus:border-amber-400'
                : errorServidor
                ? 'border-red-500 focus:border-red-400'
                : 'border-slate-700 focus:border-indigo-500'
        }`

    return (
        <form
            onSubmit={handleSubmit(procesarEnvioLimpio)}
            className="bg-slate-800/90 border border-indigo-500/40 rounded-xl p-5 mb-8 shadow-lg"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-indigo-400">✨</span> Registrar Nuevo Usuario
                </h2>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
                    🛡️ Esquema Zod + FluentValidation .NET
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                    <input
                        type="text"
                        placeholder="Nombre"
                        disabled={isSubmitting}
                        autoFocus
                        {...register('nombre', { onChange: limpiarErrorServidor })}
                        className={claseInput(!!errors.nombre)}
                    />
                    {errors.nombre && (
                        <p className="text-amber-400 text-xs mt-2 font-medium">
                            ⚡ <strong>Validación en vivo:</strong> {errors.nombre.message}
                        </p>
                    )}
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Correo electrónico"
                        disabled={isSubmitting}
                        {...register('email', { onChange: limpiarErrorServidor })}
                        className={claseInput(!!errors.email)}
                    />
                    {errors.email && (
                        <p className="text-amber-400 text-xs mt-2 font-medium">
                            ⚡ <strong>Validación en vivo:</strong> {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        disabled={isSubmitting}
                        {...register('password', { onChange: limpiarErrorServidor })}
                        className={claseInput(!!errors.password)}
                    />
                    {errors.password && (
                        <p className="text-amber-400 text-xs mt-2 font-medium">
                            ⚡ <strong>Validación en vivo:</strong> {errors.password.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border disabled:border-slate-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    {isSubmitting ? '⏳ Guardando en BD...' : '💾 Guardar en PostgreSQL'}
                </button>

                <button
                    type="button"
                    onClick={onCancelar}
                    disabled={isSubmitting}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                    Cancelar
                </button>
            </div>

            {/* Retroalimentación del servidor: mensaje EXACTO devuelto por .NET FluentValidation */}
            {errorServidor && (
                <div className="mt-3 bg-red-950/60 border border-red-500/40 rounded-lg p-3 text-xs text-red-300 flex items-center gap-2">
                    <span className="text-base">🛡️</span>
                    <span><strong>Respuesta del Backend (.NET):</strong> {errorServidor}</span>
                </div>
            )}
        </form>
    )
}