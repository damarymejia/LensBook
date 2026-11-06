// frontend/src/components/UsuarioCard.tsx

// --- ZONA 1: EL CONTRATO (INTERFAZ) ---
// Espejo exacto del UsuarioResponseDto de C# (nunca incluye PasswordHash).
interface UsuarioCardProps {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    estado: string;
    verificado: boolean;
}

// --- ZONA 2: LA FIRMA (EXPORTACIÓN NOMBRADA) ---
// Desestructuramos las props cumpliendo el contrato de UsuarioCardProps
export function UsuarioCard({ id, nombre, email, rol, estado, verificado }: UsuarioCardProps) {

    // --- ZONA 3: EL CEREBRO (LÓGICA) ---
    // (Vacío por los momentos, este componente es puramente presentacional)

    // --- ZONA 4: EL RENDERIZADO (JSX) ---
    return (
        <article className="usuario-card" style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', borderRadius: '8px' }}>
            <small style={{ color: 'gray' }}>ID Usuario: {id}</small>
            <h3>{nombre}</h3>
            <p>{email}</p>
            <p>Rol: {rol} | Estado: {estado}</p>
            <p>{verificado ? '✔ Verificado' : '✖ Sin verificar'}</p>

            {/*
               Cuando tengamos autenticación (sesión de usuario),
               este botón llevará al detalle del usuario.
            */}
            <button disabled style={{ cursor: 'not-allowed' }}>
                Ver detalle (Próximamente)
            </button>
        </article>
    );
}