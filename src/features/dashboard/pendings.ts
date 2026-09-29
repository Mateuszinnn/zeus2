import { ASSIGNMENTS, TODAY, TURMAS, turmaLabel, type Assignment, type Turma } from '@/mocks/data'

/* The teacher's day, in clock order.
 *
 * Ordering by time is the spine of the band — without it the band is an
 * arbitrary carousel. Donated by the departure board, recorded in the
 * direction contract. */

export type PendingState = 'pending' | 'late' | 'done'

export interface Pending {
  id: string
  /** "7:30 am" — what the card shows. */
  time: string
  /** "07:30" in 24h. Orders the band.
   *  Sorting the display label broke this once: "2:00 pm" sorts before
   *  "7:30 am" alphabetically, which put the afternoon first. */
  sortAt: string
  title: string
  context: string
  state: PendingState
  /** State label. Colour never travels alone. */
  stateLabel: string
  action: string
  kind: 'rollcall' | 'grading' | 'due'
  turma?: Turma
  assignment?: Assignment
}

function turma(id: string): Turma {
  return TURMAS.find((t) => t.id === id) ?? TURMAS[0]
}

export function buildPendings(rollcallDone: Record<string, boolean>): Pending[] {
  const writing = ASSIGNMENTS.find((a) => a.id === 'tf-1')!
  const listening = ASSIGNMENTS.find((a) => a.id === 'tf-3')!
  const useOfEnglish = ASSIGNMENTS.find((a) => a.id === 'tf-2')!

  const list: Pending[] = [
    {
      id: 'p-chamada-2a',
      time: '7:30 am',
      sortAt: '07:30',
      title: 'Roll call for today',
      context: `${turmaLabel(turma('t2a'))} · ${turma('t2a').shift}`,
      state: rollcallDone.t2a ? 'done' : 'pending',
      stateLabel: rollcallDone.t2a ? 'Done' : 'Pending',
      action: 'Take roll call',
      kind: 'rollcall',
      turma: turma('t2a'),
    },
    {
      id: 'p-corrigir-writing',
      time: '9:00 am',
      sortAt: '09:00',
      title: 'Mark the class writing task',
      context: `${turma('t2a').name} · ${writing.submitted} submissions waiting`,
      state: 'late',
      stateLabel: 'Due two days ago',
      action: 'Enter grades',
      kind: 'grading',
      turma: turma('t2a'),
      assignment: writing,
    },
    {
      id: 'p-chamada-4b',
      time: '2:00 pm',
      sortAt: '14:00',
      title: 'Roll call for today',
      context: `${turmaLabel(turma('t4b'))} · ${turma('t4b').shift}`,
      state: rollcallDone.t4b ? 'done' : 'pending',
      stateLabel: rollcallDone.t4b ? 'Done' : 'Pending',
      action: 'Take roll call',
      kind: 'rollcall',
      turma: turma('t4b'),
    },
    {
      id: 'p-listening-vence',
      time: '3:00 pm',
      sortAt: '15:00',
      title: 'Listening task is due today',
      context: `${turma('t4b').name} · ${listening.submitted} of ${listening.total} submitted`,
      state: 'pending',
      stateLabel: 'Due today',
      action: 'View submissions',
      kind: 'due',
      turma: turma('t4b'),
      assignment: listening,
    },
    {
      id: 'p-use-vence',
      time: '4:00 pm',
      sortAt: '16:00',
      title: 'Use of English is due tomorrow',
      context: `${turma('t2a').name} · ${useOfEnglish.submitted} of ${useOfEnglish.total} submitted`,
      state: 'pending',
      stateLabel: 'Due tomorrow',
      action: 'View submissions',
      kind: 'due',
      turma: turma('t2a'),
      assignment: useOfEnglish,
    },
  ]

  return list.sort((a, b) => a.sortAt.localeCompare(b.sortAt))
}

export function openCount(pendings: Pending[]): number {
  return pendings.filter((p) => p.state !== 'done').length
}

export const DEMO_DATE = TODAY
