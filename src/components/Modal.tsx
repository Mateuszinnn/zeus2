import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

/* Fecha com Esc e clique no overlay, prende o foco dentro do painel e devolve
 * o foco ao gatilho ao sair. Modal só para tarefa que precisa de interrupção
 * ou de foco protegido — nunca para o que cabe na própria tela. */

const WIDTHS = {
  sm: 'max-w-100',
  md: 'max-w-140',
  lg: 'max-w-180',
} as const

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  size?: keyof typeof WIDTHS
  footer?: ReactNode
  children: ReactNode
}

export function Modal({ open, onClose, title, size = 'md', footer, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const trigger = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    trigger.current = document.activeElement
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('[data-autofocus], button, input, textarea, select')?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      ;(trigger.current as HTMLElement | null)?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-gray-90/50 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative flex max-h-[85dvh] w-full flex-col rounded-lg bg-surface shadow-lg',
          WIDTHS[size],
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b border-default px-6 py-5">
          <h2 id="modal-title" className="text-h3 text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-gray-20 hover:text-primary"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        {footer && (
          <footer className="flex justify-end gap-2 border-t border-default px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
