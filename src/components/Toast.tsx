import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/cn'

/* Toda ação de escrita mockada confirma por toast. É o que dá sensação de
 * sistema real numa demo sem backend. */

type Tone = 'success' | 'error'

interface Toast {
  id: number
  tone: Tone
  message: string
}

const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message: string, tone: Tone = 'success') => {
      const id = nextId.current++
      setToasts((list) => [...list, { id, tone, message }])
      // Erro exige fechar; sucesso sai sozinho.
      if (tone === 'success') setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  const value = useMemo(() => push, [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed top-4 right-4 z-50 flex w-80 flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 overflow-hidden rounded-lg',
              'border border-default bg-surface py-3 pr-3 pl-4 shadow-lg',
            )}
          >
            <span
              className={cn(
                'mt-0.5 shrink-0',
                toast.tone === 'success' ? 'text-success' : 'text-error',
              )}
              aria-hidden="true"
            >
              {toast.tone === 'success' ? <Check size={16} /> : <TriangleAlert size={16} />}
            </span>
            <p className="flex-1 text-body text-primary">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Fechar aviso"
              className="shrink-0 rounded-sm text-muted transition-colors hover:text-primary"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
