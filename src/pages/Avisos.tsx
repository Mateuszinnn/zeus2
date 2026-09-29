import { useEffect, useState } from 'react'
import { MegaphoneOff, Plus } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { Field, NativeSelect, TextArea, TextInput } from '@/components/Field'
import { useToast } from '@/components/Toast'
import { cn } from '@/lib/cn'
import { shortDate } from '@/lib/format'
import { delay } from '@/mocks/delay'
import { ANNOUNCEMENTS, TEACHER, type Announcement, type Priority } from '@/mocks/data'
import { useSession } from '@/mocks/session'

/* Tela compartilhada: o aluno lê, o professor também publica. */

export function Avisos() {
  const { role } = useSession()
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<Announcement[]>(ANNOUNCEMENTS)
  const [composing, setComposing] = useState(false)

  useEffect(() => {
    let alive = true
    delay().then(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const unread = list.filter((a) => a.unread).length

  return (
    <>
      <PageHeader
        title="Avisos"
        subtitle="Comunicados da secretaria e da coordenação de inglês"
        crumbs={[
          { label: 'Painel', to: role === 'student' ? '/meu-painel' : '/painel' },
          { label: 'Avisos' },
        ]}
      />

      <Card>
        <CardHeader
          title="Todos os comunicados"
          meta={
            <span className="text-caption text-muted">
              {list.length} avisos · {unread} não lidos
            </span>
          }
          actions={
            role === 'teacher' ? (
              <Button variant="primary" icon={<Plus size={16} />} onClick={() => setComposing(true)}>
                Novo aviso
              </Button>
            ) : undefined
          }
        />

        {loading ? (
          <div className="flex flex-col gap-3 p-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-24 rounded-lg" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={<MegaphoneOff size={40} />}
            title="Nenhum comunicado publicado"
            description="Quando a secretaria ou a coordenação publicar algo, aparece aqui."
          />
        ) : (
          <ul className="divide-y divide-default">
            {list.map((announcement) => (
              <li key={announcement.id} className="px-6 py-5">
                <div className="flex items-start gap-2">
                  {announcement.unread && (
                    <span
                      className="mt-2 size-2 shrink-0 rounded-full bg-accent"
                      aria-label="Não lido"
                    />
                  )}
                  <div className={cn('min-w-0 flex-1', !announcement.unread && 'pl-4')}>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-h3 text-primary">{announcement.title}</h3>
                      {announcement.priority === 'important' && (
                        <StatusBadge tone="warning">Importante</StatusBadge>
                      )}
                    </div>
                    <p className="mt-2 max-w-[65ch] text-body text-secondary">
                      {announcement.body}
                    </p>
                    <p className="mt-3 text-caption text-muted">
                      {announcement.author} · {shortDate(announcement.date)}
                    </p>
                  </div>
                  {announcement.unread && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setList((prev) =>
                          prev.map((a) =>
                            a.id === announcement.id ? { ...a, unread: false } : a,
                          ),
                        )
                      }
                    >
                      Marcar como lido
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <NewAnnouncement
        open={composing}
        onClose={() => setComposing(false)}
        onCreate={(announcement) => setList((prev) => [announcement, ...prev])}
      />
    </>
  )
}

function NewAnnouncement({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (announcement: Announcement) => void
}) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  async function save() {
    if (title.trim() === '') {
      setError('O aviso precisa de um título que se entenda na lista.')
      return
    }
    setSaving(true)
    await delay()
    onCreate({
      id: `av-${Date.now()}`,
      title: title.trim(),
      body: body.trim() || 'Sem detalhes adicionais.',
      author: TEACHER.name,
      date: new Date().toISOString().slice(0, 10),
      priority,
      unread: true,
    })
    setSaving(false)
    toast('Aviso publicado para as suas turmas.')
    setTitle('')
    setBody('')
    setError(null)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo aviso"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" loading={saving} onClick={save}>
            Publicar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Field label="Título" required error={error ?? undefined}>
          {(props) => (
            <TextInput
              {...props}
              data-autofocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError(null)
              }}
            />
          )}
        </Field>
        <Field label="Mensagem" hint="Escreva como falaria com a turma.">
          {(props) => (
            <TextArea
              {...props}
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          )}
        </Field>
        <Field label="Prioridade">
          {(props) => (
            <NativeSelect
              {...props}
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="normal">Normal</option>
              <option value="important">Importante</option>
            </NativeSelect>
          )}
        </Field>
      </div>
    </Modal>
  )
}
