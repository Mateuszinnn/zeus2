import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { GradeBar } from '@/components/GradeBar'
import { StatusBadge } from '@/components/StatusBadge'
import { cn } from '@/lib/cn'
import { grade as fmtGrade } from '@/lib/format'
import { gradeLevel, levelStyle, PASSING_GRADE } from '@/lib/grade'
import { DEMO_STUDENT_ID, SKILLS, TERM, studentById, turmaLabel, turmaOf } from '@/mocks/data'

export function MinhasNotas() {
  const student = studentById(DEMO_STUDENT_ID)
  const average = student.average
  const weakest = [...SKILLS].sort(
    (a, b) => student.bySkill[a.id] - student.bySkill[b.id],
  )[0]

  return (
    <>
      <PageHeader
        title="My grades"
        subtitle={`${TERM.label} · ${turmaLabel(turmaOf(student))}`}
        crumbs={[{ label: 'My dashboard', to: '/my-dashboard' }, { label: 'My grades' }]}
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader
            title="My average"
            meta={
              <StatusBadge tone={average >= PASSING_GRADE ? 'success' : 'error'}>
                {average >= PASSING_GRADE ? 'Above the passing average' : 'Below average'}
              </StatusBadge>
            }
          />
          <CardBody className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
              <div>
                <p className="text-caption text-muted">Term average</p>
                <p className="mt-0.5 text-display text-primary">{fmtGrade(average)}</p>
              </div>
              <div>
                <p className="text-caption text-muted">Passing average</p>
                <p className="mt-0.5 text-h2 text-secondary">{fmtGrade(PASSING_GRADE)}</p>
              </div>
            </div>
            <p className="max-w-[65ch] text-body text-secondary">
              Your average comes from the five skills below, each weighted the same. The one
              pulling it down the most right now is{' '}
              <strong className="text-primary">{weakest.name}</strong>, at{' '}
              {fmtGrade(student.bySkill[weakest.id])}.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="By skill" meta={<span className="text-caption text-muted">{TERM.short}</span>} />
          <ul className="divide-y divide-default">
            {SKILLS.map((skill) => {
              const score = student.bySkill[skill.id]
              const style = levelStyle(gradeLevel(score))
              return (
                <li key={skill.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <span className="w-32 shrink-0 text-body font-medium text-primary">
                    {skill.name}
                  </span>
                  <GradeBar
                    value={score}
                    label={`Minha nota em ${skill.name}`}
                    className="min-w-56 flex-1"
                  />
                  <span className={cn('w-28 text-right text-caption', style.ink)}>
                    {style.label}
                  </span>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </>
  )
}
