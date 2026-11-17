// frontend/src/features/usuarios/types/usuario.types.ts

// Espejo de los enums de LensBook.Domain.Enums (el backend los envía como texto)
export type RolUsuario = 'Cliente' | 'Fotografo' | 'Administrador'
export type EstadoCuenta = 'Activo' | 'Inactivo'

// 1. Contrato de Lectura / Salida (espejo del UsuarioResponseDto de C#)
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: RolUsuario;
    estado: EstadoCuenta;
    verificado: boolean;
}

// 2. Contrato de Escritura / Entrada (espejo del CreateUsuarioRequestDto de C#)
export interface CrearUsuarioDto {
    nombre: string;
    email: string;
    password: string;
}

// 3. Contrato de Actualización (espejo del UpdateUsuarioRequestDto de la Clase 9)
export interface ActualizarUsuarioDto {
    nombre: string;
}

// 4. Contrato de Error de FluentValidation (.NET ValidationFailure)
export interface FluentValidationError {
    propertyName: string;
    errorMessage: string;
    attemptedValue?: unknown;
    errorCode?: string;
}