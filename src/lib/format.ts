/* Formatting for the interface language (en-US). Grades always carry one
 * decimal: "7" and "7.0" in the same column break the scan. */

export function grade(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function percent(value: number): string {
  return `${Math.round(value)}%`
}

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function shortDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return `${MONTH[d.getMonth()]} ${d.getDate()}`
}

/** Date carrying the year, for when it tells records apart — on an enrollment
 *  record, "Feb 5" of 2024 and of 2025 are different things. */
export function dateWithYear(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return `${MONTH[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export function weekday(iso: string): string {
  return WEEKDAY[new Date(`${iso}T12:00:00`).getDay()]
}

/** "today", "tomorrow", "in 3 days", "2 days ago" — deadlines are how both
 *  teacher and student actually think about dates. */
export function relativeDay(iso: string, today: string): string {
  const a = new Date(`${iso}T12:00:00`).getTime()
  const b = new Date(`${today}T12:00:00`).getTime()
  const days = Math.round((a - b) / 86_400_000)
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days === -1) return 'yesterday'
  if (days > 1) return `in ${days} days`
  return `${Math.abs(days)} days ago`
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
