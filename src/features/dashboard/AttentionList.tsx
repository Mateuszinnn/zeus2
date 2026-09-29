import { useMemo } from 'react'
import { PartyPopper } from 'lucide-react'
import { Card, CardHeader } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { GradeBar } from '@/components/GradeBar'
import { EmptyState } from '@/components/EmptyState'
import { plural } from '@/lib/format'
import { MIN_ATTENDANCE, PASSING_GRADE } from '@/lib/grade'
import { STUDENTS, attentionList, turmaOf, type AttentionReason } from '@/mocks/data'

/* The "who", which the aggregate metric never delivers.
 *
 * A student enters the list on a critical grade OR below minimum attendance.
 * Worst case first, named, with the reason spelled out. */

const CUT = PASSING_GRADE.toLocaleString('en-US', { minimumFractionDigits: 1 })

const REASON_TEXT: Record<AttentionReason, string> = {
  grade: `Average below ${CUT}`,
  attendance: `Attendance below ${MIN_ATTENDANCE}%`,
  both: `Average below ${CUT} and attendance below ${MIN_ATTENDANCE}%`,
}

export function AttentionList() {
  const entries = useMemo(() => attentionList(STUDENTS), [])

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Need attention"
        meta={
          entries.length > 0 ? (
            <span className="text-caption text-muted">
              {plural(entries.length, 'student', 'students')}
            </span>
          ) : undefined
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          icon={<PartyPopper size={40} />}
          title="Nobody out of range"
          description="All 60 students are above the passing average and the minimum attendance this term."
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
                  caption="Average"
                  value={student.average}
                  kind="grade"
                  label={`Average for ${student.name}`}
                />
                <LabelledBar
                  caption="Attendance"
                  value={student.attendance}
                  kind="attendance"
                  label={`Attendance for ${student.name}`}
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
