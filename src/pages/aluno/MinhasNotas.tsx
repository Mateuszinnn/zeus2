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
        title="Minhas notas"
        subtitle={`${TERM.label} · ${turmaLabel(turmaOf(student))}`}
        crumbs={[{ label: 'Meu painel', to: '/meu-painel' }, { label: 'Minhas notas' }]}
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader
            title="Minha média"
            meta={
              <StatusBadge tone={average >= PASSING_GRADE ? 'success' : 'error'}>
                {average >= PASSING_GRADE ? 'Acima da média de aprovação' : 'Abaixo da média'}
              </StatusBadge>
            }
          />
          <CardBody className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
              <div>
                <p className="text-caption text-muted">Média do bimestre</p>
                <p className="mt-0.5 text-display text-primary">{fmtGrade(average)}</p>
              </div>
              <div>
                <p className="text-caption text-muted">Média de aprovação</p>
                <p className="mt-0.5 text-h2 text-secondary">{fmtGrade(PASSING_GRADE)}</p>
              </div>
            </div>
            <p className="max-w-[65ch] text-body text-secondary">
              Sua média sai das cinco habilidades abaixo, com o mesmo peso para cada uma. Hoje a
              que mais puxa para baixo é <strong className="text-primary">{weakest.name}</strong>,
              com {fmtGrade(student.bySkill[weakest.id])}.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Por habilidade" meta={<span className="text-caption text-muted">{TERM.short}</span>} />
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
