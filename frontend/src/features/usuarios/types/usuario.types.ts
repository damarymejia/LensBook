// Espejo exacto del UsuarioResponseDto del Backend en C#
// frontend/src/features/usuarios/types/usuario.types.ts

// 1. Contrato de Lectura / Salida (espejo del UsuarioResponseDto de C#)
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    estado: string;
    verificado: boolean;
}

// 2. Contrato de Escritura / Entrada (espejo del CreateUsuarioRequestDto de C#)
export interface CrearUsuarioDto {
    nombre: string;
    email: string;
    password: string;
}

// 3. Contrato de Error de FluentValidation (.NET ValidationFailure)
export interface FluentValidationError {
    propertyName: string;
    errorMessage: string;
    attemptedValue?: unknown;
    errorCode?: string;
}