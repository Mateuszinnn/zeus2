import { CalendarCheck, CircleCheck, ClipboardList, FileClock } from 'lucide-react'
import { Button } from '@/components/Button'
import { cn } from '@/lib/cn'
import { plural, weekday, shortDate } from '@/lib/format'
import type { Pending, PendingState } from './pendings'

/* The top band.
 *
 * Achromatic: colour appears only as a hairline on the border, marking state.
 * Full colour is reserved for the bottom band, where it means performance.
 *
 * The band scrolls, but the HEAD never does: items are ordered by time, the
 * most urgent sits against the left edge, and the header counter states the
 * total — nothing off-screen is a surprise. */

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
    <section aria-labelledby="today-band">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="today-band" className="text-h3 text-primary">
          Today, {weekday(date)}, {shortDate(date)}
        </h2>
        <span className="text-caption text-muted">
          {open.length > 0
            ? `${plural(open.length, 'item open', 'items open')} of ${pendings.length}`
            : `${pendings.length} items, all clear`}
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
        // The tail scrolls; the head is always visible.
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
                    Nothing to do
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

/* All clear does NOT disappear: it collapses into a single wide block. In a
 * demo, a clean state has to look intentional, not broken. */
function AllClear() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-success bg-success-soft px-6 py-5">
      <CircleCheck size={24} className="shrink-0 text-success" aria-hidden="true" />
      <div>
        <p className="text-body font-medium text-primary">The day is clear.</p>
        <p className="mt-0.5 text-caption text-secondary">
          Roll calls taken, deadlines in order and nothing waiting to be marked. The next
          submission is due on Tuesday.
        </p>
      </div>
    </div>
  )
}
