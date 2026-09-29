import { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { cn } from '@/lib/cn'
import { grade as fmtGrade, percent as fmtPercent, plural } from '@/lib/format'
import { levelStyle, type GradeLevel } from '@/lib/grade'
import { STUDENTS, TURMAS, gradeDistribution, studentsOf } from '@/mocks/data'

/* At 60 students, "overall average 7.2" tells the teacher nothing they do not
 * already know. What tells them something is the SHAPE of the class: how many
 * in each band, and where the mass sits.
 *
 * Every slice carries its count and its text label — anyone who cannot tell the
 * colours apart reads the same information. */

const SCOPES = [
  { id: 'all', label: 'Both classes' },
  ...TURMAS.map((t) => ({ id: t.id, label: t.name })),
]

export function ClassDistribution() {
  const [scope, setScope] = useState('all')

  const students = useMemo(
    () => (scope === 'all' ? STUDENTS : studentsOf(scope)),
    [scope],
  )

  const slices = useMemo(() => gradeDistribution(students), [students])
  const total = students.length
  const average = useMemo(
    () => students.reduce((sum, s) => sum + s.average, 0) / total,
    [students, total],
  )
  const attendance = useMemo(
    () => students.reduce((sum, s) => sum + s.attendance, 0) / total,
    [students, total],
  )

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="How the classes are doing"
        meta={<span className="text-caption text-muted">{plural(total, 'student', 'students')}</span>}
        actions={
          <div
            role="group"
            aria-label="Choose class"
            className="flex rounded-md border border-default p-0.5"
          >
            {SCOPES.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={scope === option.id}
                onClick={() => setScope(option.id)}
                className={cn(
                  'rounded-sm px-3 py-1.5 text-caption font-medium transition-colors duration-150 ease-expo',
                  scope === option.id
                    ? 'bg-accent-soft text-accent-ink'
                    : 'text-muted hover:text-primary',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      />

      <CardBody className="flex flex-1 flex-col gap-6">
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          <Figure label="Term average" value={fmtGrade(average)} />
          <Figure label="Attendance" value={fmtPercent(attendance)} />
        </div>

        <div>
          <div
            className="flex h-3 overflow-hidden rounded-full bg-gray-30"
            role="img"
            aria-label={slices
              .map((s) => `${s.count} ${levelStyle(s.level).label.toLowerCase()}`)
              .join(', ')}
          >
            {slices.map((slice) => (
              <span
                key={slice.level}
                className={cn(
                  'transition-[width] duration-200 ease-expo',
                  levelStyle(slice.level).fill,
                )}
                style={{ width: `${(slice.count / total) * 100}%` }}
              />
            ))}
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
            {slices.map((slice) => (
              <LegendRow key={slice.level} level={slice.level} count={slice.count} total={total} />
            ))}
          </ul>
        </div>
      </CardBody>
    </Card>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-caption text-muted">{label}</p>
      <p className="mt-0.5 text-h2 text-primary">{value}</p>
    </div>
  )
}

function LegendRow({ level, count, total }: { level: GradeLevel; count: number; total: number }) {
  const style = levelStyle(level)
  const range = RANGE[level]
  return (
    <li>
      <span className="flex items-center gap-2">
        <span className={cn('size-2.5 shrink-0 rounded-full', style.fill)} aria-hidden="true" />
        <span className="text-label text-primary">{style.label}</span>
      </span>
      <span className="mt-0.5 block pl-4.5 text-caption text-muted">
        {count} of {total} · {range}
      </span>
    </li>
  )
}

const RANGE: Record<GradeLevel, string> = {
  excellent: '8.5 to 10',
  adequate: '5.0 to 8.4',
  attention: '4.0 to 4.9',
  critical: 'below 4.0',
}
