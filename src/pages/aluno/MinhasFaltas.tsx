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
        title="My attendance"
        subtitle={`${TERM.label} · ${turmaLabel(turmaOf(student))}`}
        crumbs={[{ label: 'My dashboard', to: '/my-dashboard' }, { label: 'My attendance' }]}
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader
            title="My attendance"
            meta={
              <StatusBadge tone={student.attendance >= MIN_ATTENDANCE ? 'success' : 'error'}>
                {student.attendance >= MIN_ATTENDANCE
                  ? 'Within the minimum'
                  : `Abaixo de ${MIN_ATTENDANCE}%`}
              </StatusBadge>
            }
          />
          <CardBody className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
              <div>
                <p className="text-caption text-muted">Present this term</p>
                <p className="mt-0.5 text-display text-primary">
                  {fmtPercent(student.attendance)}
                </p>
              </div>
              <div>
                <p className="text-caption text-muted">Classes held</p>
                <p className="mt-0.5 text-h2 text-secondary">{SESSIONS.length}</p>
              </div>
              <div>
                <p className="text-caption text-muted">Absences</p>
                <p className="mt-0.5 text-h2 text-secondary">{absences.length}</p>
              </div>
            </div>

            <GradeBar
              value={student.attendance}
              kind="attendance"
              label="My attendance this term"
              className="w-full"
            />

            <p className="max-w-[65ch] text-body text-secondary">
              The CIL minimum attendance is {MIN_ATTENDANCE}%.{' '}
              {remaining > 0
                ? `You can still miss ${plural(remaining, 'class', 'classes')} this term without dropping below the minimum.`
                : 'You have already used up the absences allowed this term — one more puts you below the minimum.'}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Classes I missed"
            meta={
              absences.length > 0 ? (
                <span className="text-caption text-muted">{justified} justificadas</span>
              ) : undefined
            }
          />
          {absences.length === 0 ? (
            <EmptyState
              icon={<CalendarCheck size={40} />}
              title="No absences this term"
              description="You have been present at every class since the semester began."
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
                    {absence.kind === 'justified' ? 'Excused' : 'Unexcused'}
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
