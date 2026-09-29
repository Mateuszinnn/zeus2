import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarX, SearchX } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { Select } from '@/components/Select'
import { Tabs, TabPanel } from '@/components/Tabs'
import { GradeBar } from '@/components/GradeBar'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { DataTable, type Column, type SortDirection } from '@/components/DataTable'
import { RollCallPanel } from '@/features/dashboard/RollCallPanel'
import { Button } from '@/components/Button'
import { shortDate, weekday } from '@/lib/format'
import { MIN_ATTENDANCE } from '@/lib/grade'
import { delay } from '@/mocks/delay'
import { STUDENTS, TERM, TODAY, TURMAS, turmaById, turmaLabel } from '@/mocks/data'
import { SESSIONS, attendanceSummary, type AttendanceSummary } from '@/mocks/records'

/* Duas modalidades: fazer a chamada de hoje, e olhar o histórico do bimestre.
 * A chamada reaproveita o mesmo painel do dashboard — é o mesmo objeto. */

export function Faltas() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState<'chamada' | 'historico'>('chamada')
  const [turmaId, setTurmaId] = useState(params.get('class') ?? TURMAS[0].id)
  const [done, setDone] = useState<Record<string, boolean>>({ t4b: true })
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  useEffect(() => {
    let alive = true
    delay().then(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const rows = useMemo(() => {
    const summaries = attendanceSummary(STUDENTS.filter((s) => s.turmaId === turmaId))
    const direction = sortDirection === 'asc' ? 1 : -1
    return [...summaries].sort((a, b) => {
      if (sortKey === 'absences') return (a.absences - b.absences) * direction
      if (sortKey === 'percent') return (a.percent - b.percent) * direction
      return a.student.name.localeCompare(b.student.name, 'pt-BR') * direction
    })
  }, [turmaId, sortKey, sortDirection])

  const atRisk = rows.filter((r) => r.percent < MIN_ATTENDANCE).length
  const turma = turmaById(turmaId)

  const columns: Column<AttendanceSummary>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      cell: ({ student }) => (
        <span className="flex items-center gap-3">
          <Avatar name={student.name} size="md" />
          <span className="truncate font-medium text-primary">{student.name}</span>
        </span>
      ),
    },
    {
      key: 'presences',
      header: 'Present',
      width: 'w-32',
      align: 'right',
      cell: (row) => (
        <span className="text-secondary">
          {row.present} de {row.total}
        </span>
      ),
    },
    {
      key: 'absences',
      header: 'Absences',
      sortable: true,
      width: 'w-28',
      align: 'right',
      cell: (row) => <span className="font-medium text-primary">{row.absences}</span>,
    },
    {
      key: 'justified',
      header: 'Excuseds',
      width: 'w-36',
      cell: (row) =>
        row.justified > 0 ? (
          <StatusBadge tone="info">{row.justified} justificada(s)</StatusBadge>
        ) : (
          <span className="text-caption text-disabled">none</span>
        ),
    },
    {
      key: 'percent',
      header: 'Attendance',
      sortable: true,
      width: 'w-56',
      cell: (row) => (
        <GradeBar
          value={row.percent}
          kind="attendance"
          label={`Attendance for ${row.student.name}`}
        />
      ),
    },
  ]

  function sort(key: string) {
    if (key === sortKey) setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <>
      <PageHeader
        title="Absences"
        subtitle={`${TERM.label} · ${SESSIONS.length} classes held · minimum attendance ${MIN_ATTENDANCE}%`}
        crumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Absences' }]}
        actions={
          <Select
            label="Choose class"
            value={turmaId}
            onChange={setTurmaId}
            options={TURMAS.map((t) => ({ value: t.id, label: `${t.name} · ${t.stage}` }))}
          />
        }
      />

      <Tabs
        label="Attendance screen mode"
        value={tab}
        onChange={(v) => setTab(v as 'chamada' | 'historico')}
        items={[
          { id: 'chamada', label: 'Roll call for today' },
          { id: 'historico', label: 'Term history', count: atRisk || undefined },
        ]}
        className="mb-6"
      />

      <TabPanel id="chamada" active={tab === 'chamada'}>
        {done[turmaId] ? (
          <Card>
            <EmptyState
              icon={<CalendarX size={40} />}
              title={`Roll call for ${turma.name} is already done`}
              description={`Attendance for ${weekday(TODAY)}, ${shortDate(TODAY)} is already recorded. Open the history to review the whole term.`}
              action={
                <Button variant="secondary" onClick={() => setTab('historico')}>
                  View history
                </Button>
              }
            />
          </Card>
        ) : (
          <RollCallPanel
            turma={turma}
            onClose={() => setTab('historico')}
            onSaved={() => setDone((prev) => ({ ...prev, [turmaId]: true }))}
          />
        )}
      </TabPanel>

      <TabPanel id="historico" active={tab === 'historico'}>
        <Card>
          <CardHeader
            title={turmaLabel(turma)}
            meta={
              <span className="text-caption text-muted">
                {atRisk > 0
                  ? `${atRisk} abaixo de ${MIN_ATTENDANCE}%`
                  : `todos acima de ${MIN_ATTENDANCE}%`}
              </span>
            }
          />
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.student.id}
            caption={`Attendance for students in ${turma.name} this term`}
            state={loading ? 'loading' : 'ready'}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={sort}
            empty={
              <EmptyState
                icon={<SearchX size={40} />}
                title="Class with no students"
                description="No student enrolled in this class so far."
              />
            }
          />
        </Card>
      </TabPanel>
    </>
  )
}
