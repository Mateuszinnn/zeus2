/* Registros derivados: aulas e faltas, entregas de tarefa e ficha de matrícula.
 *
 * Tudo é derivado de forma DETERMINÍSTICA dos alunos em data.ts, para que a
 * demo seja ensaiável: a mesma tela mostra sempre os mesmos números, e a
 * frequência que aparece na lista de faltas bate com o percentual do painel.
 */

import { ASSIGNMENTS, STUDENTS, TODAY, TURMAS, studentsOf, type Student } from './data'

/* ------------------------------------------------------------------ *
 * Aulas do bimestre — terças e quintas, de fevereiro até hoje
 * ------------------------------------------------------------------ */

function sessionDates(): string[] {
  const dates: string[] = []
  const cursor = new Date('2026-02-03T12:00:00') // primeira terça do semestre
  const end = new Date(`${TODAY}T12:00:00`)
  while (cursor <= end) {
    const day = cursor.getDay()
    if (day === 2 || day === 4) dates.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

export const SESSIONS = sessionDates()

function hash(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 100003
  return h
}

export type AbsenceKind = 'justified' | 'unjustified'

export interface Absence {
  studentId: string
  date: string
  kind: AbsenceKind
}

/** Distribui as faltas de cada aluno pelas aulas do bimestre, na quantidade
 *  exata que o percentual de frequência exige. */
function buildAbsences(): Absence[] {
  const total = SESSIONS.length
  const out: Absence[] = []
  for (const student of STUDENTS) {
    const missed = Math.round(total * (1 - student.attendance / 100))
    // Espalha as ausências pelo bimestre em vez de agrupá-las no começo.
    const picked = new Set<number>()
    let step = 0
    while (picked.size < missed && step < total * 3) {
      const index = (hash(`${student.id}:${step}`) + step * 7) % total
      picked.add(index)
      step += 1
    }
    for (const index of picked) {
      out.push({
        studentId: student.id,
        date: SESSIONS[index],
        // Cerca de um terço das faltas vem com atestado ou bilhete.
        kind: hash(`${student.id}:${index}:j`) % 3 === 0 ? 'justified' : 'unjustified',
      })
    }
  }
  return out
}

export const ABSENCES: Absence[] = buildAbsences()

export function absencesOf(studentId: string): Absence[] {
  return ABSENCES.filter((a) => a.studentId === studentId).sort((a, b) =>
    b.date.localeCompare(a.date),
  )
}

export interface AttendanceSummary {
  student: Student
  present: number
  total: number
  absences: number
  justified: number
  percent: number
}

export function attendanceSummary(students: Student[]): AttendanceSummary[] {
  const total = SESSIONS.length
  return students.map((student) => {
    const mine = ABSENCES.filter((a) => a.studentId === student.id)
    return {
      student,
      total,
      absences: mine.length,
      justified: mine.filter((a) => a.kind === 'justified').length,
      present: total - mine.length,
      percent: student.attendance,
    }
  })
}

/* ------------------------------------------------------------------ *
 * Entregas de tarefa
 * ------------------------------------------------------------------ */

export type SubmissionState = 'submitted' | 'late' | 'missing' | 'graded'

export interface Submission {
  assignmentId: string
  studentId: string
  state: SubmissionState
  score?: number
  submittedAt?: string
}

function buildSubmissions(): Submission[] {
  const out: Submission[] = []
  for (const assignment of ASSIGNMENTS) {
    const roster = studentsOf(assignment.turmaId)
    const graded = assignment.graded === assignment.total
    roster.forEach((student, i) => {
      const entregou = i < assignment.submitted
      if (!entregou) {
        out.push({ assignmentId: assignment.id, studentId: student.id, state: 'missing' })
        return
      }
      const atrasou = hash(`${assignment.id}:${student.id}`) % 7 === 0
      out.push({
        assignmentId: assignment.id,
        studentId: student.id,
        state: graded ? 'graded' : atrasou ? 'late' : 'submitted',
        score: graded ? student.bySkill[assignment.skillId] : undefined,
        submittedAt: assignment.due,
      })
    })
  }
  return out
}

export const SUBMISSIONS: Submission[] = buildSubmissions()

export function submissionsOf(assignmentId: string): Submission[] {
  return SUBMISSIONS.filter((s) => s.assignmentId === assignmentId)
}

export function submissionFor(assignmentId: string, studentId: string): Submission | undefined {
  return SUBMISSIONS.find((s) => s.assignmentId === assignmentId && s.studentId === studentId)
}

/* ------------------------------------------------------------------ *
 * Ficha de matrícula
 *
 * O CIL é contraturno: o aluno tem uma escola de origem, e isso é um campo
 * de primeira classe na ficha, não observação.
 * ------------------------------------------------------------------ */

export type EnrollmentStatus = 'active' | 'locked' | 'transferred'

export interface Enrollment {
  studentId: string
  status: EnrollmentStatus
  since: string
  birthDate: string
  guardian: string
  guardianPhone: string
  email: string
  originSchool: string
  neighborhood: string
  shiftAtOrigin: string
}

const ORIGIN_SCHOOLS = [
  'CEF 01 do Cruzeiro',
  'CED 02 do Guará',
  'CEM Setor Leste',
  'CEF 104 Norte',
  'CED GISNO',
  'CEF Polivalente',
]

const NEIGHBORHOODS = ['Asa Norte', 'Asa Sul', 'Cruzeiro', 'Guará', 'Sudoeste', 'Lago Norte']

function buildEnrollments(): Enrollment[] {
  return STUDENTS.map((student, i) => {
    const h = hash(student.id)
    // A grande maioria está ativa; poucos trancados ou transferidos, para que
    // o filtro de situação tenha o que filtrar.
    const status: EnrollmentStatus =
      h % 23 === 0 ? 'transferred' : h % 17 === 0 ? 'locked' : 'active'
    const year = 2009 + (h % 6)
    const month = String((h % 12) + 1).padStart(2, '0')
    const day = String((h % 27) + 1).padStart(2, '0')
    const first = student.name.split(' ')[0].toLowerCase()
    const last = student.name.split(' ').slice(-1)[0].toLowerCase()
    return {
      studentId: student.id,
      status,
      since: i % 2 === 0 ? '2024-02-05' : '2025-08-04',
      birthDate: `${year}-${month}-${day}`,
      guardian: GUARDIANS[h % GUARDIANS.length],
      guardianPhone: `(61) 9${String(8000 + (h % 1999)).slice(0, 4)}-${String(1000 + (h % 8999)).slice(0, 4)}`,
      email: `${first}.${last}@aluno.exemplo.br`,
      originSchool: ORIGIN_SCHOOLS[h % ORIGIN_SCHOOLS.length],
      neighborhood: NEIGHBORHOODS[h % NEIGHBORHOODS.length],
      shiftAtOrigin: TURMAS.find((t) => t.id === student.turmaId)?.shift === 'Manhã' ? 'Tarde' : 'Manhã',
    }
  })
}

const GUARDIANS = [
  'Marta Lima de Souza',
  'Roberto Nogueira Pinto',
  'Cláudia Carvalho Dias',
  'Sérgio Fernandes Rocha',
  'Vera Souza Moreira',
  'Paulo Andrade Nunes',
  'Regina Ramos Teixeira',
  'Antônio Gabriel Martins',
]

export const ENROLLMENTS: Enrollment[] = buildEnrollments()

export function enrollmentOf(studentId: string): Enrollment {
  return ENROLLMENTS.find((e) => e.studentId === studentId) ?? ENROLLMENTS[0]
}

export const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  active: 'Ativa',
  locked: 'Trancada',
  transferred: 'Transferida',
}
