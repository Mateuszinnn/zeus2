import { ASSIGNMENTS, TODAY, TURMAS, type Assignment, type Turma } from '@/mocks/data'

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
  const resenha = ASSIGNMENTS.find((a) => a.id === 'tf-1')!
  const cartaz = ASSIGNMENTS.find((a) => a.id === 'tf-3')!
  const fracoes = ASSIGNMENTS.find((a) => a.id === 'tf-2')!

  const list: Pending[] = [
    {
      id: 'p-chamada-5a',
      time: '07:30',
      title: 'Chamada de hoje',
      context: `${turma('t5a').name} · ${turma('t5a').shift}`,
      state: rollcallDone.t5a ? 'done' : 'pending',
      stateLabel: rollcallDone.t5a ? 'Feita' : 'Pendente',
      action: 'Fazer chamada',
      kind: 'rollcall',
      turma: turma('t5a'),
    },
    {
      id: 'p-corrigir-resenha',
      time: '09:00',
      title: 'Corrigir a resenha do livro',
      context: `${turma('t5a').name} · ${resenha.submitted} entregas aguardando`,
      state: 'late',
      stateLabel: 'Prazo venceu anteontem',
      action: 'Corrigir',
      kind: 'grading',
      turma: turma('t5a'),
      assignment: resenha,
    },
    {
      id: 'p-chamada-5b',
      time: '13:00',
      title: 'Chamada de hoje',
      context: `${turma('t5b').name} · ${turma('t5b').shift}`,
      state: rollcallDone.t5b ? 'done' : 'pending',
      stateLabel: rollcallDone.t5b ? 'Feita' : 'Pendente',
      action: 'Fazer chamada',
      kind: 'rollcall',
      turma: turma('t5b'),
    },
    {
      id: 'p-cartaz-vence',
      time: '14:00',
      title: 'Cartaz do ciclo da água vence hoje',
      context: `${turma('t5b').name} · ${cartaz.submitted} de ${cartaz.total} entregues`,
      state: 'pending',
      stateLabel: 'Vence hoje',
      action: 'Ver entregas',
      kind: 'due',
      turma: turma('t5b'),
      assignment: cartaz,
    },
    {
      id: 'p-fracoes',
      time: '16:00',
      title: 'Lista de frações vence amanhã',
      context: `${turma('t5a').name} · ${fracoes.submitted} de ${fracoes.total} entregues`,
      state: 'pending',
      stateLabel: 'Vence amanhã',
      action: 'Ver entregas',
      kind: 'due',
      turma: turma('t5a'),
      assignment: fracoes,
    },
  ]

  return list.sort((a, b) => a.time.localeCompare(b.time))
}

export function openCount(pendings: Pending[]): number {
  return pendings.filter((p) => p.state !== 'done').length
}

export const DEMO_DATE = TODAY
