import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { Select } from '@/components/Select'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/EmptyState'
import { DataTable, TableFooter, type Column, type SortDirection } from '@/components/DataTable'
import { GradeCell } from '@/features/grades/GradeCell'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/cn'
import { grade as fmtGrade } from '@/lib/format'
import { gradeLevel, levelStyle } from '@/lib/grade'
import { delay } from '@/mocks/delay'
import {
  SCHOOL,
  SKILLS,
  STUDENTS,
  TERM,
  TURMAS,
  skillById,
  turmaById,
  turmaLabel,
  type Student,
} from '@/mocks/data'

/* A tela de notas do CIL.
 *
 * Dois modos, resolvidos pelo filtro de habilidade:
 *  · uma habilidade  → uma coluna de nota editável com a barra, como o mockup
 *                      de referência;
 *  · todas           → as cinco habilidades em colunas compactas mais a média.
 *
 * A média é sempre derivada das habilidades, nunca digitada. */

const ALL = 'all'

type SortKey = 'name' | 'enrollment' | 'turma' | 'average' | string

export function Notas() {
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [turma, setTurma] = useState(params.get('turma') ?? ALL)
  const [skill, setSkill] = useState(ALL)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(12)
  const [overrides, setOverrides] = useState<Record<string, number>>({})
  const toast = useToast()

  useEffect(() => {
    let alive = true
    delay().then(() => {
      if (alive) setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  // O filtro de turma vive na URL: o painel manda o professor direto para a
  // turma que ele estava olhando.
  useEffect(() => {
    const next = new URLSearchParams(params)
    if (turma === ALL) next.delete('turma')
    else next.set('turma', turma)
    setParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turma])

  function scoreOf(student: Student, skillId: string): number {
    return overrides[`${student.id}:${skillId}`] ?? student.bySkill[skillId]
  }

  function averageOf(student: Student): number {
    const sum = SKILLS.reduce((acc, s) => acc + scoreOf(student, s.id), 0)
    return Math.round((sum / SKILLS.length) * 10) / 10
  }

  const rows = useMemo(() => {
    const filtered = STUDENTS.filter((s) => turma === ALL || s.turmaId === turma)
    const direction = sortDirection === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name, 'pt-BR') * direction
      if (sortKey === 'enrollment') return a.enrollment.localeCompare(b.enrollment) * direction
      if (sortKey === 'turma') return a.turmaId.localeCompare(b.turmaId) * direction
      if (sortKey === 'average') return (averageOf(a) - averageOf(b)) * direction
      return (scoreOf(a, sortKey) - scoreOf(b, sortKey)) * direction
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turma, sortKey, sortDirection, overrides])

  const pageCount = Math.max(1, Math.ceil(rows.length / perPage))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * perPage
  const visible = rows.slice(start, start + perPage)

  function sort(key: string) {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDirection('asc')
  }

  async function commit(student: Student, skillId: string, next: number) {
    const key = `${student.id}:${skillId}`
    const previous = scoreOf(student, skillId)
    setOverrides((prev) => ({ ...prev, [key]: next })) // otimista
    await delay()
    toast(
      `${skillById(skillId).name} de ${student.name}: ${fmtGrade(previous)} → ${fmtGrade(next)}.`,
    )
  }

  const identityColumns: Column<Student>[] = [
    {
      key: 'name',
      header: 'Nome',
      sortable: true,
      cell: (student) => (
        <span className="flex items-center gap-3">
          <Avatar name={student.name} size="md" />
          <span className="truncate font-medium text-primary">{student.name}</span>
        </span>
      ),
    },
    {
      key: 'enrollment',
      header: 'Matrícula',
      sortable: true,
      width: 'w-28',
      cell: (student) => <span className="text-secondary">{student.enrollment}</span>,
    },
    {
      key: 'turma',
      header: 'Turma',
      sortable: true,
      width: 'w-24',
      cell: (student) => <span className="text-secondary">{turmaById(student.turmaId).name}</span>,
    },
  ]

  const columns: Column<Student>[] =
    skill === ALL
      ? [
          ...identityColumns,
          ...SKILLS.map<Column<Student>>((s) => ({
            key: s.id,
            header: s.short,
            sortable: true,
            align: 'right',
            width: 'w-[4.5rem]',
            cell: (student) => (
              <GradeCell
                compact
                value={scoreOf(student, s.id)}
                label={`${s.name} de ${student.name}`}
                onCommit={(next) => commit(student, s.id, next)}
              />
            ),
          })),
          {
            /* Sem barra aqui: com as cinco habilidades na frente, a barra da
             * média não cabia e era cortada na borda do cartão. Número mais
             * pílula da faixa entregam a mesma leitura no espaço que existe. */
            key: 'average',
            header: 'Média',
            sortable: true,
            align: 'right',
            width: 'w-36',
            cell: (student) => <AverageBadge value={averageOf(student)} name={student.name} />,
          },
        ]
      : [
          ...identityColumns,
          {
            key: skill,
            header: skillById(skill).name,
            sortable: true,
            cell: (student) => (
              <GradeCell
                value={scoreOf(student, skill)}
                label={`${skillById(skill).name} de ${student.name}`}
                onCommit={(next) => commit(student, skill, next)}
              />
            ),
          },
          {
            key: 'average',
            header: 'Média',
            sortable: true,
            width: 'w-28',
            align: 'right',
            cell: (student) => (
              <span className="font-medium text-primary">{fmtGrade(averageOf(student))}</span>
            ),
          },
        ]

  return (
    <>
      <PageHeader
        title="Notas"
        subtitle={`${SCHOOL.course} · ${TERM.label}`}
        crumbs={[{ label: 'Painel', to: '/painel' }, { label: 'Notas' }]}
      />

      <Card>
        <CardHeader
          title={turma === ALL ? 'Todas as turmas' : turmaLabel(turmaById(turma))}
          meta={
            <span className="text-caption text-muted">
              {rows.length} alunos · {TERM.short}
            </span>
          }
          actions={
            <div className="flex flex-wrap gap-2">
              <Select
                label="Filtrar por turma"
                value={turma}
                onChange={(next) => {
                  setTurma(next)
                  setPage(1)
                }}
                options={[
                  { value: ALL, label: 'Todas as turmas' },
                  ...TURMAS.map((t) => ({ value: t.id, label: `${t.name} · ${t.stage}` })),
                ]}
              />
              <Select
                label="Filtrar por habilidade"
                value={skill}
                onChange={(next) => setSkill(next)}
                options={[
                  { value: ALL, label: 'Todas as habilidades' },
                  ...SKILLS.map((s) => ({ value: s.id, label: s.name })),
                ]}
              />
              <Select
                label="Ordenar a lista"
                prefix="Ordenar:"
                value={`${sortKey}:${sortDirection}`}
                onChange={(next) => {
                  const [key, direction] = next.split(':')
                  setSortKey(key)
                  setSortDirection(direction as SortDirection)
                }}
                options={[
                  { value: 'name:asc', label: 'A a Z' },
                  { value: 'name:desc', label: 'Z a A' },
                  { value: 'average:desc', label: 'Maior média' },
                  { value: 'average:asc', label: 'Menor média' },
                ]}
              />
            </div>
          }
        />

        <DataTable
          columns={columns}
          rows={visible}
          rowKey={(student) => student.id}
          caption={`Notas de ${SCHOOL.course} por aluno, ${TERM.label}`}
          state={loading ? 'loading' : 'ready'}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={sort}
          empty={
            <EmptyState
              icon={<SearchX size={40} />}
              title="Nenhum aluno nesta turma"
              description="Nenhum aluno matriculado corresponde ao filtro. Troque a turma para ver o restante do bimestre."
            />
          }
        />

        {!loading && rows.length > 0 && (
          <TableFooter
            from={start + 1}
            to={Math.min(start + perPage, rows.length)}
            total={rows.length}
            perPage={
              <Select
                label="Resultados por página"
                className="w-20"
                value={String(perPage)}
                onChange={(next) => {
                  setPerPage(Number(next))
                  setPage(1)
                }}
                options={[12, 24, 48].map((n) => ({ value: String(n), label: String(n) }))}
              />
            }
          >
            <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
          </TableFooter>
        )}
      </Card>
    </>
  )
}

function AverageBadge({ value, name }: { value: number; name: string }) {
  const style = levelStyle(gradeLevel(value))
  return (
    <span
      className="inline-flex items-center gap-2"
      title={`Média de ${name}: ${fmtGrade(value)}, ${style.label.toLowerCase()}`}
    >
      <span className="font-medium text-primary tabular-nums">{fmtGrade(value)}</span>
      <span className={cn('size-2.5 rounded-full', style.fill)} aria-hidden="true" />
      <span className="sr-only">{style.label}</span>
    </span>
  )
}
