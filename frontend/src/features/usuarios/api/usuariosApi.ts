// frontend/src/features/usuarios/api/usuariosApi.ts
import axios from 'axios'
import type { Usuario } from '../types/usuario.types'

// 1. Instancia centralizada de Axios configurada con la variable de entorno (.env)
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 2. Petición HTTP GET real hacia el Backend (.NET -> PostgreSQL)
// axios.get<Usuario[]> garantiza que el JSON recibido cumpla nuestro contrato TypeScript
export const obtenerUsuariosAsync = async (): Promise<Usuario[]> => {
    const respuesta = await apiClient.get<Usuario[]>('/usuarios')
    return respuesta.data
}