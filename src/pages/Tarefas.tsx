import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { DataTable, type Column } from '@/components/DataTable'
import { GradeCell } from '@/features/grades/GradeCell'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/cn'
import { relativeDay, shortDate } from '@/lib/format'
import { delay } from '@/mocks/delay'
import {
  ASSIGNMENTS,
  TERM,
  TODAY,
  TURMAS,
  skillById,
  studentById,
  turmaById,
  type Assignment,
} from '@/mocks/data'
import { submissionsOf, type Submission, type SubmissionState } from '@/mocks/records'

const ALL = 'all'

const STATE_LABEL: Record<SubmissionState, string> = {
  submitted: 'Submitted',
  late: 'Submitted late',
  missing: 'Not submitted',
  graded: 'Graded',
}

const STATE_TONE: Record<SubmissionState, 'success' | 'warning' | 'error' | 'info'> = {
  submitted: 'info',
  late: 'warning',
  missing: 'error',
  graded: 'success',
}

export function Tarefas() {
  const [loading, setLoading] = useState(true)
  const [turma, setTurma] = useState(ALL)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    delay().then(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const rows = useMemo(
    () =>
      ASSIGNMENTS.filter((a) => turma === ALL || a.turmaId === turma).sort((a, b) =>
        a.due.localeCompare(b.due),
      ),
    [turma],
  )

  const open = openId ? (ASSIGNMENTS.find((a) => a.id === openId) ?? null) : null

  if (open) {
    return <AssignmentDetail assignment={open} onBack={() => setOpenId(null)} />
  }

  return (
    <>
      <PageHeader
        title="Assignments"
        subtitle={`${TERM.label} · ${ASSIGNMENTS.length} assignments this term`}
        crumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Assignments' }]}
        actions={
          <Select
            label="Filter by class"
            value={turma}
            onChange={setTurma}
            options={[
              { value: ALL, label: 'All classes' },
              ...TURMAS.map((t) => ({ value: t.id, label: `${t.name} · ${t.stage}` })),
            ]}
          />
        }
      />

      {loading ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-48 rounded-xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ClipboardList size={40} />}
            title="No assignment in this class"
            description="Nothing was posted for this class this term. Change the filter to see the others."
          />
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {rows.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onOpen={() => setOpenId(assignment.id)}
            />
          ))}
        </div>
      )}
    </>
  )
}

function AssignmentCard({
  assignment,
  onOpen,
}: {
  assignment: Assignment
  onOpen: () => void
}) {
  const overdue = assignment.due < TODAY
  const graded = assignment.graded === assignment.total
  const pct = (assignment.submitted / assignment.total) * 100

  return (
    <Card className="flex flex-col">
      <CardHeader
        title={assignment.title}
        meta={
          <span className="text-caption text-muted">{skillById(assignment.skillId).name}</span>
        }
      />
      <CardBody className="flex flex-1 flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone={graded ? 'success' : overdue ? 'error' : 'info'}>
            {graded ? 'Graded' : overdue ? `Due ${relativeDay(assignment.due, TODAY)}` : `Due ${relativeDay(assignment.due, TODAY)}`}
          </StatusBadge>
          <span className="text-caption text-muted">
            {turmaById(assignment.turmaId).name} · due {shortDate(assignment.due)}
          </span>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-body font-medium text-primary">
              {assignment.submitted} of {assignment.total} submitted
            </span>
            <span className="text-caption text-muted">
              {assignment.total - assignment.submitted} missing
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Submissions for ${assignment.title}`}
            className="mt-2 h-2 overflow-hidden rounded-full bg-gray-30"
          >
            <div
              className={cn('h-full rounded-full', graded ? 'bg-success' : 'bg-accent')}
              style={{ width: `${Math.max(2, pct)}%` }}
            />
          </div>
        </div>

        <div className="mt-auto">
          <Button variant={graded ? 'secondary' : 'primary'} onClick={onOpen}>
            {graded ? 'View submissions' : 'Enter grades'}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

function AssignmentDetail({
  assignment,
  onBack,
}: {
  assignment: Assignment
  onBack: () => void
}) {
  const [scores, setScores] = useState<Record<string, number>>({})
  const toast = useToast()
  const rows = useMemo(() => submissionsOf(assignment.id), [assignment.id])
  const skill = skillById(assignment.skillId)

  async function commit(submission: Submission, next: number) {
    setScores((prev) => ({ ...prev, [submission.studentId]: next }))
    await delay()
    toast(`${skill.name} for ${studentById(submission.studentId).name} set to ${next}.`)
  }

  const columns: Column<Submission>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (row) => {
        const student = studentById(row.studentId)
        return (
          <span className="flex items-center gap-3">
            <Avatar name={student.name} size="md" />
            <span className="truncate font-medium text-primary">{student.name}</span>
          </span>
        )
      },
    },
    {
      key: 'state',
      header: 'Submission',
      width: 'w-52',
      cell: (row) => <StatusBadge tone={STATE_TONE[row.state]}>{STATE_LABEL[row.state]}</StatusBadge>,
    },
    {
      key: 'score',
      header: skill.name,
      width: 'w-64',
      cell: (row) => {
        if (row.state === 'missing') {
          return <span className="text-caption text-disabled">nothing submitted to grade</span>
        }
        const value = scores[row.studentId] ?? row.score ?? 0
        return (
          <GradeCell
            value={value}
            label={`${skill.name} for ${studentById(row.studentId).name}`}
            onCommit={(next) => commit(row, next)}
          />
        )
      },
    },
  ]

  return (
    <>
      <PageHeader
        title={assignment.title}
        subtitle={`${skill.name} · ${turmaById(assignment.turmaId).name} · due ${shortDate(assignment.due)}`}
        crumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Assignments', to: '/assignments' },
          { label: assignment.title },
        ]}
        actions={
          <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={onBack}>
            Back to assignments
          </Button>
        }
      />
      <Card>
        <CardHeader
          title="Submissions"
          meta={
            <span className="text-caption text-muted">
              {assignment.submitted} of {assignment.total} submitted
            </span>
          }
        />
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.studentId}
          caption={`Submissions for ${assignment.title} per student`}
          empty={
            <EmptyState
              icon={<ClipboardList size={40} />}
              title="No submissions yet"
              description="No student has submitted this assignment yet."
            />
          }
        />
      </Card>
    </>
  )
}
