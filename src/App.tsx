import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { ToastProvider } from '@/components/Toast'
import { SessionProvider, useSession } from '@/mocks/session'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { MeuPainel } from '@/pages/MeuPainel'
import { EmBreve } from '@/pages/EmBreve'

/* Rotas ainda não construídas caem em EmBreve, para que o menu nunca termine
 * em beco sem saída durante o desenvolvimento. */
const PLACEHOLDER = [
  '/turmas',
  '/alunos',
  '/notas',
  '/faltas',
  '/ocorrencias',
  '/tarefas',
  '/avisos',
  '/matriculas',
  '/minhas-notas',
  '/minhas-faltas',
  '/minhas-ocorrencias',
  '/minhas-tarefas',
  '/minha-ficha',
  '/configuracoes',
  '/ajuda',
  '/contato',
]

function Home() {
  const { role } = useSession()
  if (!role) return <Navigate to="/entrar" replace />
  return <Navigate to={role === 'student' ? '/meu-painel' : '/painel'} replace />
}

export function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <Routes>
          <Route path="/entrar" element={<Login />} />
          <Route element={<AppShell />}>
            <Route path="/painel" element={<Dashboard />} />
            <Route path="/meu-painel" element={<MeuPainel />} />
            {PLACEHOLDER.map((path) => (
              <Route key={path} path={path} element={<EmBreve />} />
            ))}
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </ToastProvider>
    </SessionProvider>
  )
}
