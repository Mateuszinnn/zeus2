import { useState } from 'react'
import { CircleCheck, FileClock, Send } from 'lucide-react'
import { Button } from '@/components/Button'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/cn'
import { plural, relativeDay, shortDate, weekday } from '@/lib/format'
import { delay } from '@/mocks/delay'
import { ASSIGNMENTS, TODAY, skillById, type Student } from '@/mocks/data'

/* A faixa de cima do aluno. Mesma gramática da do professor: ordenada por
 * prazo, acromática, com a cor só no fio da borda. A entrega se resolve dentro
 * do cartão — é a única escrita permitida ao aluno. */

type Status = 'late' | 'due' | 'submitted'

interface MyTask {
  id: string
  title: string
  skill: string
  due: string
  status: Status
  statusLabel: string
  /** Nota, quando já avaliada. */
  score?: number
}

function buildTasks(student: Student): MyTask[] {
  const mine = ASSIGNMENTS.filter((a) => a.turmaId === student.turmaId)
  return mine
    .map<MyTask>((a) => {
      const overdue = a.due < TODAY
      const graded = a.graded === a.total
      if (graded) {
        return {
          id: a.id,
          title: a.title,
          skill: skillById(a.skillId).name,
          due: a.due,
          status: 'submitted',
          statusLabel: 'Avaliada',
          score: student.bySkill[a.skillId],
        }
      }
      return {
        id: a.id,
        title: a.title,
        skill: skillById(a.skillId).name,
        due: a.due,
        status: overdue ? 'late' : 'due',
        statusLabel: overdue ? `Atrasada ${relativeDay(a.due, TODAY)}` : `Vence ${relativeDay(a.due, TODAY)}`,
      }
    })
    .sort((a, b) => a.due.localeCompare(b.due))
}

const RING: Record<Status, string> = {
  late: 'border-error',
  due: 'border-accent',
  submitted: 'border-success',
}

const INK: Record<Status, string> = {
  late: 'text-error-ink',
  due: 'text-brand',
  submitted: 'text-success-ink',
}

export function MyPending({ student }: { student: Student }) {
  const [tasks, setTasks] = useState(() => buildTasks(student))
  const [sending, setSending] = useState<string | null>(null)
  const toast = useToast()

  const open = tasks.filter((t) => t.status !== 'submitted')

  async function submit(task: MyTask) {
    setSending(task.id)
    await delay()
    setSending(null)
    setTasks((list) =>
      list.map((t) =>
        t.id === task.id ? { ...t, status: 'submitted', statusLabel: 'Entregue', score: undefined } : t,
      ),
    )
    toast(`"${task.title}" entregue.`)
  }

  return (
    <section aria-labelledby="minhas-pendencias">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="minhas-pendencias" className="text-h3 text-primary">
          Hoje, {weekday(TODAY)} {shortDate(TODAY)}
        </h2>
        <span className="text-caption text-muted">
          {open.length > 0
            ? `${plural(open.length, 'tarefa em aberto', 'tarefas em aberto')}`
            : 'Nenhuma tarefa em aberto'}
        </span>
      </header>

      {open.length === 0 ? (
        <div className="flex items-center gap-4 rounded-xl border border-success bg-success-soft px-6 py-5">
          <CircleCheck size={24} className="shrink-0 text-success" aria-hidden="true" />
          <div>
            <p className="text-body font-medium text-primary">Tudo entregue.</p>
            <p className="mt-0.5 text-caption text-secondary">
              Nenhuma tarefa aguardando você. A próxima entrega aparece aqui assim que o professor
              publicar.
            </p>
          </div>
        </div>
      ) : (
        <ul className="flex gap-4 overflow-x-auto pb-2">
          {tasks.map((task) => (
            <li key={task.id} className="w-72 shrink-0">
              <article
                className={cn(
                  'flex h-full flex-col rounded-xl border bg-surface p-5 shadow-sm',
                  RING[task.status],
                  task.status === 'submitted' && 'bg-surface-alt',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-caption text-muted">{shortDate(task.due)}</span>
                  <span className={cn('text-caption font-medium', INK[task.status])}>
                    {task.statusLabel}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-2.5">
                  <FileClock size={20} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
                  <h3
                    className={cn(
                      'text-body font-medium',
                      task.status === 'submitted' ? 'text-secondary' : 'text-primary',
                    )}
                  >
                    {task.title}
                  </h3>
                </div>

                <p className="mt-1.5 pl-[30px] text-caption text-muted">{task.skill}</p>

                <div className="mt-4 pl-[30px]">
                  {task.status === 'submitted' ? (
                    <span className="inline-flex items-center gap-1.5 text-caption text-success-ink">
                      <CircleCheck size={14} aria-hidden="true" />
                      {task.score !== undefined ? 'Avaliada' : 'Entregue'}
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant={task.status === 'late' ? 'primary' : 'secondary'}
                      icon={<Send size={14} />}
                      loading={sending === task.id}
                      onClick={() => submit(task)}
                    >
                      Entregar
                    </Button>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
