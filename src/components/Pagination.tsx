import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

/* Página ativa em laranja: é o destaque de POSIÇÃO do sistema, um dos dois
 * únicos empregos dessa cor fora da marca. Texto laranja escuro sobre fundo
 * laranja suave — nunca texto branco sobre o laranja de marca. */

interface PaginationProps {
  page: number
  pageCount: number
  onChange: (next: number) => void
}

function pagesToShow(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, 'gap', pageCount]
  if (page >= pageCount - 3) {
    return [1, 'gap', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  }
  return [1, 'gap', page - 1, page, page + 1, 'gap', pageCount]
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav aria-label="Paginação">
      <ul className="flex items-center gap-1">
        <li>
          <Arrow
            direction="prev"
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
          />
        </li>
        {pagesToShow(page, pageCount).map((entry, i) =>
          entry === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-caption text-muted">
              …
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                onClick={() => onChange(entry)}
                aria-current={entry === page ? 'page' : undefined}
                aria-label={`Página ${entry}`}
                className={cn(
                  'size-8 rounded-md text-body transition-colors duration-150 ease-expo',
                  entry === page
                    ? 'bg-orange-50 font-medium text-orange-700'
                    : 'text-secondary hover:bg-gray-20 hover:text-primary',
                )}
              >
                {entry}
              </button>
            </li>
          ),
        )}
        <li>
          <Arrow
            direction="next"
            disabled={page === pageCount}
            onClick={() => onChange(page + 1)}
          />
        </li>
      </ul>
    </nav>
  )
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Página anterior' : 'Próxima página'}
      className={cn(
        'flex size-8 items-center justify-center rounded-md text-muted',
        'transition-colors duration-150 ease-expo',
        'hover:bg-gray-20 hover:text-primary',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
      )}
    >
      <Icon size={16} />
    </button>
  )
}
