// frontend/src/features/usuarios/api/usuariosApi.ts
import type { Usuario } from '../types/usuario.types'

// Función asíncrona que retorna una Promesa con el arreglo de usuarios
export const obtenerUsuariosAsync = (): Promise<Usuario[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const datosUsuarios: Usuario[] = [
                { id: 1, nombre: 'Ana Martínez', email: 'ana@correo.com', rol: 'Cliente', estado: 'Activo', verificado: true },
                { id: 2, nombre: 'Carlos Mejía', email: 'carlos.mejia@lensbook.com', rol: 'Fotografo', estado: 'Activo', verificado: true },
                { id: 3, nombre: 'Sofía Rivera', email: 'sofia.rivera@correo.com', rol: 'Cliente', estado: 'Activo', verificado: false },
                { id: 4, nombre: 'Luis Fernández', email: 'luis.fernandez@lensbook.com', rol: 'Fotografo', estado: 'Inactivo', verificado: true },
                { id: 5, nombre: 'Daniela Cruz', email: 'daniela@correo.com', rol: 'Cliente', estado: 'Inactivo', verificado: false },
                { id: 6, nombre: 'Administrador LensBook', email: 'admin@lensbook.com', rol: 'Administrador', estado: 'Activo', verificado: true },
            ]
            resolve(datosUsuarios)
        }, 1000)
    })
}