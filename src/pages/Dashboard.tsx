import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { PendingBand } from '@/features/dashboard/PendingBand'
import { RollCallPanel } from '@/features/dashboard/RollCallPanel'
import { ClassDistribution } from '@/features/dashboard/ClassDistribution'
import { AttentionList } from '@/features/dashboard/AttentionList'
import { buildPendings, DEMO_DATE, type Pending } from '@/features/dashboard/pendings'
import { useToast } from '@/components/Toast'
import { delay } from '@/mocks/delay'
import { SCHOOL, TERM, TEACHER, TURMAS, turmaLabel, type Turma } from '@/mocks/data'
import { firstName } from '@/lib/format'

/* Duas faixas: pendências em cima, desempenho embaixo.
 * Ver .impeccable/surfaces/src-pages-dashboard-tsx.md */

export function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [rollcallDone, setRollcallDone] = useState<Record<string, boolean>>({ t4b: true })
  const [openRollCall, setOpenRollCall] = useState<Turma | null>(null)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    delay().then(() => {
      if (alive) setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  const pendings = useMemo(() => buildPendings(rollcallDone), [rollcallDone])

  function act(pending: Pending) {
    if (pending.kind === 'rollcall' && pending.turma) {
      setOpenRollCall(pending.turma)
      return
    }
    if (pending.kind === 'grading' && pending.turma) {
      navigate(`/notas?turma=${pending.turma.id}`)
      return
    }
    toast(`"${pending.title}" entra na tela de tarefas.`)
  }

  return (
    <>
      <PageHeader
        title={`Bom dia, ${firstName(TEACHER.name)}`}
        subtitle={`${SCHOOL.course} · ${TERM.label} · ${TURMAS.map(turmaLabel).join(' e ')}`}
        crumbs={[{ label: 'Painel' }]}
      />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex flex-col gap-8">
          {openRollCall ? (
            <RollCallPanel
              turma={openRollCall}
              onClose={() => setOpenRollCall(null)}
              onSaved={() => {
                setRollcallDone((prev) => ({ ...prev, [openRollCall.id]: true }))
                setOpenRollCall(null)
              }}
            />
          ) : (
            <PendingBand date={DEMO_DATE} pendings={pendings} onAct={act} />
          )}

          <div className="grid gap-6 xl:grid-cols-2">
            <ClassDistribution />
            <AttentionList />
          </div>
        </div>
      )}
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-label="Carregando o painel">
      <div>
        <div className="skeleton mb-3 h-5 w-64 rounded-sm" />
        <div className="flex gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40 w-72 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="skeleton h-72 rounded-xl" />
        <div className="skeleton h-72 rounded-xl" />
      </div>
    </div>
  )
}
