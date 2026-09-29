/* Dados mock do Zeus.
 *
 * Um professor polivalente, duas turmas, 60 alunos. A distribuição de notas e
 * frequência é AUTORADA, não aleatória: ~20% excelente, ~55% adequado,
 * ~15% atenção, ~10% crítico, com uma minoria real abaixo dos 75% de
 * frequência — senão a lista de atenção nasce vazia e a tela não prova nada.
 *
 * Nada aqui é dado real. Nenhum nome corresponde a pessoa existente.
 */

import { gradeLevel, attendanceLevel, type GradeLevel } from '@/lib/grade'

/* ------------------------------------------------------------------ *
 * Calendário da demo
 * ------------------------------------------------------------------ */

/** A demo roda numa quinta-feira do bimestre 1. Data fixa: um sistema que
 *  muda de conteúdo conforme o dia da apresentação é impossível de ensaiar. */
export const TODAY = '2026-04-09'
export const TERM = { current: 1, total: 4, label: 'Bimestre 1 de 4' }

/* ------------------------------------------------------------------ *
 * Disciplinas e turmas
 * ------------------------------------------------------------------ */

export interface Subject {
  id: string
  name: string
  short: string
}

export const SUBJECTS: Subject[] = [
  { id: 'port', name: 'Português', short: 'Port' },
  { id: 'mat', name: 'Matemática', short: 'Mat' },
  { id: 'cie', name: 'Ciências', short: 'Cie' },
  { id: 'hist', name: 'História', short: 'Hist' },
  { id: 'geo', name: 'Geografia', short: 'Geo' },
  { id: 'arte', name: 'Arte', short: 'Arte' },
]

export interface Turma {
  id: string
  name: string
  grade: string
  shift: string
}

export const TURMAS: Turma[] = [
  { id: 't5a', name: '5º A', grade: '5º ano', shift: 'Manhã' },
  { id: 't5b', name: '5º B', grade: '5º ano', shift: 'Tarde' },
]

export const TEACHER = {
  id: 'prof-1',
  name: 'Helena Vasconcelos',
  role: 'Professora · 5º ano',
}

/* ------------------------------------------------------------------ *
 * Alunos
 *
 * [nome, média geral, % de frequência]. A curva é deliberada.
 * ------------------------------------------------------------------ */

type Row = [string, number, number]

const ROSTER_5A: Row[] = [
  ['Ana Beatriz Lima', 9.4, 98],
  ['Arthur Nogueira Pinto', 7.2, 94],
  ['Bruna Carvalho Dias', 8.8, 96],
  ['Caio Fernandes Rocha', 6.4, 88],
  ['Camila Souza Moreira', 7.9, 92],
  ['Davi Luiz Andrade', 5.3, 79],
  ['Eduarda Ramos Teixeira', 9.1, 100],
  ['Enzo Gabriel Martins', 4.6, 71],
  ['Fernanda Alves Correia', 7.5, 90],
  ['Gabriel Moreira Braga', 6.8, 85],
  ['Giovanna Pires Azevedo', 8.6, 97],
  ['Gustavo Henrique Salles', 6.1, 83],
  ['Heitor Campos Vieira', 5.7, 76],
  ['Isabela Cunha Monteiro', 9.7, 99],
  ['João Pedro Barbosa', 7.0, 91],
  ['Júlia Mendes Farias', 8.2, 95],
  ['Kauã Ribeiro Santana', 3.9, 64],
  ['Larissa Duarte Peixoto', 7.7, 93],
  ['Lucas Almeida Tavares', 6.6, 87],
  ['Manuela Freitas Lopes', 8.9, 98],
  ['Matheus Siqueira Braz', 5.1, 74],
  ['Miguel Antunes Rezende', 7.3, 89],
  ['Nicolas Batista Furtado', 6.3, 82],
  ['Olívia Cardoso Menezes', 9.2, 97],
  ['Pedro Henrique Aguiar', 4.2, 68],
  ['Rafaela Gomes Bastos', 7.8, 94],
  ['Samuel Coelho Ventura', 6.9, 86],
  ['Sophia Marques Resende', 8.4, 96],
  ['Thiago Nunes Caldeira', 5.5, 77],
  ['Valentina Brito Sampaio', 8.7, 99],
]

const ROSTER_5B: Row[] = [
  ['Alice Moraes Guimarães', 9.0, 97],
  ['Benício Leal Fontoura', 6.7, 88],
  ['Bianca Teles Paiva', 8.3, 95],
  ['Breno Machado Quintela', 5.9, 81],
  ['Cecília Lacerda Prado', 9.5, 100],
  ['Daniel Rocha Espíndola', 6.2, 84],
  ['Elisa Amaral Bandeira', 7.6, 92],
  ['Felipe Cordeiro Vilela', 4.8, 72],
  ['Gael Figueiredo Serra', 7.1, 90],
  ['Helena Brandão Xavier', 8.5, 96],
  ['Henrique Padilha Solano', 6.5, 86],
  ['Ísis Carvalho Bittencourt', 9.3, 98],
  ['Joaquim Neves Tavares', 5.4, 78],
  ['Lara Pacheco Simões', 7.9, 93],
  ['Laura Bezerra Vasques', 8.1, 94],
  ['Leonardo Fraga Dantas', 6.0, 80],
  ['Lívia Sales Camargo', 8.8, 97],
  ['Lorenzo Vargas Beltrão', 3.4, 58],
  ['Luana Pontes Rabelo', 7.4, 91],
  ['Maitê Oliveira Galvão', 9.6, 99],
  ['Marcelo Assis Trindade', 5.6, 79],
  ['Mariana Godoy Sobral', 8.0, 95],
  ['Murilo Barros Linhares', 6.8, 87],
  ['Nina Rodrigues Aragão', 8.9, 98],
  ['Otávio Seixas Maciel', 4.4, 69],
  ['Rebeca Antunes Vidal', 7.3, 89],
  ['Rodrigo Piva Meireles', 6.4, 85],
  ['Sarah Lemos Cavalcanti', 9.1, 96],
  ['Vicente Duarte Rios', 5.8, 82],
  ['Yasmin Ferraz Bonfim', 7.7, 92],
]

export interface Student {
  id: string
  name: string
  enrollment: string
  turmaId: string
  /** Média geral do bimestre, 0–10. */
  average: number
  /** Percentual de presença no bimestre. */
  attendance: number
  /** Média por disciplina, derivada da geral com variação determinística. */
  bySubject: Record<string, number>
}

/** Variação determinística por aluno e disciplina: a mesma semente sempre
 *  devolve a mesma nota, então a demo é ensaiável. */
function jitter(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 1009
  return (h % 21) / 10 - 1 // -1.0 .. +1.0
}

function clampGrade(value: number): number {
  return Math.round(Math.min(10, Math.max(0, value)) * 10) / 10
}

function buildStudents(rows: Row[], turmaId: string, offset: number): Student[] {
  return rows.map(([name, average, attendance], i) => {
    const id = `${turmaId}-${i + 1}`
    const bySubject: Record<string, number> = {}
    for (const subject of SUBJECTS) {
      bySubject[subject.id] = clampGrade(average + jitter(`${id}:${subject.id}`))
    }
    return {
      id,
      name,
      enrollment: String(2026_000 + offset + i + 1),
      turmaId,
      average,
      attendance,
      bySubject,
    }
  })
}

export const STUDENTS: Student[] = [
  ...buildStudents(ROSTER_5A, 't5a', 100),
  ...buildStudents(ROSTER_5B, 't5b', 200),
]

export function studentsOf(turmaId: string): Student[] {
  return STUDENTS.filter((s) => s.turmaId === turmaId)
}

export function turmaOf(student: Student): Turma {
  return TURMAS.find((t) => t.id === student.turmaId) ?? TURMAS[0]
}

/* ------------------------------------------------------------------ *
 * Distribuição e atenção
 * ------------------------------------------------------------------ */

export interface DistributionSlice {
  level: GradeLevel
  count: number
}

export function gradeDistribution(students: Student[]): DistributionSlice[] {
  const order: GradeLevel[] = ['excellent', 'adequate', 'attention', 'critical']
  return order.map((level) => ({
    level,
    count: students.filter((s) => gradeLevel(s.average) === level).length,
  }))
}

export type AttentionReason = 'grade' | 'attendance' | 'both'

export interface AttentionEntry {
  student: Student
  reason: AttentionReason
}

/** Entra na lista quem está em faixa crítica de nota OU abaixo da
 *  frequência mínima. Pior caso primeiro. */
export function attentionList(students: Student[]): AttentionEntry[] {
  return students
    .map((student) => {
      const badGrade = gradeLevel(student.average) === 'critical'
      const badAttendance = attendanceLevel(student.attendance) === 'critical' || student.attendance < 75
      if (badGrade && badAttendance) return { student, reason: 'both' as const }
      if (badGrade) return { student, reason: 'grade' as const }
      if (badAttendance) return { student, reason: 'attendance' as const }
      return null
    })
    .filter((entry): entry is AttentionEntry => entry !== null)
    .sort((a, b) => a.student.average - b.student.average)
}

/* ------------------------------------------------------------------ *
 * Avisos
 * ------------------------------------------------------------------ */

export type Priority = 'normal' | 'important'

export interface Announcement {
  id: string
  title: string
  body: string
  author: string
  date: string
  priority: Priority
  unread: boolean
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'av-1',
    title: 'Reunião de pais do 5º ano — 18 de abril',
    body: 'As reuniões acontecem no sábado, das 9h às 12h, na sala de cada turma. Os boletins do bimestre 1 serão entregues no fim do encontro.',
    author: 'Coordenação pedagógica',
    date: '2026-04-08',
    priority: 'important',
    unread: true,
  },
  {
    id: 'av-2',
    title: 'Feira de ciências: inscrição dos projetos até 24 de abril',
    body: 'Cada turma pode inscrever até seis projetos. O formulário fica disponível na secretaria e os grupos podem ter de dois a quatro alunos.',
    author: 'Coordenação pedagógica',
    date: '2026-04-06',
    priority: 'normal',
    unread: true,
  },
  {
    id: 'av-3',
    title: 'Manutenção da quadra entre 13 e 17 de abril',
    body: 'As aulas de Educação Física acontecem no pátio coberto durante a semana de manutenção.',
    author: 'Secretaria',
    date: '2026-04-02',
    priority: 'normal',
    unread: false,
  },
]

/* ------------------------------------------------------------------ *
 * Tarefas
 * ------------------------------------------------------------------ */

export interface Assignment {
  id: string
  title: string
  subjectId: string
  turmaId: string
  due: string
  submitted: number
  total: number
  graded: number
}

export const ASSIGNMENTS: Assignment[] = [
  { id: 'tf-1', title: 'Resenha do livro "O menino do dedo verde"', subjectId: 'port', turmaId: 't5a', due: '2026-04-07', submitted: 27, total: 30, graded: 0 },
  { id: 'tf-2', title: 'Lista de frações equivalentes', subjectId: 'mat', turmaId: 't5a', due: '2026-04-10', submitted: 18, total: 30, graded: 0 },
  { id: 'tf-3', title: 'Cartaz do ciclo da água', subjectId: 'cie', turmaId: 't5b', due: '2026-04-09', submitted: 24, total: 30, graded: 0 },
  { id: 'tf-4', title: 'Linha do tempo do Brasil Colônia', subjectId: 'hist', turmaId: 't5b', due: '2026-04-14', submitted: 6, total: 30, graded: 0 },
  { id: 'tf-5', title: 'Mapa das regiões brasileiras', subjectId: 'geo', turmaId: 't5a', due: '2026-04-03', submitted: 30, total: 30, graded: 30 },
]

export function subjectOf(id: string): Subject {
  return SUBJECTS.find((s) => s.id === id) ?? SUBJECTS[0]
}

export function turmaById(id: string): Turma {
  return TURMAS.find((t) => t.id === id) ?? TURMAS[0]
}

/* ------------------------------------------------------------------ *
 * Ocorrências
 * ------------------------------------------------------------------ */

export type Severity = 'light' | 'medium' | 'serious'

export interface Incident {
  id: string
  studentId: string
  date: string
  kind: string
  severity: Severity
  note: string
}

export const INCIDENTS: Incident[] = [
  { id: 'oc-1', studentId: 't5a-17', date: '2026-04-07', kind: 'Faltas seguidas', severity: 'serious', note: 'Quarta ausência consecutiva sem justificativa. Família contatada pela secretaria.' },
  { id: 'oc-2', studentId: 't5b-18', date: '2026-04-06', kind: 'Tarefas não entregues', severity: 'medium', note: 'Três tarefas de Matemática em aberto no bimestre.' },
  { id: 'oc-3', studentId: 't5a-25', date: '2026-04-01', kind: 'Saída antecipada', severity: 'light', note: 'Saiu às 10h com autorização do responsável.' },
]

/* ------------------------------------------------------------------ *
 * Chamada — o estado que a interação assinatura manipula
 * ------------------------------------------------------------------ */

export interface RollCallState {
  turmaId: string
  date: string
  /** id do aluno -> presente. Ausente do mapa = ainda não marcado. */
  marks: Record<string, boolean>
  done: boolean
}

export const INITIAL_ROLLCALL: RollCallState[] = [
  { turmaId: 't5a', date: TODAY, marks: {}, done: false },
  { turmaId: 't5b', date: TODAY, marks: {}, done: true },
]

/* ------------------------------------------------------------------ *
 * O aluno que a demo mostra quando o perfil é "student"
 * ------------------------------------------------------------------ */

/** Escolhido de propósito na faixa adequada, com uma disciplina em atenção
 *  e uma tarefa vencendo: um painel de aluno perfeito não demonstra nada. */
export const DEMO_STUDENT_ID = 't5a-19' // Lucas Almeida Tavares

export function studentById(id: string): Student {
  return STUDENTS.find((s) => s.id === id) ?? STUDENTS[0]
}
