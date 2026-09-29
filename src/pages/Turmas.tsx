import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, Users } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { GradeBar } from '@/components/GradeBar'
import { Avatar } from '@/components/Avatar'
import { cn } from '@/lib/cn'
import { plural } from '@/lib/format'
import { levelStyle } from '@/lib/grade'
import { SCHOOL, TERM, TURMAS, gradeDistribution, studentsOf, type Turma } from '@/mocks/data'
import { SESSIONS } from '@/mocks/records'

export function Turmas() {
  return (
    <>
      <PageHeader
        title="Classes"
        subtitle={`${SCHOOL.course} · ${TERM.label} · ${SESSIONS.length} classes held`}
        crumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Classes' }]}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {TURMAS.map((turma) => (
          <TurmaCard key={turma.id} turma={turma} />
        ))}
      </div>
    </>
  )
}

function TurmaCard({ turma }: { turma: Turma }) {
  const students = useMemo(() => studentsOf(turma.id), [turma.id])
  const slices = useMemo(() => gradeDistribution(students), [students])
  const average = students.reduce((sum, s) => sum + s.average, 0) / students.length
  const attendance = students.reduce((sum, s) => sum + s.attendance, 0) / students.length
  const top = [...students].sort((a, b) => b.average - a.average).slice(0, 5)

  return (
    <Card className="flex flex-col">
      <CardHeader
        title={`${turma.name} · ${turma.stage}`}
        meta={<span className="text-caption text-muted">{turma.shift}</span>}
      />
      <CardBody className="flex flex-1 flex-col gap-6">
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-body text-secondary">
          <span className="flex items-center gap-2">
            <Users size={16} className="text-muted" aria-hidden="true" />
            {plural(students.length, 'student', 'students')}
          </span>
          <span className="flex items-center gap-2">
            <CalendarClock size={16} className="text-muted" aria-hidden="true" />
            {turma.schedule}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <GradeBar value={average} label={`Average for class ${turma.name}`} className="w-full" />
          <GradeBar
            value={attendance}
            kind="attendance"
            label={`Attendance for class ${turma.name}`}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-30">
            {slices.map((slice) => (
              <span
                key={slice.level}
                className={levelStyle(slice.level).fill}
                style={{ width: `${(slice.count / students.length) * 100}%` }}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            {slices.map((slice) => (
              <li key={slice.level} className="flex items-center gap-1.5 text-caption text-muted">
                <span
                  className={cn('size-2 rounded-full', levelStyle(slice.level).fill)}
                  aria-hidden="true"
                />
                {slice.count} {levelStyle(slice.level).label.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <p className="text-label text-muted">Top averages</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {top.map((student) => (
              <li
                key={student.id}
                className="flex items-center gap-2 rounded-full bg-gray-20 py-1 pr-3 pl-1"
              >
                <Avatar name={student.name} size="sm" />
                <span className="text-caption text-secondary">
                  {student.name.split(' ')[0]} {student.name.split(' ')[1]?.[0]}.
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/grades?class=${turma.id}`}
            className="inline-flex h-10 items-center rounded-md border border-default px-4 text-body font-medium text-primary no-underline hover:border-strong"
          >
            Enter grades
          </Link>
          <Link
            to={`/attendance?class=${turma.id}`}
            className="inline-flex h-10 items-center rounded-md border border-default px-4 text-body font-medium text-primary no-underline hover:border-strong"
          >
            View attendance
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}
