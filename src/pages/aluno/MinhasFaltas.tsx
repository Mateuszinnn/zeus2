import { CalendarCheck } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { GradeBar } from '@/components/GradeBar'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { percent as fmtPercent, plural, shortDate, weekday } from '@/lib/format'
import { MIN_ATTENDANCE } from '@/lib/grade'
import { DEMO_STUDENT_ID, TERM, studentById, turmaLabel, turmaOf } from '@/mocks/data'
import { SESSIONS, absencesOf } from '@/mocks/records'

export function MinhasFaltas() {
  const student = studentById(DEMO_STUDENT_ID)
  const absences = absencesOf(student.id)
  const justified = absences.filter((a) => a.kind === 'justified').length
  const remaining = Math.max(0, Math.floor(SESSIONS.length * (1 - MIN_ATTENDANCE / 100)) - absences.length)

  return (
    <>
      <PageHeader
        title="Minhas faltas"
        subtitle={`${TERM.label} · ${turmaLabel(turmaOf(student))}`}
        crumbs={[{ label: 'Meu painel', to: '/meu-painel' }, { label: 'Minhas faltas' }]}
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader
            title="Minha frequência"
            meta={
              <StatusBadge tone={student.attendance >= MIN_ATTENDANCE ? 'success' : 'error'}>
                {student.attendance >= MIN_ATTENDANCE
                  ? 'Dentro do mínimo'
                  : `Abaixo de ${MIN_ATTENDANCE}%`}
              </StatusBadge>
            }
          />
          <CardBody className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
              <div>
                <p className="text-caption text-muted">Presença no bimestre</p>
                <p className="mt-0.5 text-display text-primary">
                  {fmtPercent(student.attendance)}
                </p>
              </div>
              <div>
                <p className="text-caption text-muted">Aulas dadas</p>
                <p className="mt-0.5 text-h2 text-secondary">{SESSIONS.length}</p>
              </div>
              <div>
                <p className="text-caption text-muted">Faltas</p>
                <p className="mt-0.5 text-h2 text-secondary">{absences.length}</p>
              </div>
            </div>

            <GradeBar
              value={student.attendance}
              kind="attendance"
              label="Minha frequência no bimestre"
              className="w-full"
            />

            <p className="max-w-[65ch] text-body text-secondary">
              A frequência mínima do CIL é {MIN_ATTENDANCE}%.{' '}
              {remaining > 0
                ? `Você ainda pode faltar ${plural(remaining, 'aula', 'aulas')} neste bimestre sem ficar abaixo do mínimo.`
                : 'Você já atingiu o limite de faltas do bimestre — qualquer ausência a mais te coloca abaixo do mínimo.'}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Aulas que perdi"
            meta={
              absences.length > 0 ? (
                <span className="text-caption text-muted">{justified} justificadas</span>
              ) : undefined
            }
          />
          {absences.length === 0 ? (
            <EmptyState
              icon={<CalendarCheck size={40} />}
              title="Nenhuma falta no bimestre"
              description="Você esteve presente em todas as aulas desde o início do semestre."
            />
          ) : (
            <ul className="divide-y divide-default">
              {absences.map((absence) => (
                <li
                  key={absence.date}
                  className="flex flex-wrap items-center gap-4 px-6 py-4"
                >
                  <span className="w-20 shrink-0 text-body font-medium text-primary">
                    {shortDate(absence.date)}
                  </span>
                  <span className="flex-1 text-body text-secondary">
                    {weekday(absence.date)}
                  </span>
                  <StatusBadge tone={absence.kind === 'justified' ? 'info' : 'warning'}>
                    {absence.kind === 'justified' ? 'Justificada' : 'Não justificada'}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}
