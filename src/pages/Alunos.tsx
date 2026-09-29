import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchX, Search } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { Select } from '@/components/Select'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { GradeBar } from '@/components/GradeBar'
import { DataTable, TableFooter, type Column, type SortDirection } from '@/components/DataTable'
import { delay } from '@/mocks/delay'
import { STUDENTS, TERM, TURMAS, turmaById, type Student } from '@/mocks/data'
import { ENROLLMENTS, STATUS_LABEL, enrollmentOf, type EnrollmentStatus } from '@/mocks/records'

const ALL = 'all'

const STATUS_TONE: Record<EnrollmentStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  locked: 'warning',
  transferred: 'neutral',
}

export function Alunos() {
  const [loading, setLoading] = useState(true)
  const [turma, setTurma] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [page, setPage] = useState(1)
  const perPage = 12

  useEffect(() => {
    let alive = true
    delay().then(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = STUDENTS.filter((student) => {
      if (turma !== ALL && student.turmaId !== turma) return false
      if (status !== ALL && enrollmentOf(student.id).status !== status) return false
      if (term && !student.name.toLowerCase().includes(term) && !student.enrollment.includes(term))
        return false
      return true
    })
    const direction = sortDirection === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      if (sortKey === 'average') return (a.average - b.average) * direction
      if (sortKey === 'attendance') return (a.attendance - b.attendance) * direction
      if (sortKey === 'enrollment') return a.enrollment.localeCompare(b.enrollment) * direction
      if (sortKey === 'turma') return a.turmaId.localeCompare(b.turmaId) * direction
      return a.name.localeCompare(b.name, 'pt-BR') * direction
    })
  }, [turma, status, query, sortKey, sortDirection])

  const pageCount = Math.max(1, Math.ceil(rows.length / perPage))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * perPage
  const visible = rows.slice(start, start + perPage)

  const columns: Column<Student>[] = [
    {
      key: 'name',
      header: 'Nome',
      sortable: true,
      cell: (student) => (
        <Link
          to={`/matriculas?aluno=${student.id}`}
          className="flex items-center gap-3 no-underline"
        >
          <Avatar name={student.name} size="md" />
          <span className="truncate font-medium text-primary">{student.name}</span>
        </Link>
      ),
    },
    {
      key: 'enrollment',
      header: 'Matrícula',
      sortable: true,
      width: 'w-32',
      cell: (s) => <span className="text-secondary">{s.enrollment}</span>,
    },
    {
      key: 'turma',
      header: 'Turma',
      sortable: true,
      width: 'w-40',
      cell: (s) => (
        <span className="whitespace-nowrap text-secondary">
          {turmaById(s.turmaId).name} · {turmaById(s.turmaId).stage}
        </span>
      ),
    },
    {
      key: 'average',
      header: 'Média',
      sortable: true,
      width: 'w-52',
      cell: (s) => <GradeBar value={s.average} label={`Média de ${s.name}`} />,
    },
    {
      key: 'attendance',
      header: 'Frequência',
      sortable: true,
      width: 'w-52',
      cell: (s) => (
        <GradeBar value={s.attendance} kind="attendance" label={`Frequência de ${s.name}`} />
      ),
    },
    {
      key: 'status',
      header: 'Matrícula',
      width: 'w-32',
      cell: (s) => {
        const enrollmentStatus = enrollmentOf(s.id).status
        return (
          <StatusBadge tone={STATUS_TONE[enrollmentStatus]}>
            {STATUS_LABEL[enrollmentStatus]}
          </StatusBadge>
        )
      },
    },
  ]

  function sort(key: string) {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDirection('asc')
  }

  return (
    <>
      <PageHeader
        title="Alunos"
        subtitle={`${ENROLLMENTS.length} matrículas · ${TERM.label}`}
        crumbs={[{ label: 'Painel', to: '/painel' }, { label: 'Alunos' }]}
      />

      <Card>
        <CardHeader
          title={turma === ALL ? 'Todas as turmas' : turmaById(turma).name}
          meta={<span className="text-caption text-muted">{rows.length} alunos</span>}
          actions={
            <div className="flex flex-wrap gap-2">
              <span className="relative inline-flex items-center">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 text-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Buscar por nome ou matrícula"
                  aria-label="Buscar aluno"
                  className="h-10 w-64 rounded-md border border-default bg-surface pr-3 pl-9 text-body text-primary placeholder:text-disabled hover:border-strong"
                />
              </span>
              <Select
                label="Filtrar por turma"
                value={turma}
                onChange={(v) => {
                  setTurma(v)
                  setPage(1)
                }}
                options={[
                  { value: ALL, label: 'Todas as turmas' },
                  ...TURMAS.map((t) => ({ value: t.id, label: `${t.name} · ${t.stage}` })),
                ]}
              />
              <Select
                label="Filtrar por situação da matrícula"
                value={status}
                onChange={(v) => {
                  setStatus(v)
                  setPage(1)
                }}
                options={[
                  { value: ALL, label: 'Todas as situações' },
                  { value: 'active', label: 'Ativa' },
                  { value: 'locked', label: 'Trancada' },
                  { value: 'transferred', label: 'Transferida' },
                ]}
              />
            </div>
          }
        />

        <DataTable
          columns={columns}
          rows={visible}
          rowKey={(s) => s.id}
          caption="Alunos matriculados, com média, frequência e situação"
          state={loading ? 'loading' : 'ready'}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={sort}
          empty={
            <EmptyState
              icon={<SearchX size={40} />}
              title="Nenhum aluno encontrado"
              description={
                query
                  ? `Nada corresponde a "${query}". Confira a grafia ou limpe a busca.`
                  : 'Nenhum aluno corresponde aos filtros escolhidos. Volte para todas as turmas e situações.'
              }
            />
          }
        />

        {!loading && rows.length > 0 && (
          <TableFooter
            from={start + 1}
            to={Math.min(start + perPage, rows.length)}
            total={rows.length}
            perPage={<span className="text-caption">{perPage}</span>}
          >
            <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
          </TableFooter>
        )}
      </Card>
    </>
  )
}
