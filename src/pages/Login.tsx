import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { ZeusMark } from '@/components/ZeusMark'
import { cn } from '@/lib/cn'
import { useSession, type Role } from '@/mocks/session'

/* A única tela sem o shell.
 *
 * Qualquer credencial entra: não há autenticação. O seletor de perfil abaixo do
 * formulário é o que permite alternar entre professor e aluno ao vivo, durante
 * a apresentação, sem tela de administração. */

const ROLES: { id: Role; label: string; hint: string }[] = [
  { id: 'teacher', label: 'Professora', hint: 'Helena Vasconcelos · 5º ano' },
  { id: 'student', label: 'Aluno', hint: 'Lucas Almeida Tavares · 5º A' },
]

export function Login() {
  const [email, setEmail] = useState('helena.vasconcelos@escola.edu.br')
  const [password, setPassword] = useState('demonstracao')
  const [role, setRole] = useState<Role>('teacher')
  const [busy, setBusy] = useState(false)
  const { signIn } = useSession()
  const navigate = useNavigate()

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    await new Promise((r) => setTimeout(r, 450))
    signIn(role)
    navigate(role === 'student' ? '/meu-painel' : '/painel', { replace: true })
  }

  return (
    <div className="flex min-h-dvh bg-app">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <form onSubmit={submit} className="w-full max-w-100">
          <span className="flex items-center gap-2.5">
            <ZeusMark size={36} />
            <span className="text-h2 text-primary">Zeus</span>
          </span>

          <h1 className="mt-8 text-display text-primary">Entrar</h1>
          <p className="mt-1 text-body text-secondary">
            Gestão escolar do 5º ano: notas, frequência, tarefas e matrícula.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            <Field
              id="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="username"
            />
            <Field
              id="senha"
              label="Senha"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />

            <label className="flex items-center gap-2 text-body text-secondary">
              <input
                type="checkbox"
                defaultChecked
                className="size-4 rounded-sm border-default text-accent"
              />
              Lembrar-me
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={busy}
            className="mt-6 w-full"
          >
            Entrar
          </Button>

          <fieldset className="mt-8 border-t border-default pt-6">
            <legend className="sr-only">Escolher perfil da sessão</legend>
            <p className="text-label text-secondary">Entrar como</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {ROLES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={role === option.id}
                  onClick={() => setRole(option.id)}
                  className={cn(
                    'rounded-md border p-3 text-left transition-colors duration-150 ease-expo',
                    role === option.id
                      ? 'border-accent bg-accent-soft'
                      : 'border-default bg-surface hover:border-strong',
                  )}
                >
                  <span className="block text-body font-medium text-primary">{option.label}</span>
                  <span className="mt-0.5 block text-caption text-muted">{option.hint}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-caption text-muted">
              Demonstração: qualquer credencial entra, e o perfil escolhido define o que o sistema
              mostra.
            </p>
          </fieldset>
        </form>
      </div>

      {/* O bloco de identidade só aparece onde sobra largura para ele. */}
      <div className="relative hidden flex-1 overflow-hidden bg-purple-700 lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <ZeusMark size={340} className="opacity-15" />
        </div>
        <div className="absolute right-12 bottom-12 left-12">
          <p className="text-h2 text-on-dark text-balance">
            O dia inteiro da turma em uma tela — chamada, notas, tarefas e avisos.
          </p>
        </div>
      </div>
    </div>
  )
}

interface FieldProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (next: string) => void
  autoComplete?: string
}

function Field({ id, label, type, value, onChange, autoComplete }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-label text-primary">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'mt-1.5 h-10 w-full rounded-md border border-default bg-surface px-3',
          'text-body text-primary placeholder:text-disabled',
          'transition-colors duration-150 ease-expo hover:border-strong',
        )}
      />
    </div>
  )
}
