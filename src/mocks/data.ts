/* Mock data — CIL, English course.
 *
 * One English teacher, two classes, 60 students. The grade and attendance
 * distribution is AUTHORED, not random, and calibrated to the CIL rule:
 * passing average 5.0 and minimum attendance 75%.
 *
 * None of this is real. No name matches an existing person and no figure
 * describes an existing CIL.
 *
 * Student, guardian and school names stay Brazilian on purpose: the interface
 * speaks English, the people in it do not stop being Brazilian.
 */

import { gradeLevel, attendanceLevel, type GradeLevel } from '@/lib/grade'

/* ------------------------------------------------------------------ *
 * Calendário da demo
 * ------------------------------------------------------------------ */

/** The demo runs on a Thursday. Fixed date: a system whose content shifts with
 *  the day of the presentation is impossible to rehearse. */
export const TODAY = '2026-04-09'
export const TERM = {
  current: 1,
  total: 2,
  label: 'Term 1 of 2 · First semester 2026',
  short: 'Term 1',
}

/* ------------------------------------------------------------------ *
 * Skills
 *
 * The English grade is made of the four skills plus use of English. This list
 * is the canonical order on every screen — reordering it in one place breaks
 * comparison across screens.
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
 * Classes
 *
 * Stages from 1A to 6B: the number is the stage and the letter is the semester
 * within it. 1–2 Basic, 3–4 Intermediate, 5–6 Advanced.
 * ------------------------------------------------------------------ */

export interface Turma {
  id: string
  /** "2A" */
  name: string
  /** "Basic" */
  stage: string
  shift: string
  /** Days and time the class meets. */
  schedule: string
}

export const TURMAS: Turma[] = [
  { id: 't2a', name: '2A', stage: 'Basic', shift: 'Morning', schedule: 'Tue & Thu · 7:30 am' },
  { id: 't4b', name: '4B', stage: 'Intermediate', shift: 'Afternoon', schedule: 'Tue & Thu · 2:00 pm' },
]

export const TEACHER = {
  id: 'prof-1',
  name: 'Helena Vasconcelos',
  role: 'English Teacher',
}

export const SCHOOL = {
  /* Proper noun: the institution keeps its Brazilian name. */
  name: 'Centro Interescolar de Línguas',
  short: 'CIL',
  course: 'English',
}

/* ------------------------------------------------------------------ *
 * Students
 *
 * [name, overall average, attendance %]. The curve is deliberate, against the
 * 5.0 passing cut: 16 excellent, 34 passing, 5 at risk, 5 critical.
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
  /** Term average, 0–10, composed from the five skills. */
  average: number
  /** Attendance percentage for the term. */
  attendance: number
  /** Grade per skill. */
  bySkill: Record<string, number>
}

/** Deterministic variation per student and skill: the same seed always returns
 *  the same grade, so the demo can be rehearsed. */
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

/** "2A · Basic" — the canonical class label outside the table. */
export function turmaLabel(turma: Turma): string {
  return `${turma.name} · ${turma.stage}`
}

/* ------------------------------------------------------------------ *
 * Distribution and attention
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

/** A student enters the list when below the passing average OR below minimum
 *  attendance. Worst case first. */
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
 * Announcements
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
    title: 'Re-enrollment for the second semester runs May 4 to 15',
    body: 'Students re-enroll in person at the front office, during their own class time. Anyone who misses the window competes for leftover seats in the open call.',
    author: 'CIL front office',
    date: '2026-04-08',
    priority: 'important',
    unread: true,
  },
  {
    id: 'av-2',
    title: 'Speaking tests for stages 4 to 6 in the week of April 20',
    body: 'Oral exams are taken in pairs, during the regular class slot. The panel is the class teacher plus one other teacher from the same stage.',
    author: 'English coordination',
    date: '2026-04-06',
    priority: 'normal',
    unread: true,
  },
  {
    id: 'av-3',
    title: 'Conversation club is open for sign-ups',
    body: 'Fridays, 4 to 5 pm, open to students from stage 3 onwards. Twenty seats per semester.',
    author: 'English coordination',
    date: '2026-04-02',
    priority: 'normal',
    unread: false,
  },
]

/* ------------------------------------------------------------------ *
 * Assignments
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
  { id: 'tf-1', title: 'Writing: an informal email to a friend', skillId: 'writing', turmaId: 't2a', due: '2026-04-07', submitted: 27, total: 30, graded: 0 },
  { id: 'tf-2', title: 'Use of English: past simple and past continuous', skillId: 'use', turmaId: 't2a', due: '2026-04-10', submitted: 18, total: 30, graded: 0 },
  { id: 'tf-3', title: 'Listening: interview about a work routine', skillId: 'listening', turmaId: 't4b', due: '2026-04-09', submitted: 24, total: 30, graded: 0 },
  { id: 'tf-4', title: 'Reading: article on climate change', skillId: 'reading', turmaId: 't4b', due: '2026-04-14', submitted: 6, total: 30, graded: 0 },
  { id: 'tf-5', title: 'Speaking: a talk about your own city', skillId: 'speaking', turmaId: 't2a', due: '2026-04-03', submitted: 30, total: 30, graded: 30 },
]

/* ------------------------------------------------------------------ *
 * Incidents
 * ------------------------------------------------------------------ */

export type Severity = 'light' | 'medium' | 'serious'

export interface Incident {
  id: string
  studentId: string
  date: string
  kind: string
  severity: Severity
  note: string
  /** Follow-up taken and recorded. */
  handled: boolean
}

export const INCIDENTS: Incident[] = [
  { id: 'oc-1', studentId: 't2a-17', date: '2026-04-07', kind: 'Consecutive absences', severity: 'serious', note: 'Fourth absence in a row with no excuse. At risk of losing the seat this semester.', handled: false },
  { id: 'oc-2', studentId: 't4b-18', date: '2026-04-06', kind: 'Missing assignments', severity: 'medium', note: 'Three Use of English assignments still open this term.', handled: false },
  { id: 'oc-3', studentId: 't2a-25', date: '2026-04-01', kind: 'Early dismissal', severity: 'light', note: 'Left at 8:40 am with guardian authorisation.', handled: true },
  { id: 'oc-4', studentId: 't4b-25', date: '2026-03-31', kind: 'Consecutive absences', severity: 'serious', note: 'Absent from five of the last eight classes. The front office contacted the home school.', handled: false },
  { id: 'oc-5', studentId: 't2a-8', date: '2026-03-26', kind: 'Falling performance', severity: 'medium', note: 'Average dropped from 5.4 to 3.6 between the two Use of English assessments.', handled: false },
  { id: 'oc-6', studentId: 't4b-4', date: '2026-03-24', kind: 'Phone use during a test', severity: 'medium', note: 'Used a translator during the reading test. Assessment retaken in the next class.', handled: true },
  { id: 'oc-7', studentId: 't2a-21', date: '2026-03-19', kind: 'Repeated lateness', severity: 'light', note: 'Sixth arrival more than fifteen minutes late this term.', handled: true },
  { id: 'oc-8', studentId: 't4b-18', date: '2026-03-17', kind: 'Talking in class', severity: 'light', note: 'Side conversation during the listening task. Agreement made with the class.', handled: true },
  { id: 'oc-9', studentId: 't2a-13', date: '2026-03-12', kind: 'Missed speaking test', severity: 'medium', note: 'Missed the oral exam with no excuse. Rescheduled for March 24.', handled: true },
  { id: 'oc-10', studentId: 't4b-8', date: '2026-03-05', kind: 'Repeated lateness', severity: 'light', note: 'Has been arriving as the warm-up ends since the term started.', handled: false },
  { id: 'oc-11', studentId: 't2a-11', date: '2026-02-26', kind: 'Commendation', severity: 'light', note: 'Took over as mentor for the conversation group without being asked.', handled: true },
  { id: 'oc-12', studentId: 't4b-22', date: '2026-02-19', kind: 'Incomplete materials', severity: 'light', note: 'Without the workbook for three classes. Guardian notified by the front office.', handled: true },
]

/* ------------------------------------------------------------------ *
 * Roll call
 * ------------------------------------------------------------------ */

export interface RollCallState {
  turmaId: string
  date: string
  marks: Record<string, boolean>
  done: boolean
}

/* ------------------------------------------------------------------ *
 * The student the demo shows when the profile is "student"
 * ------------------------------------------------------------------ */

/** Chosen deliberately just above the passing cut, with one skill at risk and
 *  one assignment coming due: a flawless student dashboard demonstrates
 *  nothing. */
export const DEMO_STUDENT_ID = 't2a-19' // Lucas Almeida Tavares

export function studentById(id: string): Student {
  return STUDENTS.find((s) => s.id === id) ?? STUDENTS[0]
}
