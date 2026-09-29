/* Dados mock do Zeus — CIL, curso de inglês.
 *
 * Uma professora de inglês, duas turmas, 60 alunos. A distribuição de notas e
 * frequência é AUTORADA, não aleatória, e calibrada para o corte institucional
 * do CIL: média de aprovação 5,0 e frequência mínima 75%.
 *
 * Nada aqui é dado real. Nenhum nome corresponde a pessoa existente, e nenhum
 * número descreve um CIL existente.
 */

import { gradeLevel, attendanceLevel, type GradeLevel } from '@/lib/grade'

/* ------------------------------------------------------------------ *
 * Calendário da demo
 * ------------------------------------------------------------------ */

/** A demo roda numa quinta-feira. Data fixa: um sistema que muda de conteúdo
 *  conforme o dia da apresentação é impossível de ensaiar. */
export const TODAY = '2026-04-09'
export const TERM = {
  current: 1,
  total: 2,
  label: 'Bimestre 1 de 2 · 1º semestre de 2026',
  short: 'Bimestre 1',
}

/* ------------------------------------------------------------------ *
 * Habilidades
 *
 * A nota de inglês é composta das quatro habilidades mais o uso da língua.
 * Esta lista é a ordem canônica em toda tela — trocar a ordem em um lugar só
 * quebra a comparação entre telas.
 * ------------------------------------------------------------------ */

export interface Skill {
  id: string
  name: string
  short: string
}

export const SKILLS: Skill[] = [
  { id: 'listening', name: 'Listening', short: 'List' },
  { id: 'speaking', name: 'Speaking', short: 'Speak' },
  { id: 'reading', name: 'Reading', short: 'Read' },
  { id: 'writing', name: 'Writing', short: 'Write' },
  { id: 'use', name: 'Use of English', short: 'Use' },
]

export function skillById(id: string): Skill {
  return SKILLS.find((s) => s.id === id) ?? SKILLS[0]
}

/* ------------------------------------------------------------------ *
 * Turmas
 *
 * Estágios de 1A a 6B: o número é o estágio e a letra é o semestre dentro
 * dele. 1–2 Básico, 3–4 Intermediário, 5–6 Avançado.
 * ------------------------------------------------------------------ */

export interface Turma {
  id: string
  /** "2A" */
  name: string
  /** "Básico" */
  stage: string
  shift: string
  /** Dias e horário do encontro. */
  schedule: string
}

export const TURMAS: Turma[] = [
  { id: 't2a', name: '2A', stage: 'Básico', shift: 'Manhã', schedule: 'Ter e Qui · 07:30' },
  { id: 't4b', name: '4B', stage: 'Intermediário', shift: 'Tarde', schedule: 'Ter e Qui · 14:00' },
]

export const TEACHER = {
  id: 'prof-1',
  name: 'Helena Vasconcelos',
  role: 'Professora de Inglês',
}

export const SCHOOL = {
  name: 'Centro Interescolar de Línguas',
  short: 'CIL',
  course: 'Inglês',
}

/* ------------------------------------------------------------------ *
 * Alunos
 *
 * [nome, média geral, % de frequência]. A curva é deliberada, com o corte de
 * aprovação em 5,0: ~20% excelente, ~57% aprovado, ~13% recuperável,
 * ~10% crítico.
 * ------------------------------------------------------------------ */

type Row = [string, number, number]

const ROSTER_2A: Row[] = [
  ['Ana Beatriz Lima', 9.4, 98],
  ['Arthur Nogueira Pinto', 7.2, 94],
  ['Bruna Carvalho Dias', 8.8, 96],
  ['Caio Fernandes Rocha', 6.4, 88],
  ['Camila Souza Moreira', 7.9, 92],
  ['Davi Luiz Andrade', 4.3, 79],
  ['Eduarda Ramos Teixeira', 9.1, 100],
  ['Enzo Gabriel Martins', 3.6, 71],
  ['Fernanda Alves Correia', 7.5, 90],
  ['Gabriel Moreira Braga', 6.8, 85],
  ['Giovanna Pires Azevedo', 8.6, 97],
  ['Gustavo Henrique Salles', 5.1, 83],
  ['Heitor Campos Vieira', 4.7, 76],
  ['Isabela Cunha Monteiro', 9.7, 99],
  ['João Pedro Barbosa', 7.0, 91],
  ['Júlia Mendes Farias', 8.2, 95],
  ['Kauã Ribeiro Santana', 3.1, 64],
  ['Larissa Duarte Peixoto', 7.7, 93],
  ['Lucas Almeida Tavares', 5.6, 87],
  ['Manuela Freitas Lopes', 8.9, 98],
  ['Matheus Siqueira Braz', 4.1, 74],
  ['Miguel Antunes Rezende', 7.3, 89],
  ['Nicolas Batista Furtado', 6.3, 82],
  ['Olívia Cardoso Menezes', 9.2, 97],
  ['Pedro Henrique Aguiar', 3.4, 68],
  ['Rafaela Gomes Bastos', 7.8, 94],
  ['Samuel Coelho Ventura', 6.9, 86],
  ['Sophia Marques Resende', 8.4, 96],
  ['Thiago Nunes Caldeira', 5.0, 77],
  ['Valentina Brito Sampaio', 8.7, 99],
]

const ROSTER_4B: Row[] = [
  ['Alice Moraes Guimarães', 9.0, 97],
  ['Benício Leal Fontoura', 6.7, 88],
  ['Bianca Teles Paiva', 8.3, 95],
  ['Breno Machado Quintela', 5.9, 81],
  ['Cecília Lacerda Prado', 9.5, 100],
  ['Daniel Rocha Espíndola', 6.2, 84],
  ['Elisa Amaral Bandeira', 7.6, 92],
  ['Felipe Cordeiro Vilela', 4.0, 72],
  ['Gael Figueiredo Serra', 7.1, 90],
  ['Helena Brandão Xavier', 8.5, 96],
  ['Henrique Padilha Solano', 6.5, 86],
  ['Ísis Carvalho Bittencourt', 9.3, 98],
  ['Joaquim Neves Tavares', 4.6, 78],
  ['Lara Pacheco Simões', 7.9, 93],
  ['Laura Bezerra Vasques', 8.1, 94],
  ['Leonardo Fraga Dantas', 6.0, 80],
  ['Lívia Sales Camargo', 8.8, 97],
  ['Lorenzo Vargas Beltrão', 2.8, 58],
  ['Luana Pontes Rabelo', 7.4, 91],
  ['Maitê Oliveira Galvão', 9.6, 99],
  ['Marcelo Assis Trindade', 5.3, 79],
  ['Mariana Godoy Sobral', 8.0, 95],
  ['Murilo Barros Linhares', 6.8, 87],
  ['Nina Rodrigues Aragão', 8.9, 98],
  ['Otávio Seixas Maciel', 3.8, 69],
  ['Rebeca Antunes Vidal', 7.3, 89],
  ['Rodrigo Piva Meireles', 6.4, 85],
  ['Sarah Lemos Cavalcanti', 9.1, 96],
  ['Vicente Duarte Rios', 5.5, 82],
  ['Yasmin Ferraz Bonfim', 7.7, 92],
]

export interface Student {
  id: string
  name: string
  enrollment: string
  turmaId: string
  /** Média do bimestre, 0–10, composta das cinco habilidades. */
  average: number
  /** Percentual de presença no bimestre. */
  attendance: number
  /** Nota por habilidade. */
  bySkill: Record<string, number>
}

/** Variação determinística por aluno e habilidade: a mesma semente sempre
 *  devolve a mesma nota, então a demo é ensaiável. */
function jitter(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 1009
  return (h % 25) / 10 - 1.2 // -1.2 .. +1.2
}

function clampGrade(value: number): number {
  return Math.round(Math.min(10, Math.max(0, value)) * 10) / 10
}

function buildStudents(rows: Row[], turmaId: string, offset: number): Student[] {
  return rows.map(([name, average, attendance], i) => {
    const id = `${turmaId}-${i + 1}`
    const bySkill: Record<string, number> = {}
    for (const skill of SKILLS) {
      bySkill[skill.id] = clampGrade(average + jitter(`${id}:${skill.id}`))
    }
    return {
      id,
      name,
      enrollment: String(2026_000 + offset + i + 1),
      turmaId,
      average,
      attendance,
      bySkill,
    }
  })
}

export const STUDENTS: Student[] = [
  ...buildStudents(ROSTER_2A, 't2a', 100),
  ...buildStudents(ROSTER_4B, 't4b', 200),
]

export function studentsOf(turmaId: string): Student[] {
  return STUDENTS.filter((s) => s.turmaId === turmaId)
}

export function turmaOf(student: Student): Turma {
  return TURMAS.find((t) => t.id === student.turmaId) ?? TURMAS[0]
}

export function turmaById(id: string): Turma {
  return TURMAS.find((t) => t.id === id) ?? TURMAS[0]
}

/** "2A · Básico" — o rótulo canônico da turma fora da tabela. */
export function turmaLabel(turma: Turma): string {
  return `${turma.name} · ${turma.stage}`
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

/** Entra na lista quem está abaixo da média de aprovação OU abaixo da
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
    title: 'Rematrícula do 2º semestre entre 4 e 15 de maio',
    body: 'A rematrícula é feita pelo próprio aluno na secretaria, no horário da aula. Quem perder o prazo concorre a vaga remanescente na chamada pública.',
    author: 'Secretaria do CIL',
    date: '2026-04-08',
    priority: 'important',
    unread: true,
  },
  {
    id: 'av-2',
    title: 'Speaking test dos estágios 4 a 6 na semana de 20 de abril',
    body: 'As provas orais acontecem em duplas, no horário regular da turma. A banca é composta pelo professor da turma e mais um professor do estágio.',
    author: 'Coordenação de Inglês',
    date: '2026-04-06',
    priority: 'normal',
    unread: true,
  },
  {
    id: 'av-3',
    title: 'Clube de conversação abre inscrições',
    body: 'Encontros às sextas, das 16h às 17h, abertos a alunos do estágio 3 em diante. São 20 vagas por semestre.',
    author: 'Coordenação de Inglês',
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
  skillId: string
  turmaId: string
  due: string
  submitted: number
  total: number
  graded: number
}

export const ASSIGNMENTS: Assignment[] = [
  { id: 'tf-1', title: 'Writing: e-mail informal para um amigo', skillId: 'writing', turmaId: 't2a', due: '2026-04-07', submitted: 27, total: 30, graded: 0 },
  { id: 'tf-2', title: 'Use of English: past simple e past continuous', skillId: 'use', turmaId: 't2a', due: '2026-04-10', submitted: 18, total: 30, graded: 0 },
  { id: 'tf-3', title: 'Listening: entrevista sobre rotina de trabalho', skillId: 'listening', turmaId: 't4b', due: '2026-04-09', submitted: 24, total: 30, graded: 0 },
  { id: 'tf-4', title: 'Reading: artigo sobre mudanças climáticas', skillId: 'reading', turmaId: 't4b', due: '2026-04-14', submitted: 6, total: 30, graded: 0 },
  { id: 'tf-5', title: 'Speaking: apresentação sobre a própria cidade', skillId: 'speaking', turmaId: 't2a', due: '2026-04-03', submitted: 30, total: 30, graded: 30 },
]

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
  /** Providência tomada e registrada. */
  handled: boolean
}

export const INCIDENTS: Incident[] = [
  { id: 'oc-1', studentId: 't2a-17', date: '2026-04-07', kind: 'Faltas seguidas', severity: 'serious', note: 'Quarta ausência consecutiva sem justificativa. Risco de perder a vaga no semestre.', handled: false },
  { id: 'oc-2', studentId: 't4b-18', date: '2026-04-06', kind: 'Tarefas não entregues', severity: 'medium', note: 'Três tarefas de Use of English em aberto no bimestre.', handled: false },
  { id: 'oc-3', studentId: 't2a-25', date: '2026-04-01', kind: 'Saída antecipada', severity: 'light', note: 'Saiu às 08:40 com autorização do responsável.', handled: true },
  { id: 'oc-4', studentId: 't4b-25', date: '2026-03-31', kind: 'Faltas seguidas', severity: 'serious', note: 'Ausente em cinco das últimas oito aulas. Secretaria acionou a escola de origem.', handled: false },
  { id: 'oc-5', studentId: 't2a-8', date: '2026-03-26', kind: 'Desempenho em queda', severity: 'medium', note: 'Média caiu de 5,4 para 3,6 entre as duas avaliações de Use of English.', handled: false },
  { id: 'oc-6', studentId: 't4b-4', date: '2026-03-24', kind: 'Uso de celular em prova', severity: 'medium', note: 'Consultou tradutor durante o reading test. Avaliação refeita na aula seguinte.', handled: true },
  { id: 'oc-7', studentId: 't2a-21', date: '2026-03-19', kind: 'Atrasos recorrentes', severity: 'light', note: 'Sexto atraso acima de quinze minutos no bimestre.', handled: true },
  { id: 'oc-8', studentId: 't4b-18', date: '2026-03-17', kind: 'Conversa em sala', severity: 'light', note: 'Conversa paralela durante o listening. Combinado feito com a turma.', handled: true },
  { id: 'oc-9', studentId: 't2a-13', date: '2026-03-12', kind: 'Speaking não realizado', severity: 'medium', note: 'Faltou à prova oral sem justificativa. Reagendada para 24 de março.', handled: true },
  { id: 'oc-10', studentId: 't4b-8', date: '2026-03-05', kind: 'Atrasos recorrentes', severity: 'light', note: 'Chega junto com o fim do warm-up desde o início do bimestre.', handled: false },
  { id: 'oc-11', studentId: 't2a-11', date: '2026-02-26', kind: 'Elogio em ata', severity: 'light', note: 'Assumiu a monitoria do grupo de conversação sem ser solicitada.', handled: true },
  { id: 'oc-12', studentId: 't4b-22', date: '2026-02-19', kind: 'Material incompleto', severity: 'light', note: 'Sem o workbook há três aulas. Responsável avisado pela secretaria.', handled: true },
]

/* ------------------------------------------------------------------ *
 * Chamada
 * ------------------------------------------------------------------ */

export interface RollCallState {
  turmaId: string
  date: string
  marks: Record<string, boolean>
  done: boolean
}

/* ------------------------------------------------------------------ *
 * O aluno que a demo mostra quando o perfil é "student"
 * ------------------------------------------------------------------ */

/** Escolhido de propósito logo acima do corte de aprovação, com uma
 *  habilidade em recuperação e uma tarefa vencendo: um painel de aluno
 *  perfeito não demonstra nada. */
export const DEMO_STUDENT_ID = 't2a-19' // Lucas Almeida Tavares

export function studentById(id: string): Student {
  return STUDENTS.find((s) => s.id === id) ?? STUDENTS[0]
}
