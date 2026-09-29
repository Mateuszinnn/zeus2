import type { ReactNode } from 'react'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { GradeBar } from '@/components/GradeBar'
import { StatusBadge } from '@/components/StatusBadge'
import { cn } from '@/lib/cn'
import { grade as fmtGrade, percent as fmtPercent, shortDate } from '@/lib/format'
import { attendanceLevel, gradeLevel, levelStyle, MIN_ATTENDANCE, PASSING_GRADE } from '@/lib/grade'
import { ANNOUNCEMENTS, SKILLS, TERM, turmaOf, type Student } from '@/mocks/data'

/* A faixa de baixo do aluno. A inversão que faz as duas telas valerem uma
 * decisão só: embaixo, o professor vê QUEM precisa de atenção; o aluno vê
 * COMO ELE está. */

export function MyPerformance({ student }: { student: Student }) {
  const level = gradeLevel(student.average)
  const attLevel = attendanceLevel(student.attendance)

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader
          title="Como eu vou"
          meta={<span className="text-caption text-muted">{TERM.short} · {turmaOf(student).name}</span>}
        />
        <CardBody className="flex flex-1 flex-col gap-6">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <Figure
              label="Minha média"
              value={fmtGrade(student.average)}
              badge={
                <StatusBadge tone={level === 'critical' ? 'error' : level === 'attention' ? 'warning' : 'success'}>
                  {student.average >= PASSING_GRADE ? 'Acima da média' : 'Abaixo da média'}
                </StatusBadge>
              }
            />
            <Figure
              label="Minha frequência"
              value={fmtPercent(student.attendance)}
              badge={
                <StatusBadge tone={student.attendance >= MIN_ATTENDANCE ? 'success' : 'error'}>
                  {student.attendance >= MIN_ATTENDANCE
                    ? 'Dentro do mínimo'
                    : `Abaixo de ${MIN_ATTENDANCE}%`}
                </StatusBadge>
              }
            />
          </div>

          <ul className="flex flex-col gap-3">
            {SKILLS.map((skill) => {
              const score = student.bySkill[skill.id]
              return (
                <li key={skill.id} className="flex items-center gap-4">
                  <span className="w-28 shrink-0 text-label text-secondary">{skill.name}</span>
                  <GradeBar
                    value={score}
                    label={`Minha nota em ${skill.name}`}
                    className="flex-1"
                  />
                  <span
                    className={cn(
                      'w-20 shrink-0 text-right text-caption',
                      levelStyle(gradeLevel(score)).ink,
                    )}
                  >
                    {levelStyle(gradeLevel(score)).label}
                  </span>
                </li>
              )
            })}
          </ul>

          <p className="text-caption text-muted">
            No CIL a média de aprovação é {fmtGrade(PASSING_GRADE)} e a frequência mínima é{' '}
            {MIN_ATTENDANCE}%. Sua média sai das cinco habilidades acima, e sua frequência está{' '}
            {levelStyle(attLevel).label.toLowerCase()}.
          </p>
        </CardBody>
      </Card>

      <Card className="flex flex-col">
        <CardHeader title="Avisos" />
        <ul className="divide-y divide-default">
          {ANNOUNCEMENTS.map((announcement) => (
            <li key={announcement.id} className="px-6 py-4">
              <div className="flex items-start gap-2">
                {announcement.unread && (
                  <span
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-accent"
                    aria-label="Não lido"
                  />
                )}
                <div className={cn('min-w-0', !announcement.unread && 'pl-4')}>
                  <h3 className="text-body font-medium text-primary">{announcement.title}</h3>
                  <p className="mt-1 text-body text-secondary">{announcement.body}</p>
                  <p className="mt-2 text-caption text-muted">
                    {announcement.author} · {shortDate(announcement.date)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Figure({
  label,
  value,
  badge,
}: {
  label: string
  value: string
  badge: ReactNode
}) {
  return (
    <div>
      <p className="text-caption text-muted">{label}</p>
      <p className="mt-0.5 text-h2 text-primary">{value}</p>
      <div className="mt-1.5">{badge}</div>
    </div>
  )
}
