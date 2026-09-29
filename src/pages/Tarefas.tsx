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
  submitted: 'Entregue',
  late: 'Entregue com atraso',
  missing: 'Não entregue',
  graded: 'Avaliada',
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
        title="Tarefas"
        subtitle={`${TERM.label} · ${ASSIGNMENTS.length} tarefas no bimestre`}
        crumbs={[{ label: 'Painel', to: '/painel' }, { label: 'Tarefas' }]}
        actions={
          <Select
            label="Filtrar por turma"
            value={turma}
            onChange={setTurma}
            options={[
              { value: ALL, label: 'Todas as turmas' },
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
            title="Nenhuma tarefa nesta turma"
            description="Nada foi publicado para esta turma no bimestre. Troque o filtro para ver as demais."
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
            {graded ? 'Avaliada' : overdue ? `Venceu ${relativeDay(assignment.due, TODAY)}` : `Vence ${relativeDay(assignment.due, TODAY)}`}
          </StatusBadge>
          <span className="text-caption text-muted">
            {turmaById(assignment.turmaId).name} · prazo {shortDate(assignment.due)}
          </span>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-body font-medium text-primary">
              {assignment.submitted} de {assignment.total} entregues
            </span>
            <span className="text-caption text-muted">
              {assignment.total - assignment.submitted} faltando
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Entregas de ${assignment.title}`}
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
            {graded ? 'Ver entregas' : 'Lançar notas'}
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
    toast(`${skill.name} de ${studentById(submission.studentId).name} lançado: ${next}.`)
  }

  const columns: Column<Submission>[] = [
    {
      key: 'name',
      header: 'Nome',
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
      header: 'Entrega',
      width: 'w-52',
      cell: (row) => <StatusBadge tone={STATE_TONE[row.state]}>{STATE_LABEL[row.state]}</StatusBadge>,
    },
    {
      key: 'score',
      header: skill.name,
      width: 'w-64',
      cell: (row) => {
        if (row.state === 'missing') {
          return <span className="text-caption text-disabled">sem entrega para avaliar</span>
        }
        const value = scores[row.studentId] ?? row.score ?? 0
        return (
          <GradeCell
            value={value}
            label={`${skill.name} de ${studentById(row.studentId).name}`}
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
        subtitle={`${skill.name} · ${turmaById(assignment.turmaId).name} · prazo ${shortDate(assignment.due)}`}
        crumbs={[
          { label: 'Painel', to: '/painel' },
          { label: 'Tarefas', to: '/tarefas' },
          { label: assignment.title },
        ]}
        actions={
          <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={onBack}>
            Voltar às tarefas
          </Button>
        }
      />
      <Card>
        <CardHeader
          title="Entregas"
          meta={
            <span className="text-caption text-muted">
              {assignment.submitted} de {assignment.total} entregues
            </span>
          }
        />
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.studentId}
          caption={`Entregas de ${assignment.title} por aluno`}
          empty={
            <EmptyState
              icon={<ClipboardList size={40} />}
              title="Nenhuma entrega ainda"
              description="Nenhum aluno enviou esta tarefa até agora."
            />
          }
        />
      </Card>
    </>
  )
}
