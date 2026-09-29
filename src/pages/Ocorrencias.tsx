import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Plus, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { Modal } from '@/components/Modal'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { Field, NativeSelect, TextArea, TextInput } from '@/components/Field'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/cn'
import { shortDate } from '@/lib/format'
import { delay } from '@/mocks/delay'
import {
  INCIDENTS,
  STUDENTS,
  TERM,
  TURMAS,
  studentById,
  turmaById,
  type Incident,
  type Severity,
} from '@/mocks/data'

const ALL = 'all'

const SEVERITY_LABEL: Record<Severity, string> = {
  light: 'Leve',
  medium: 'Média',
  serious: 'Grave',
}

const SEVERITY_TONE: Record<Severity, 'neutral' | 'warning' | 'error'> = {
  light: 'neutral',
  medium: 'warning',
  serious: 'error',
}

export function Ocorrencias() {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<Incident[]>(INCIDENTS)
  const [turma, setTurma] = useState(ALL)
  const [severity, setSeverity] = useState(ALL)
  const [open, setOpen] = useState<string | null>(null)
  const [composing, setComposing] = useState(false)

  useEffect(() => {
    let alive = true
    delay().then(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const rows = useMemo(
    () =>
      list
        .filter((incident) => {
          if (severity !== ALL && incident.severity !== severity) return false
          if (turma !== ALL && studentById(incident.studentId).turmaId !== turma) return false
          return true
        })
        .sort((a, b) => b.date.localeCompare(a.date)),
    [list, turma, severity],
  )

  const pending = rows.filter((r) => !r.handled).length

  return (
    <>
      <PageHeader
        title="Ocorrências"
        subtitle={`${TERM.label} · registro do que precisa de acompanhamento`}
        crumbs={[{ label: 'Painel', to: '/painel' }, { label: 'Ocorrências' }]}
      />

      <Card>
        <CardHeader
          title={turma === ALL ? 'Todas as turmas' : turmaById(turma).name}
          meta={
            <span className="text-caption text-muted">
              {rows.length} registros · {pending} sem providência
            </span>
          }
          actions={
            <div className="flex flex-wrap gap-2">
              <Select
                label="Filtrar por turma"
                value={turma}
                onChange={setTurma}
                options={[
                  { value: ALL, label: 'Todas as turmas' },
                  ...TURMAS.map((t) => ({ value: t.id, label: `${t.name} · ${t.stage}` })),
                ]}
              />
              <Select
                label="Filtrar por gravidade"
                value={severity}
                onChange={setSeverity}
                options={[
                  { value: ALL, label: 'Todas as gravidades' },
                  { value: 'serious', label: 'Grave' },
                  { value: 'medium', label: 'Média' },
                  { value: 'light', label: 'Leve' },
                ]}
              />
              <Button variant="primary" icon={<Plus size={16} />} onClick={() => setComposing(true)}>
                Nova ocorrência
              </Button>
            </div>
          }
        />

        {loading ? (
          <div className="flex flex-col gap-3 p-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-16 rounded-lg" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck size={40} />}
            title="Nenhuma ocorrência nestes filtros"
            description="Nada foi registrado para a turma e a gravidade escolhidas neste bimestre."
          />
        ) : (
          <ul className="divide-y divide-default">
            {rows.map((incident) => {
              const student = studentById(incident.studentId)
              const expanded = open === incident.id
              return (
                <li key={incident.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : incident.id)}
                    aria-expanded={expanded}
                    className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-surface-alt"
                  >
                    <span className="w-16 shrink-0 text-caption text-muted">
                      {shortDate(incident.date)}
                    </span>
                    <Avatar name={student.name} size="md" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-medium text-primary">
                        {incident.kind}
                      </span>
                      <span className="block truncate text-caption text-muted">
                        {student.name} · {turmaById(student.turmaId).name}
                      </span>
                    </span>
                    <StatusBadge tone={SEVERITY_TONE[incident.severity]}>
                      {SEVERITY_LABEL[incident.severity]}
                    </StatusBadge>
                    <StatusBadge tone={incident.handled ? 'success' : 'warning'}>
                      {incident.handled ? 'Providência tomada' : 'Sem providência'}
                    </StatusBadge>
                    <ChevronDown
                      size={16}
                      className={cn(
                        'shrink-0 text-muted transition-transform duration-150 ease-expo',
                        expanded && 'rotate-180',
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  {expanded && (
                    <div className="bg-surface-alt px-6 pt-1 pb-5 pl-26">
                      <p className="max-w-[65ch] text-body text-secondary">{incident.note}</p>
                      {!incident.handled && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="mt-3"
                          onClick={() =>
                            setList((prev) =>
                              prev.map((i) =>
                                i.id === incident.id ? { ...i, handled: true } : i,
                              ),
                            )
                          }
                        >
                          Marcar providência tomada
                        </Button>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <NewIncident
        open={composing}
        onClose={() => setComposing(false)}
        onCreate={(incident) => setList((prev) => [incident, ...prev])}
      />
    </>
  )
}

function NewIncident({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (incident: Incident) => void
}) {
  const [studentId, setStudentId] = useState(STUDENTS[0].id)
  const [kind, setKind] = useState('')
  const [severity, setSeverity] = useState<Severity>('light')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  async function save() {
    if (kind.trim() === '') {
      setError('Descreva o tipo da ocorrência em poucas palavras.')
      return
    }
    setSaving(true)
    await delay()
    onCreate({
      id: `oc-${Date.now()}`,
      studentId,
      date: new Date().toISOString().slice(0, 10),
      kind: kind.trim(),
      severity,
      note: note.trim() || 'Sem descrição adicional.',
      handled: false,
    })
    setSaving(false)
    toast(`Ocorrência registrada para ${studentById(studentId).name}.`)
    setKind('')
    setNote('')
    setError(null)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova ocorrência"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" loading={saving} onClick={save}>
            Registrar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Field label="Aluno" required>
          {(props) => (
            <NativeSelect
              {...props}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              {STUDENTS.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} · {turmaById(student.turmaId).name}
                </option>
              ))}
            </NativeSelect>
          )}
        </Field>

        <Field label="Tipo" required error={error ?? undefined} hint="Ex.: atrasos recorrentes">
          {(props) => (
            <TextInput
              {...props}
              data-autofocus
              value={kind}
              onChange={(e) => {
                setKind(e.target.value)
                setError(null)
              }}
            />
          )}
        </Field>

        <Field label="Gravidade" required>
          {(props) => (
            <NativeSelect
              {...props}
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity)}
            >
              <option value="light">Leve</option>
              <option value="medium">Média</option>
              <option value="serious">Grave</option>
            </NativeSelect>
          )}
        </Field>

        <Field label="Descrição e providências">
          {(props) => (
            <TextArea {...props} value={note} onChange={(e) => setNote(e.target.value)} />
          )}
        </Field>
      </div>
    </Modal>
  )
}
