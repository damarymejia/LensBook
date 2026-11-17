// frontend/src/features/usuarios/schemas/usuario.schema.ts
import { z } from 'zod'

// Artefacto declarativo de validación sintáctica (espejo de CreateUsuarioValidator en .NET)
export const crearUsuarioSchema = z.object({
    nombre: z
        .string()
        .trim() // Sanitiza espacios al inicio y al final
        .min(1, 'El nombre es obligatorio.')
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.')
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]+$/,
            'El nombre contiene caracteres no permitidos.'
        ),
    email: z
        .string()
        .trim()
        .min(1, 'El correo es obligatorio.')
        .email('El correo no tiene un formato válido.'),
    password: z
        .string()
        .min(1, 'La contraseña es obligatoria.')
        .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
})

export type CrearUsuarioSchemaType = z.infer<typeof crearUsuarioSchema>