import { useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/Button'
import { Avatar } from '@/components/Avatar'
import { Toggle } from '@/components/Toggle'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/cn'
import { plural } from '@/lib/format'
import { delay } from '@/mocks/delay'
import { studentsOf, type Turma } from '@/mocks/data'

/* The signature interaction.
 *
 * The pending card unfolds RIGHT HERE into the whole class. No modal, no other
 * route: reading and acting are two modes of the same object. */

interface RollCallPanelProps {
  turma: Turma
  onClose: () => void
  onSaved: () => void
}

export function RollCallPanel({ turma, onClose, onSaved }: RollCallPanelProps) {
  const students = useMemo(() => studentsOf(turma.id), [turma.id])
  const [marks, setMarks] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const marked = Object.keys(marks).length
  const present = Object.values(marks).filter(Boolean).length
  const absent = marked - present
  const remaining = students.length - marked

  function set(id: string, value: boolean) {
    setMarks((prev) => ({ ...prev, [id]: value }))
  }

  function markAllPresent() {
    setMarks(Object.fromEntries(students.map((s) => [s.id, true])))
  }

  async function save() {
    setSaving(true)
    await delay()
    setSaving(false)
    toast(
      absent === 0
        ? `Roll call for ${turma.name} saved. Full attendance.`
        : `Roll call for ${turma.name} saved. ${plural(absent, 'student absent', 'students absent')}.`,
    )
    onSaved()
  }

  return (
    <div className="rounded-xl border border-accent bg-surface shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-default px-6 py-5">
        <div className="flex items-baseline gap-3">
          <h3 className="text-h3 text-primary">Roll call · {turma.name}</h3>
          <span className="text-caption text-muted">
            {remaining > 0
              ? `${plural(remaining, 'student not marked', 'students not marked')}`
              : `${present} present · ${absent} absent`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={markAllPresent}>
            Mark all present
          </Button>
          <Button
            size="sm"
            variant="primary"
            loading={saving}
            disabled={marked === 0}
            onClick={save}
          >
            Save roll call
          </Button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close roll call"
            className="rounded-md p-2 text-muted transition-colors hover:bg-gray-20 hover:text-primary"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      <ul className="grid grid-cols-1 gap-x-6 p-3 sm:grid-cols-2 xl:grid-cols-3">
        {students.map((student) => {
          const state = marks[student.id]
          const unmarked = state === undefined
          return (
            <li
              key={student.id}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-150 ease-expo',
                'hover:bg-surface-alt',
              )}
            >
              <Avatar name={student.name} size="md" />
              <span className="min-w-0 flex-1 truncate text-body font-medium text-primary">
                {student.name}
              </span>
              <span
                className={cn(
                  'w-16 shrink-0 text-right text-caption',
                  unmarked ? 'text-disabled' : state ? 'text-success-ink' : 'text-error-ink',
                )}
              >
                {unmarked ? 'not marked' : state ? 'present' : 'absent'}
              </span>
              <Toggle
                checked={state === true}
                indeterminate={unmarked}
                onChange={(next) => set(student.id, next)}
                label={`${student.name}: mark present`}
              />
            </li>
          )
        })}
      </ul>

      <footer className="flex items-center gap-2 border-t border-default px-6 py-4 text-caption text-muted">
        <Check size={14} className="text-success" aria-hidden="true" />
        {present} present · {absent} absent · {remaining} not marked
      </footer>
    </div>
  )
}
