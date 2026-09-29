import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { Pagination } from '@/components/Pagination'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { Field, NativeSelect, TextInput } from '@/components/Field'
import { DataTable, TableFooter, type Column } from '@/components/DataTable'
import { useToast } from '@/components/Toast'
import { shortDate } from '@/lib/format'
import { delay } from '@/mocks/delay'
import { STUDENTS, TERM, TURMAS, studentById, turmaById, type Student } from '@/mocks/data'
import {
  ENROLLMENTS,
  STATUS_LABEL,
  enrollmentOf,
  type Enrollment,
  type EnrollmentStatus,
} from '@/mocks/records'

const ALL = 'all'

const TONE: Record<EnrollmentStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  locked: 'warning',
  transferred: 'neutral',
}

export function Matriculas() {
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [turma, setTurma] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const [page, setPage] = useState(1)
  const perPage = 12
  const selected = params.get('aluno')

  useEffect(() => {
    let alive = true
    delay().then(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const rows = useMemo(
    () =>
      STUDENTS.filter((student) => {
        if (turma !== ALL && student.turmaId !== turma) return false
        if (status !== ALL && enrollmentOf(student.id).status !== status) return false
        return true
      }).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
    [turma, status],
  )

  if (selected) {
    return (
      <Ficha
        student={studentById(selected)}
        onBack={() => {
          const next = new URLSearchParams(params)
          next.delete('aluno')
          setParams(next)
        }}
      />
    )
  }

  const pageCount = Math.max(1, Math.ceil(rows.length / perPage))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * perPage
  const visible = rows.slice(start, start + perPage)

  const columns: Column<Student>[] = [
    {
      key: 'enrollment',
      header: 'Matrícula',
      width: 'w-32',
      cell: (s) => <span className="font-medium text-primary">{s.enrollment}</span>,
    },
    {
      key: 'name',
      header: 'Nome',
      cell: (s) => (
        <span className="flex items-center gap-3">
          <Avatar name={s.name} size="md" />
          <span className="truncate text-primary">{s.name}</span>
        </span>
      ),
    },
    {
      key: 'turma',
      header: 'Turma',
      width: 'w-36',
      cell: (s) => (
        <span className="text-secondary">
          {turmaById(s.turmaId).name} · {turmaById(s.turmaId).stage}
        </span>
      ),
    },
    {
      key: 'guardian',
      header: 'Responsável',
      cell: (s) => <span className="truncate text-secondary">{enrollmentOf(s.id).guardian}</span>,
    },
    {
      key: 'origin',
      header: 'Escola de origem',
      cell: (s) => (
        <span className="truncate text-secondary">{enrollmentOf(s.id).originSchool}</span>
      ),
    },
    {
      key: 'since',
      header: 'Desde',
      width: 'w-28',
      cell: (s) => <span className="text-secondary">{shortDate(enrollmentOf(s.id).since)}</span>,
    },
    {
      key: 'status',
      header: 'Situação',
      width: 'w-32',
      cell: (s) => {
        const value = enrollmentOf(s.id).status
        return <StatusBadge tone={TONE[value]}>{STATUS_LABEL[value]}</StatusBadge>
      },
    },
  ]

  return (
    <>
      <PageHeader
        title="Matrículas"
        subtitle={`${ENROLLMENTS.length} fichas · ${TERM.label}`}
        crumbs={[{ label: 'Painel', to: '/painel' }, { label: 'Matrículas' }]}
      />

      <Card>
        <CardHeader
          title={turma === ALL ? 'Todas as turmas' : turmaById(turma).name}
          meta={<span className="text-caption text-muted">{rows.length} fichas</span>}
          actions={
            <div className="flex flex-wrap gap-2">
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
                label="Filtrar por situação"
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
          caption="Fichas de matrícula do semestre"
          state={loading ? 'loading' : 'ready'}
          empty={
            <EmptyState
              icon={<SearchX size={40} />}
              title="Nenhuma ficha nestes filtros"
              description="Nenhuma matrícula corresponde à turma e à situação escolhidas."
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

/* A ficha em si. Seções curtas, rótulo sempre acima do campo. */
function Ficha({ student, onBack }: { student: Student; onBack: () => void }) {
  const base = enrollmentOf(student.id)
  const [draft, setDraft] = useState<Enrollment>(base)
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const dirty = JSON.stringify(draft) !== JSON.stringify(base)

  function set<K extends keyof Enrollment>(key: K, value: Enrollment[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  async function save() {
    setSaving(true)
    await delay()
    setSaving(false)
    toast(`Ficha de ${student.name} salva.`)
  }

  return (
    <>
      <PageHeader
        title={student.name}
        subtitle={`Matrícula ${student.enrollment} · ${turmaById(student.turmaId).name} · ${turmaById(student.turmaId).stage}`}
        crumbs={[
          { label: 'Painel', to: '/painel' },
          { label: 'Matrículas', to: '/matriculas' },
          { label: student.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={onBack}>
              Voltar
            </Button>
            <Button variant="primary" loading={saving} disabled={!dirty} onClick={save}>
              Salvar ficha
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader
            title="Dados do aluno"
            meta={
              <StatusBadge tone={TONE[draft.status]}>{STATUS_LABEL[draft.status]}</StatusBadge>
            }
          />
          <CardBody className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Nome completo" required>
              {(props) => <TextInput {...props} defaultValue={student.name} />}
            </Field>
            <Field label="Matrícula">
              {(props) => <TextInput {...props} defaultValue={student.enrollment} readOnly />}
            </Field>
            <Field label="Data de nascimento" required>
              {(props) => (
                <TextInput
                  {...props}
                  type="date"
                  value={draft.birthDate}
                  onChange={(e) => set('birthDate', e.target.value)}
                />
              )}
            </Field>
            <Field label="E-mail">
              {(props) => (
                <TextInput
                  {...props}
                  type="email"
                  value={draft.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              )}
            </Field>
            <Field label="Cidade" hint="Região administrativa de residência">
              {(props) => (
                <TextInput
                  {...props}
                  value={draft.neighborhood}
                  onChange={(e) => set('neighborhood', e.target.value)}
                />
              )}
            </Field>
            <Field label="Situação da matrícula" required>
              {(props) => (
                <NativeSelect
                  {...props}
                  value={draft.status}
                  onChange={(e) => set('status', e.target.value as EnrollmentStatus)}
                >
                  <option value="active">Ativa</option>
                  <option value="locked">Trancada</option>
                  <option value="transferred">Transferida</option>
                </NativeSelect>
              )}
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Responsável" />
          <CardBody className="grid gap-5 sm:grid-cols-2">
            <Field label="Nome do responsável" required>
              {(props) => (
                <TextInput
                  {...props}
                  value={draft.guardian}
                  onChange={(e) => set('guardian', e.target.value)}
                />
              )}
            </Field>
            <Field label="Telefone" required>
              {(props) => (
                <TextInput
                  {...props}
                  value={draft.guardianPhone}
                  onChange={(e) => set('guardianPhone', e.target.value)}
                />
              )}
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Escola de origem"
            meta={
              <span className="text-caption text-muted">
                o CIL é contraturno, então a origem é obrigatória
              </span>
            }
          />
          <CardBody className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Escola" required>
              {(props) => (
                <TextInput
                  {...props}
                  value={draft.originSchool}
                  onChange={(e) => set('originSchool', e.target.value)}
                />
              )}
            </Field>
            <Field label="Turno na escola de origem" required>
              {(props) => (
                <NativeSelect
                  {...props}
                  value={draft.shiftAtOrigin}
                  onChange={(e) => set('shiftAtOrigin', e.target.value)}
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </NativeSelect>
              )}
            </Field>
            <Field label="Matriculado no CIL desde">
              {(props) => (
                <TextInput
                  {...props}
                  type="date"
                  value={draft.since}
                  onChange={(e) => set('since', e.target.value)}
                />
              )}
            </Field>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
