import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'

/* Tabela real, semântica e ordenável. Os quatro estados — normal, carregando,
 * vazio e erro — são obrigatórios: nenhuma tabela entra no sistema sem eles.
 *
 * O componente não conhece o domínio; quem chama define as colunas. */

export interface Column<T> {
  key: string
  header: string
  align?: 'left' | 'right'
  /** Classe de largura, para a coluna não dançar entre páginas. */
  width?: string
  sortable?: boolean
  cell: (row: T) => ReactNode
}

export type SortDirection = 'asc' | 'desc'

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  caption: string
  state?: 'ready' | 'loading' | 'error'
  empty?: ReactNode
  errorSlot?: ReactNode
  sortKey?: string
  sortDirection?: SortDirection
  onSort?: (key: string) => void
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  state = 'ready',
  empty,
  errorSlot,
  sortKey,
  sortDirection = 'asc',
  onSort,
}: DataTableProps<T>) {
  if (state === 'error') return <>{errorSlot}</>
  if (state === 'ready' && rows.length === 0) return <>{empty}</>

  return (
    <>
      {/* Em largura de telefone a tabela deixa de ser tabela: cada registro
          vira um cartão com o rótulo acima do valor. Rolagem horizontal dentro
          de um contêiner esconde as colunas que importam — numa tela de notas,
          esconde justamente as notas. */}
      <ul className="flex flex-col gap-3 p-4 md:hidden">
        {state === 'loading'
          ? Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="skeleton h-28 rounded-lg" />
            ))
          : rows.map((row) => (
              <li key={rowKey(row)} className="rounded-lg border border-default bg-surface p-4">
                <div className="border-b border-default pb-3">{columns[0].cell(row)}</div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                  {columns.slice(1).map((column) => (
                    <div key={column.key} className="min-w-0">
                      <dt className="text-caption text-muted">{column.header}</dt>
                      {/* No cartão o valor encosta no rótulo: o alinhamento à
                          direita só faz sentido dentro da coluna da tabela. */}
                      <dd className="mt-0.5 [&>button]:w-auto [&>button]:text-left">
                        {column.cell(row)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
      <table className="w-full border-collapse text-body" data-scan>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-default">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={
                  sortKey === column.key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : column.sortable
                      ? 'none'
                      : undefined
                }
                className={cn(
                  'h-11 px-6 text-label font-medium whitespace-nowrap text-muted',
                  column.align === 'right' ? 'text-right' : 'text-left',
                  column.width,
                )}
              >
                {column.sortable && onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort(column.key)}
                    className={cn(
                      'group inline-flex items-center gap-1.5 rounded-sm',
                      'transition-colors duration-150 ease-expo hover:text-primary',
                      column.align === 'right' && 'flex-row-reverse',
                    )}
                  >
                    {column.header}
                    <SortIcon active={sortKey === column.key} direction={sortDirection} />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {state === 'loading'
            ? Array.from({ length: 8 }, (_, i) => (
                <tr key={i} className="border-b border-default">
                  {columns.map((column) => (
                    <td key={column.key} className="h-14 px-6">
                      <div className="skeleton h-4 rounded-sm" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row, i) => (
                <tr
                  key={rowKey(row)}
                  className={cn(
                    'border-b border-default transition-colors duration-150 ease-expo',
                    i % 2 === 1 && 'bg-app',
                    'hover:bg-surface-alt',
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'h-14 px-6',
                        column.align === 'right' ? 'text-right' : 'text-left',
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      </div>
    </>
  )
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) {
    return (
      <ChevronsUpDown
        size={14}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    )
  }
  const Icon = direction === 'asc' ? ArrowUp : ArrowDown
  return <Icon size={14} className="text-primary" aria-hidden="true" />
}

/* Rodapé da tabela: contagem à esquerda, paginação ao centro, itens por
 * página à direita. */
export function TableFooter({
  from,
  to,
  total,
  children,
  perPage,
}: {
  from: number
  to: number
  total: number
  children: ReactNode
  perPage: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-default px-6 py-4">
      <p className="text-caption text-muted">
        Exibindo {from}–{to} de {total}
      </p>
      {children}
      <div className="flex items-center gap-2 text-caption text-muted">
        <span>Resultados por página</span>
        {perPage}
      </div>
    </div>
  )
}
