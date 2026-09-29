import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useSession } from '@/mocks/session'
import { Sidebar } from './Sidebar'
import { ZeusMark } from './ZeusMark'

/* O esqueleto de toda tela autenticada: faixa escura fixa à esquerda, conteúdo
 * rolável à direita. Só o conteúdo rola. Abaixo de 1024px a faixa vira gaveta
 * sobreposta. Ver design system §4. */

export function AppShell() {
  const { role } = useSession()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // A gaveta fecha ao trocar de rota e responde a Esc.
  useEffect(() => setDrawerOpen(false), [location.pathname])
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  if (!role) return <Navigate to="/entrar" replace />

  return (
    <div className="flex h-dvh overflow-hidden bg-app">
      <aside className="hidden w-64 shrink-0 lg:block">
        <Sidebar />
      </aside>

      {drawerOpen && (
        <>
          <button
            type="button"
            aria-label="Fechar navegação"
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-gray-90/50 lg:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 shadow-lg lg:hidden">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-default bg-surface px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir navegação"
            aria-expanded={drawerOpen}
            className="rounded-md p-2 text-secondary transition-colors hover:bg-gray-20 hover:text-primary"
          >
            <Menu size={20} />
          </button>
          <span className="flex items-center gap-2 text-primary">
            <ZeusMark size={22} />
            <span className="text-h3 text-primary">Zeus</span>
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
