/** Formatação em português do Brasil. Nota sempre com uma casa decimal:
 *  "7" e "7,0" na mesma coluna desalinham a leitura. */

export function grade(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function percent(value: number): string {
  return `${Math.round(value)}%`
}

const WEEKDAY = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const MONTH = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function shortDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return `${d.getDate()} ${MONTH[d.getMonth()]}`
}

export function weekday(iso: string): string {
  return WEEKDAY[new Date(`${iso}T12:00:00`).getDay()]
}

/** "hoje", "amanhã", "em 3 dias", "há 2 dias" — a linguagem do prazo,
 *  que é como professor e aluno realmente pensam sobre data. */
export function relativeDay(iso: string, today: string): string {
  const a = new Date(`${iso}T12:00:00`).getTime()
  const b = new Date(`${today}T12:00:00`).getTime()
  const days = Math.round((a - b) / 86_400_000)
  if (days === 0) return 'hoje'
  if (days === 1) return 'amanhã'
  if (days === -1) return 'ontem'
  if (days > 1) return `em ${days} dias`
  return `há ${Math.abs(days)} dias`
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter((p) => p.length > 2)
  const first = parts[0] ?? name
  const last = parts.length > 1 ? parts[parts.length - 1] : ''
  return ((first[0] ?? '') + (last[0] ?? '')).toUpperCase()
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0]
}

export function plural(n: number, one: string, many: string): string {
  return n === 1 ? `${n} ${one}` : `${n} ${many}`
}
