import { useMemo } from 'react'
import { Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader } from '@/components/Card'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { shortDate } from '@/lib/format'
import { DEMO_STUDENT_ID, INCIDENTS, TERM, studentById, type Severity } from '@/mocks/data'

const LABEL: Record<Severity, string> = { light: 'Leve', medium: 'Média', serious: 'Grave' }
const TONE: Record<Severity, 'neutral' | 'warning' | 'error'> = {
  light: 'neutral',
  medium: 'warning',
  serious: 'error',
}

export function MinhasOcorrencias() {
  const student = studentById(DEMO_STUDENT_ID)
  const mine = useMemo(
    () =>
      INCIDENTS.filter((i) => i.studentId === student.id).sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    [student.id],
  )

  return (
    <>
      <PageHeader
        title="Minhas ocorrências"
        subtitle={`${TERM.label} · registros feitos pela escola`}
        crumbs={[{ label: 'Meu painel', to: '/meu-painel' }, { label: 'Minhas ocorrências' }]}
      />

      <Card>
        <CardHeader
          title="Histórico"
          meta={
            mine.length > 0 ? (
              <span className="text-caption text-muted">{mine.length} registros</span>
            ) : undefined
          }
        />
        {mine.length === 0 ? (
          <EmptyState
            icon={<Sparkles size={40} />}
            title="Nenhuma ocorrência registrada"
            description="Nada foi anotado no seu nome neste bimestre. Continue assim."
          />
        ) : (
          <ul className="divide-y divide-default">
            {mine.map((incident) => (
              <li key={incident.id} className="px-6 py-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-body font-medium text-primary">{incident.kind}</h3>
                  <StatusBadge tone={TONE[incident.severity]}>
                    {LABEL[incident.severity]}
                  </StatusBadge>
                  {incident.handled && <StatusBadge tone="success">Resolvida</StatusBadge>}
                </div>
                <p className="mt-2 max-w-[65ch] text-body text-secondary">{incident.note}</p>
                <p className="mt-2 text-caption text-muted">{shortDate(incident.date)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
