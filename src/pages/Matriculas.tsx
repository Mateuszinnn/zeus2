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
import { dateWithYear } from '@/lib/format'
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
  const selected = params.get('student')

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
          next.delete('student')
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
      header: 'Student ID',
      width: 'w-32',
      cell: (s) => <span className="font-medium text-primary">{s.enrollment}</span>,
    },
    {
      key: 'name',
      header: 'Name',
      cell: (s) => (
        <span className="flex items-center gap-3">
          <Avatar name={s.name} size="md" />
          <span className="truncate text-primary">{s.name}</span>
        </span>
      ),
    },
    {
      key: 'turma',
      header: 'Class',
      width: 'w-40',
      cell: (s) => (
        <span className="whitespace-nowrap text-secondary">
          {turmaById(s.turmaId).name} · {turmaById(s.turmaId).stage}
        </span>
      ),
    },
    {
      key: 'guardian',
      header: 'Guardian',
      cell: (s) => <span className="truncate text-secondary">{enrollmentOf(s.id).guardian}</span>,
    },
    {
      key: 'origin',
      header: 'Home school',
      cell: (s) => (
        <span className="truncate text-secondary">{enrollmentOf(s.id).originSchool}</span>
      ),
    },
    {
      key: 'since',
      header: 'Since',
      width: 'w-36',
      cell: (s) => (
        <span className="whitespace-nowrap text-secondary">
          {dateWithYear(enrollmentOf(s.id).since)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
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
        title="Enrollments"
        subtitle={`${ENROLLMENTS.length} records · ${TERM.label}`}
        crumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Enrollments' }]}
      />

      <Card>
        <CardHeader
          title={turma === ALL ? 'All classes' : turmaById(turma).name}
          meta={<span className="text-caption text-muted">{rows.length} records</span>}
          actions={
            <div className="flex flex-wrap gap-2">
              <Select
                label="Filter by class"
                value={turma}
                onChange={(v) => {
                  setTurma(v)
                  setPage(1)
                }}
                options={[
                  { value: ALL, label: 'All classes' },
                  ...TURMAS.map((t) => ({ value: t.id, label: `${t.name} · ${t.stage}` })),
                ]}
              />
              <Select
                label="Filter by status"
                value={status}
                onChange={(v) => {
                  setStatus(v)
                  setPage(1)
                }}
                options={[
                  { value: ALL, label: 'All statuses' },
                  { value: 'active', label: 'Active' },
                  { value: 'locked', label: 'On hold' },
                  { value: 'transferred', label: 'Transferred' },
                ]}
              />
            </div>
          }
        />

        <DataTable
          columns={columns}
          rows={visible}
          rowKey={(s) => s.id}
          caption="Enrollment records for the semester"
          state={loading ? 'loading' : 'ready'}
          empty={
            <EmptyState
              icon={<SearchX size={40} />}
              title="No records under these filters"
              description="No enrollment matches the chosen class and status."
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

/* The record itself. Short sections, label always above the control. */
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
        subtitle={`ID ${student.enrollment} · ${turmaById(student.turmaId).name} · ${turmaById(student.turmaId).stage}`}
        crumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Enrollments', to: '/enrollments' },
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
            title="Student details"
            meta={
              <StatusBadge tone={TONE[draft.status]}>{STATUS_LABEL[draft.status]}</StatusBadge>
            }
          />
          <CardBody className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Full name" required>
              {(props) => <TextInput {...props} defaultValue={student.name} />}
            </Field>
            <Field label="Student ID">
              {(props) => <TextInput {...props} defaultValue={student.enrollment} readOnly />}
            </Field>
            <Field label="Date of birth" required>
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
            <Field label="City" hint="District of residence">
              {(props) => (
                <TextInput
                  {...props}
                  value={draft.neighborhood}
                  onChange={(e) => set('neighborhood', e.target.value)}
                />
              )}
            </Field>
            <Field label="Enrollment status" required>
              {(props) => (
                <NativeSelect
                  {...props}
                  value={draft.status}
                  onChange={(e) => set('status', e.target.value as EnrollmentStatus)}
                >
                  <option value="active">Active</option>
                  <option value="locked">On hold</option>
                  <option value="transferred">Transferred</option>
                </NativeSelect>
              )}
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Guardian" />
          <CardBody className="grid gap-5 sm:grid-cols-2">
            <Field label="Guardian name" required>
              {(props) => (
                <TextInput
                  {...props}
                  value={draft.guardian}
                  onChange={(e) => set('guardian', e.target.value)}
                />
              )}
            </Field>
            <Field label="Phone" required>
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
            title="Home school"
            meta={
              <span className="text-caption text-muted">
                the CIL runs opposite the regular school, so this is required
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
            <Field label="Shift at home school" required>
              {(props) => (
                <NativeSelect
                  {...props}
                  value={draft.shiftAtOrigin}
                  onChange={(e) => set('shiftAtOrigin', e.target.value)}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </NativeSelect>
              )}
            </Field>
            <Field label="At the CIL since">
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
