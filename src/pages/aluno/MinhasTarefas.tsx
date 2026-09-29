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

type Bucket = 'pending' | 'submitted' | 'graded'

export function MinhasTarefas() {
  const student = studentById(DEMO_STUDENT_ID)
  const [tab, setTab] = useState<Bucket>('pending')
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
    pending: mine.filter((a) => stateOf(a) === 'missing'),
    submitted: mine.filter((a) => ['submitted', 'late'].includes(stateOf(a))),
    graded: mine.filter((a) => stateOf(a) === 'graded'),
  }

  return (
    <>
      <PageHeader
        title="My assignments"
        subtitle={`${TERM.label} · ${mine.length} tarefas no bimestre`}
        crumbs={[{ label: 'My dashboard', to: '/my-dashboard' }, { label: 'My assignments' }]}
      />

      <Tabs
        label="Assignment status"
        value={tab}
        onChange={(v) => setTab(v as Bucket)}
        items={[
          { id: 'pending', label: 'Pending', count: buckets.pending.length },
          { id: 'submitted', label: 'Submitted', count: buckets.submitted.length },
          { id: 'graded', label: 'Graded', count: buckets.graded.length },
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
  pending: {
    title: 'Nothing pending',
    description: 'You have turned in everything that was open. The next assignment shows up here as soon as your teacher posts it.',
  },
  submitted: {
    title: 'Nothing waiting to be marked',
    description: 'You have nothing waiting to be marked right now.',
  },
  graded: {
    title: 'No grade posted yet',
    description: 'As soon as your teacher grades a submitted assignment, it shows up here with the feedback.',
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
              ? 'Graded'
              : state === 'missing'
                ? overdue
                  ? `Due ${relativeDay(assignment.due, TODAY)}`
                  : `Due ${relativeDay(assignment.due, TODAY)}`
                : 'Submitted'}
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
              Good progress on vocabulary. Watch your agreement in the past tense.
            </p>
          </>
        )}

        {state === 'missing' && (
          <div className="mt-auto">
            <Button variant="primary" icon={<Send size={14} />} onClick={onSubmit}>
              Turn in
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
    toast(`"${assignment.title}" turned in.`)
    setNote('')
    onClose()
  }

  return (
    <Modal
      open={assignment !== null}
      onClose={onClose}
      title={assignment ? `Turn in: ${assignment.title}` : 'Turn in'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" loading={saving} onClick={send}>
            Turn in
          </Button>
        </>
      }
    >
      <Field
        label="A note for your teacher"
        hint="Optional. Tell your teacher if anything was hard."
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
