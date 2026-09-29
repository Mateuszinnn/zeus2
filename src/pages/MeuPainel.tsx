import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { MyPending } from '@/features/student/MyPending'
import { MyPerformance } from '@/features/student/MyPerformance'
import { delay } from '@/mocks/delay'
import { firstName } from '@/lib/format'
import { DEMO_STUDENT_ID, SCHOOL, TERM, studentById, turmaLabel, turmaOf } from '@/mocks/data'

export function MeuPainel() {
  const [loading, setLoading] = useState(true)
  const student = studentById(DEMO_STUDENT_ID)

  useEffect(() => {
    let alive = true
    delay().then(() => {
      if (alive) setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <>
      <PageHeader
        title={`Hi, ${firstName(student.name)}`}
        subtitle={`${SCHOOL.course} · ${TERM.label} · ${turmaLabel(turmaOf(student))}`}
        crumbs={[{ label: 'My dashboard' }]}
      />

      {loading ? (
        <div className="flex flex-col gap-8" aria-busy="true" aria-label="Carregando o painel">
          <div>
            <div className="skeleton mb-3 h-5 w-56 rounded-sm" />
            <div className="flex gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-40 w-72 shrink-0 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="skeleton h-80 rounded-xl" />
            <div className="skeleton h-80 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <MyPending student={student} />
          <MyPerformance student={student} />
        </div>
      )}
    </>
  )
}
