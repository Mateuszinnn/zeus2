import { ASSIGNMENTS, TODAY, TURMAS, turmaLabel, type Assignment, type Turma } from '@/mocks/data'

/* O dia do professor, em ordem de relógio.
 *
 * A ordenação por hora é a espinha da faixa — sem ela, a faixa é um carrossel
 * arbitrário. Doação do quadro de partidas, registrada no direction contract. */

export type PendingState = 'pending' | 'late' | 'done'

export interface Pending {
  id: string
  /** "07:30". Ordena a faixa. */
  time: string
  title: string
  context: string
  state: PendingState
  /** Rótulo do estado. A cor nunca viaja sozinha. */
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
      time: '07:30',
      title: 'Chamada de hoje',
      context: `${turmaLabel(turma('t2a'))} · ${turma('t2a').shift}`,
      state: rollcallDone.t2a ? 'done' : 'pending',
      stateLabel: rollcallDone.t2a ? 'Feita' : 'Pendente',
      action: 'Fazer chamada',
      kind: 'rollcall',
      turma: turma('t2a'),
    },
    {
      id: 'p-corrigir-writing',
      time: '09:00',
      title: 'Corrigir o writing da turma',
      context: `${turma('t2a').name} · ${writing.submitted} entregas aguardando`,
      state: 'late',
      stateLabel: 'Prazo venceu anteontem',
      action: 'Lançar notas',
      kind: 'grading',
      turma: turma('t2a'),
      assignment: writing,
    },
    {
      id: 'p-chamada-4b',
      time: '14:00',
      title: 'Chamada de hoje',
      context: `${turmaLabel(turma('t4b'))} · ${turma('t4b').shift}`,
      state: rollcallDone.t4b ? 'done' : 'pending',
      stateLabel: rollcallDone.t4b ? 'Feita' : 'Pendente',
      action: 'Fazer chamada',
      kind: 'rollcall',
      turma: turma('t4b'),
    },
    {
      id: 'p-listening-vence',
      time: '15:00',
      title: 'Listening vence hoje',
      context: `${turma('t4b').name} · ${listening.submitted} de ${listening.total} entregues`,
      state: 'pending',
      stateLabel: 'Vence hoje',
      action: 'Ver entregas',
      kind: 'due',
      turma: turma('t4b'),
      assignment: listening,
    },
    {
      id: 'p-use-vence',
      time: '16:00',
      title: 'Use of English vence amanhã',
      context: `${turma('t2a').name} · ${useOfEnglish.submitted} de ${useOfEnglish.total} entregues`,
      state: 'pending',
      stateLabel: 'Vence amanhã',
      action: 'Ver entregas',
      kind: 'due',
      turma: turma('t2a'),
      assignment: useOfEnglish,
    },
  ]

  return list.sort((a, b) => a.time.localeCompare(b.time))
}

export function openCount(pendings: Pending[]): number {
  return pendings.filter((p) => p.state !== 'done').length
}

export const DEMO_DATE = TODAY
