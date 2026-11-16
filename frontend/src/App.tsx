// frontend/src/App.tsx
import { AppLayout } from './layouts/AppLayout'
import { UsuariosView } from './features/usuarios/components/UsuariosView'

function App() {
  return (
    <AppLayout>
      <UsuariosView />
    </AppLayout>
  )
}

export default App