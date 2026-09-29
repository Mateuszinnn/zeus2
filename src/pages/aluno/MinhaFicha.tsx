import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { StatusBadge } from '@/components/StatusBadge'
import { ReadOnlyField } from '@/components/Field'
import { shortDate } from '@/lib/format'
import { DEMO_STUDENT_ID, TERM, studentById, turmaOf } from '@/mocks/data'
import { STATUS_LABEL, enrollmentOf, type EnrollmentStatus } from '@/mocks/records'

/* Somente leitura de verdade: valor sem moldura, com o rótulo acima.
 * Campo desabilitado para exibir dado parece defeito. */

const TONE: Record<EnrollmentStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  locked: 'warning',
  transferred: 'neutral',
}

export function MinhaFicha() {
  const student = studentById(DEMO_STUDENT_ID)
  const enrollment = enrollmentOf(student.id)
  const turma = turmaOf(student)

  return (
    <>
      <PageHeader
        title="Minha ficha"
        subtitle={`${TERM.label} · dados da minha matrícula no CIL`}
        crumbs={[{ label: 'Meu painel', to: '/meu-painel' }, { label: 'Minha ficha' }]}
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardBody className="flex flex-wrap items-center gap-5">
            <Avatar name={student.name} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-h2 text-primary">{student.name}</p>
              <p className="mt-0.5 text-body text-secondary">
                Matrícula {student.enrollment} · {turma.name} · {turma.stage}
              </p>
            </div>
            <StatusBadge tone={TONE[enrollment.status]}>
              {STATUS_LABEL[enrollment.status]}
            </StatusBadge>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Dados pessoais" />
          <CardBody className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <ReadOnlyField label="Nome completo" value={student.name} />
            <ReadOnlyField label="Data de nascimento" value={shortDate(enrollment.birthDate)} />
            <ReadOnlyField label="E-mail" value={enrollment.email} />
            <ReadOnlyField label="Cidade" value={enrollment.neighborhood} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Responsável" />
          <CardBody className="grid gap-6 sm:grid-cols-2">
            <ReadOnlyField label="Nome" value={enrollment.guardian} />
            <ReadOnlyField label="Telefone" value={enrollment.guardianPhone} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Curso e escola de origem" />
          <CardBody className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <ReadOnlyField label="Curso" value="Inglês" />
            <ReadOnlyField label="Estágio" value={`${turma.name} · ${turma.stage}`} />
            <ReadOnlyField label="Horário" value={turma.schedule} />
            <ReadOnlyField label="Escola de origem" value={enrollment.originSchool} />
            <ReadOnlyField label="Turno na origem" value={enrollment.shiftAtOrigin} />
            <ReadOnlyField label="No CIL desde" value={shortDate(enrollment.since)} />
          </CardBody>
        </Card>

        <p className="text-caption text-muted">
          Para corrigir qualquer dado desta ficha, procure a secretaria do CIL no horário da sua
          aula.
        </p>
      </div>
    </>
  )
}
