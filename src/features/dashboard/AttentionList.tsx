import { useMemo } from 'react'
import { PartyPopper } from 'lucide-react'
import { Card, CardHeader } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { GradeBar } from '@/components/GradeBar'
import { EmptyState } from '@/components/EmptyState'
import { plural } from '@/lib/format'
import { MIN_ATTENDANCE, PASSING_GRADE } from '@/lib/grade'
import { STUDENTS, attentionList, turmaOf, type AttentionReason } from '@/mocks/data'

/* O "quem", que é o que a métrica agregada não entrega.
 *
 * Entra na lista quem está em faixa crítica de nota OU abaixo da frequência
 * mínima. Pior caso primeiro, nomeado, com o motivo escrito. */

const CUT = PASSING_GRADE.toLocaleString('pt-BR', { minimumFractionDigits: 1 })

const REASON_TEXT: Record<AttentionReason, string> = {
  grade: `Média abaixo de ${CUT}`,
  attendance: `Frequência abaixo de ${MIN_ATTENDANCE}%`,
  both: `Média abaixo de ${CUT} e frequência abaixo de ${MIN_ATTENDANCE}%`,
}

export function AttentionList() {
  const entries = useMemo(() => attentionList(STUDENTS), [])

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Precisam de atenção"
        meta={
          entries.length > 0 ? (
            <span className="text-caption text-muted">
              {plural(entries.length, 'aluno', 'alunos')}
            </span>
          ) : undefined
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          icon={<PartyPopper size={40} />}
          title="Ninguém fora da faixa"
          description="Todos os 60 alunos estão acima da média de aprovação e da frequência mínima neste bimestre."
        />
      ) : (
        <ul className="divide-y divide-default">
          {entries.map(({ student, reason }) => (
            <li key={student.id} className="px-6 py-4 transition-colors hover:bg-surface-alt">
              <div className="flex items-center gap-3">
                <Avatar name={student.name} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body font-medium text-primary">
                    {student.name}
                  </span>
                  <span className="block text-caption text-muted">
                    {turmaOf(student).name} · {REASON_TEXT[reason]}
                  </span>
                </span>
              </div>

              <div className="mt-3 grid gap-2 pl-11">
                <LabelledBar
                  caption="Média"
                  value={student.average}
                  kind="grade"
                  label={`Média de ${student.name}`}
                />
                <LabelledBar
                  caption="Frequência"
                  value={student.attendance}
                  kind="attendance"
                  label={`Frequência de ${student.name}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function LabelledBar({
  caption,
  value,
  kind,
  label,
}: {
  caption: string
  value: number
  kind: 'grade' | 'attendance'
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-caption text-muted">{caption}</span>
      <GradeBar value={value} kind={kind} label={label} className="flex-1" />
    </div>
  )
}
