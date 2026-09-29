import { useMemo, useState } from 'react'
import { PartyPopper, Send } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { Tabs, TabPanel } from '@/components/Tabs'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { GradeBar } from '@/components/GradeBar'
import { Field, TextArea } from '@/components/Field'
import { useToast } from '@/components/Toast'
import { relativeDay, shortDate } from '@/lib/format'
import { delay } from '@/mocks/delay'
import {
  ASSIGNMENTS,
  DEMO_STUDENT_ID,
  TERM,
  TODAY,
  skillById,
  studentById,
  type Assignment,
} from '@/mocks/data'
import { submissionFor, type SubmissionState } from '@/mocks/records'

type Bucket = 'pendentes' | 'entregues' | 'avaliadas'

export function MinhasTarefas() {
  const student = studentById(DEMO_STUDENT_ID)
  const [tab, setTab] = useState<Bucket>('pendentes')
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [composing, setComposing] = useState<Assignment | null>(null)

  const mine = useMemo(
    () => ASSIGNMENTS.filter((a) => a.turmaId === student.turmaId),
    [student.turmaId],
  )

  function stateOf(assignment: Assignment): SubmissionState {
    if (submitted[assignment.id]) return 'submitted'
    return submissionFor(assignment.id, student.id)?.state ?? 'missing'
  }

  const buckets: Record<Bucket, Assignment[]> = {
    pendentes: mine.filter((a) => stateOf(a) === 'missing'),
    entregues: mine.filter((a) => ['submitted', 'late'].includes(stateOf(a))),
    avaliadas: mine.filter((a) => stateOf(a) === 'graded'),
  }

  return (
    <>
      <PageHeader
        title="Minhas tarefas"
        subtitle={`${TERM.label} · ${mine.length} tarefas no bimestre`}
        crumbs={[{ label: 'Meu painel', to: '/meu-painel' }, { label: 'Minhas tarefas' }]}
      />

      <Tabs
        label="Situação das tarefas"
        value={tab}
        onChange={(v) => setTab(v as Bucket)}
        items={[
          { id: 'pendentes', label: 'Pendentes', count: buckets.pendentes.length },
          { id: 'entregues', label: 'Entregues', count: buckets.entregues.length },
          { id: 'avaliadas', label: 'Avaliadas', count: buckets.avaliadas.length },
        ]}
        className="mb-6"
      />

      {(Object.keys(buckets) as Bucket[]).map((bucket) => (
        <TabPanel key={bucket} id={bucket} active={tab === bucket}>
          {buckets[bucket].length === 0 ? (
            <Card>
              <EmptyState
                icon={<PartyPopper size={40} />}
                title={EMPTY[bucket].title}
                description={EMPTY[bucket].description}
              />
            </Card>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {buckets[bucket].map((assignment) => (
                <TaskCard
                  key={assignment.id}
                  assignment={assignment}
                  state={stateOf(assignment)}
                  score={student.bySkill[assignment.skillId]}
                  onSubmit={() => setComposing(assignment)}
                />
              ))}
            </div>
          )}
        </TabPanel>
      ))}

      <SubmitModal
        assignment={composing}
        onClose={() => setComposing(null)}
        onSubmitted={(id) => setSubmitted((prev) => ({ ...prev, [id]: true }))}
      />
    </>
  )
}

const EMPTY: Record<Bucket, { title: string; description: string }> = {
  pendentes: {
    title: 'Nada pendente',
    description: 'Você entregou tudo que estava em aberto. A próxima tarefa aparece aqui assim que a professora publicar.',
  },
  entregues: {
    title: 'Nada aguardando correção',
    description: 'Você não tem entregas esperando a professora corrigir neste momento.',
  },
  avaliadas: {
    title: 'Nenhuma nota publicada ainda',
    description: 'Assim que a professora lançar a nota de uma tarefa entregue, ela aparece aqui com o comentário.',
  },
}

function TaskCard({
  assignment,
  state,
  score,
  onSubmit,
}: {
  assignment: Assignment
  state: SubmissionState
  score: number
  onSubmit: () => void
}) {
  const overdue = assignment.due < TODAY && state === 'missing'
  return (
    <Card className="flex flex-col">
      <CardHeader
        title={assignment.title}
        meta={<span className="text-caption text-muted">{skillById(assignment.skillId).name}</span>}
      />
      <CardBody className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge
            tone={
              state === 'graded'
                ? 'success'
                : state === 'missing'
                  ? overdue
                    ? 'error'
                    : 'info'
                  : 'info'
            }
          >
            {state === 'graded'
              ? 'Avaliada'
              : state === 'missing'
                ? overdue
                  ? `Atrasada ${relativeDay(assignment.due, TODAY)}`
                  : `Vence ${relativeDay(assignment.due, TODAY)}`
                : 'Entregue'}
          </StatusBadge>
          <span className="text-caption text-muted">prazo {shortDate(assignment.due)}</span>
        </div>

        {state === 'graded' && (
          <>
            <GradeBar
              value={score}
              label={`Minha nota em ${assignment.title}`}
              className="w-full"
            />
            <p className="text-body text-secondary">
              Boa evolução no vocabulário. Cuide da concordância no passado.
            </p>
          </>
        )}

        {state === 'missing' && (
          <div className="mt-auto">
            <Button variant="primary" icon={<Send size={14} />} onClick={onSubmit}>
              Entregar
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

function SubmitModal({
  assignment,
  onClose,
  onSubmitted,
}: {
  assignment: Assignment | null
  onClose: () => void
  onSubmitted: (id: string) => void
}) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  async function send() {
    if (!assignment) return
    setSaving(true)
    await delay()
    setSaving(false)
    onSubmitted(assignment.id)
    toast(`"${assignment.title}" entregue.`)
    setNote('')
    onClose()
  }

  return (
    <Modal
      open={assignment !== null}
      onClose={onClose}
      title={assignment ? `Entregar: ${assignment.title}` : 'Entregar'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" loading={saving} onClick={send}>
            Entregar
          </Button>
        </>
      }
    >
      <Field
        label="Comentário para a professora"
        hint="Opcional. Conte se teve alguma dificuldade."
      >
        {(props) => (
          <TextArea
            {...props}
            data-autofocus
            rows={5}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        )}
      </Field>
    </Modal>
  )
}
