import { CalendarCheck, CircleCheck, ClipboardList, FileClock } from 'lucide-react'
import { Button } from '@/components/Button'
import { cn } from '@/lib/cn'
import { plural, weekday, shortDate } from '@/lib/format'
import type { Pending, PendingState } from './pendings'

/* A faixa de cima.
 *
 * Acromática: a cor entra só como fio fino na borda, marcando estado. Cor plena
 * fica reservada à faixa de baixo, onde significa desempenho.
 *
 * A faixa rola, mas a CABEÇA nunca: as pendências vêm ordenadas por hora, a
 * mais urgente encosta na borda esquerda, e o contador do cabeçalho diz o total
 * — nada fora da tela é surpresa. */

const STATE_RING: Record<PendingState, string> = {
  pending: 'border-accent',
  late: 'border-error',
  done: 'border-success',
}

const STATE_INK: Record<PendingState, string> = {
  pending: 'text-brand',
  late: 'text-error-ink',
  done: 'text-success-ink',
}

const KIND_ICON = {
  rollcall: CalendarCheck,
  grading: ClipboardList,
  due: FileClock,
} as const

interface PendingBandProps {
  date: string
  pendings: Pending[]
  onAct: (pending: Pending) => void
}

export function PendingBand({ date, pendings, onAct }: PendingBandProps) {
  const open = pendings.filter((p) => p.state !== 'done')

  return (
    <section aria-labelledby="faixa-hoje">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="faixa-hoje" className="text-h3 text-primary">
          Hoje, {weekday(date)} {shortDate(date)}
        </h2>
        <span className="text-caption text-muted">
          {open.length > 0
            ? `${plural(open.length, 'pendência', 'pendências')} de ${pendings.length} compromissos`
            : `${pendings.length} compromissos, todos resolvidos`}
        </span>
      </header>

      {open.length === 0 ? <AllClear /> : <Rail pendings={pendings} onAct={onAct} />}
    </section>
  )
}

function Rail({ pendings, onAct }: { pendings: Pending[]; onAct: (p: Pending) => void }) {
  return (
    <ul
      className={cn(
        'flex gap-4 overflow-x-auto pb-2',
        // A cauda rola; a cabeça está sempre visível.
        '[scrollbar-width:thin]',
      )}
    >
      {pendings.map((pending) => {
        const Icon = KIND_ICON[pending.kind]
        const done = pending.state === 'done'
        return (
          <li key={pending.id} className="w-72 shrink-0">
            <article
              className={cn(
                'flex h-full flex-col rounded-xl border bg-surface p-5 shadow-sm',
                'transition-colors duration-150 ease-expo',
                STATE_RING[pending.state],
                done && 'bg-surface-alt',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-caption text-muted">{pending.time}</span>
                <span className={cn('text-caption font-medium', STATE_INK[pending.state])}>
                  {pending.stateLabel}
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2.5">
                <Icon size={20} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
                <h3 className={cn('text-body font-medium', done ? 'text-secondary' : 'text-primary')}>
                  {pending.title}
                </h3>
              </div>

              <p className="mt-1.5 pl-[30px] text-caption text-muted">{pending.context}</p>

              <div className="mt-4 pl-[30px]">
                {done ? (
                  <span className="inline-flex items-center gap-1.5 text-caption text-success-ink">
                    <CircleCheck size={14} aria-hidden="true" />
                    Nada a fazer
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant={pending.state === 'late' ? 'primary' : 'secondary'}
                    onClick={() => onAct(pending)}
                  >
                    {pending.action}
                  </Button>
                )}
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

/* Tudo em dia NÃO some: colapsa num bloco único e largo. Numa demo, um estado
 * limpo precisa parecer intencional, não quebrado. */
function AllClear() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-success bg-success-soft px-6 py-5">
      <CircleCheck size={24} className="shrink-0 text-success" aria-hidden="true" />
      <div>
        <p className="text-body font-medium text-primary">O dia está em dia.</p>
        <p className="mt-0.5 text-caption text-secondary">
          Chamadas feitas, prazos em ordem e nenhuma correção aguardando. A próxima entrega vence
          na terça.
        </p>
      </div>
    </div>
  )
}
