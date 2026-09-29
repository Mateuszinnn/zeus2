/* A regra de faixa de desempenho do sistema.
 *
 * Fonte ÚNICA. Nenhum componente recalcula limiar nem escolhe cor de nota —
 * barras, pílulas, listas e distribuições passam todas por aqui.
 *
 * Referência: docs/superpowers/specs/2026-09-28-design-system-design.md §3
 */

export type GradeLevel = 'excellent' | 'adequate' | 'attention' | 'critical'

/** Média de aprovação no CIL. */
export const PASSING_GRADE = 5
/** Frequência mínima legal. */
export const MIN_ATTENDANCE = 75

interface LevelStyle {
  /** Preenchimento da barra e ponto de legenda. */
  fill: string
  /** Fundo suave da pílula. */
  soft: string
  /** Texto sobre o fundo suave. */
  ink: string
  /** Rótulo textual. A cor nunca viaja sozinha. */
  label: string
}

const STYLES: Record<GradeLevel, LevelStyle> = {
  excellent: { fill: 'bg-success', soft: 'bg-success-soft', ink: 'text-success-ink', label: 'Excellent' },
  adequate: { fill: 'bg-accent', soft: 'bg-accent-soft', ink: 'text-accent-ink', label: 'Passing' },
  attention: { fill: 'bg-warning', soft: 'bg-warning-soft', ink: 'text-warning-ink', label: 'At risk' },
  critical: { fill: 'bg-error', soft: 'bg-error-soft', ink: 'text-error-ink', label: 'Critical' },
}

/** Nota de 0 a 10. Cortes em 8,5 · 5,0 · 4,0.
 *
 *  Os cortes saem da regra institucional, não do gosto: 5,0 é a média de
 *  aprovação do CIL, e 4,0 marca quem está abaixo mas ao alcance de
 *  recuperar. Abaixo disso o problema deixou de ser de nota. */
export function gradeLevel(score: number): GradeLevel {
  if (score >= 8.5) return 'excellent'
  if (score >= PASSING_GRADE) return 'adequate'
  if (score >= 4) return 'attention'
  return 'critical'
}

/** Percentual de presença. Corte de aprovação em 75%. */
export function attendanceLevel(percent: number): GradeLevel {
  if (percent >= 90) return 'excellent'
  if (percent >= MIN_ATTENDANCE) return 'adequate'
  if (percent >= 60) return 'attention'
  return 'critical'
}

export function levelStyle(level: GradeLevel): LevelStyle {
  return STYLES[level]
}

export function gradeLabel(level: GradeLevel): string {
  return STYLES[level].label
}

/** Ordem de severidade, do pior para o melhor. Ordena listas de atenção. */
export const LEVELS_BY_SEVERITY: GradeLevel[] = ['critical', 'attention', 'adequate', 'excellent']

export function isConcerning(level: GradeLevel): boolean {
  return level === 'critical' || level === 'attention'
}
