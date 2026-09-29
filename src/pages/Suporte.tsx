import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Toggle } from '@/components/Toggle'
import { Field, NativeSelect, ReadOnlyField, TextArea, TextInput } from '@/components/Field'
import { useToast } from '@/components/Toast'
import { delay } from '@/mocks/delay'
import { SCHOOL, TEACHER } from '@/mocks/data'
import { useSession } from '@/mocks/session'

/* As três telas do rodapé da faixa de navegação. Existem porque o menu as
 * oferece, e um item de menu que não leva a lugar nenhum quebra a demo. */

export function Configuracoes() {
  const { name, subtitle } = useSession()
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [reducedData, setReducedData] = useState(false)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  async function save() {
    setSaving(true)
    await delay()
    setSaving(false)
    toast('Preferências salvas.')
  }

  return (
    <>
      <PageHeader
        title="Configurações"
        subtitle="Preferências da sua conta no Zeus"
        crumbs={[{ label: 'Configurações' }]}
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader title="Conta" />
          <CardBody className="grid gap-6 sm:grid-cols-2">
            <ReadOnlyField label="Nome" value={name} />
            <ReadOnlyField label="Perfil" value={subtitle} />
            <ReadOnlyField label="Unidade" value={`${SCHOOL.name} · ${SCHOOL.course}`} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Notificações" />
          <ul className="divide-y divide-default">
            <SettingRow
              title="Avisar por e-mail"
              description="Receber um e-mail quando a coordenação publicar um aviso importante."
              checked={emailAlerts}
              onChange={setEmailAlerts}
            />
            <SettingRow
              title="Resumo semanal"
              description="Um resumo às sextas com as pendências da semana seguinte."
              checked={weeklyDigest}
              onChange={setWeeklyDigest}
            />
            <SettingRow
              title="Modo econômico"
              description="Carregar menos elementos visuais em conexões lentas."
              checked={reducedData}
              onChange={setReducedData}
            />
          </ul>
          <CardBody className="border-t border-default">
            <Button variant="primary" loading={saving} onClick={save}>
              Salvar preferências
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  )
}

function SettingRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <li className="flex items-start justify-between gap-6 px-6 py-4">
      <div className="min-w-0">
        <p className="text-body font-medium text-primary">{title}</p>
        <p className="mt-0.5 max-w-[60ch] text-caption text-muted">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </li>
  )
}

const FAQ = [
  {
    q: 'Como a média de inglês é calculada?',
    a: 'A média sai das cinco habilidades — Listening, Speaking, Reading, Writing e Use of English — com o mesmo peso para cada uma. Ela nunca é digitada diretamente: mude uma habilidade e a média se refaz.',
  },
  {
    q: 'Qual é a média de aprovação?',
    a: 'A média de aprovação é 5,0 e a frequência mínima é 75% das aulas do bimestre. Abaixo de 4,0 o aluno aparece como crítico na lista de atenção do painel.',
  },
  {
    q: 'Posso lançar nota direto na tabela?',
    a: 'Sim. Na tela de Notas, clique sobre a nota e edite ali mesmo. Aceita vírgula ou ponto, Enter confirma e Esc cancela.',
  },
  {
    q: 'O que acontece se eu errar a chamada?',
    a: 'Refaça a chamada do dia pela tela de Faltas. O histórico do bimestre é recalculado na hora.',
  },
]

export function Ajuda() {
  return (
    <>
      <PageHeader
        title="Ajuda"
        subtitle="As dúvidas que mais aparecem no dia a dia"
        crumbs={[{ label: 'Ajuda' }]}
      />
      <Card>
        <CardHeader title="Perguntas frequentes" />
        <ul className="divide-y divide-default">
          {FAQ.map((item) => (
            <li key={item.q} className="px-6 py-5">
              <h3 className="text-body font-medium text-primary">{item.q}</h3>
              <p className="mt-2 max-w-[65ch] text-body text-secondary">{item.a}</p>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

export function Contato() {
  const [subject, setSubject] = useState('duvida')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const toast = useToast()

  async function send() {
    if (message.trim().length < 10) {
      setError('Escreva um pouco mais para a secretaria entender o pedido.')
      return
    }
    setSending(true)
    await delay()
    setSending(false)
    toast('Mensagem enviada para a secretaria.')
    setMessage('')
    setError(null)
  }

  return (
    <>
      <PageHeader
        title="Contato"
        subtitle="Falar com a secretaria do CIL"
        crumbs={[{ label: 'Contato' }]}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Enviar uma mensagem" />
          <CardBody className="flex flex-col gap-5">
            <Field label="Assunto" required>
              {(props) => (
                <NativeSelect
                  {...props}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="duvida">Dúvida sobre o sistema</option>
                  <option value="matricula">Matrícula e rematrícula</option>
                  <option value="nota">Correção de nota ou frequência</option>
                  <option value="outro">Outro assunto</option>
                </NativeSelect>
              )}
            </Field>
            <Field label="Mensagem" required error={error ?? undefined}>
              {(props) => (
                <TextArea
                  {...props}
                  rows={6}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    setError(null)
                  }}
                />
              )}
            </Field>
            <Field label="Responder para">
              {(props) => (
                <TextInput {...props} defaultValue="helena.vasconcelos@cil.exemplo.br" />
              )}
            </Field>
            <div>
              <Button variant="primary" loading={sending} onClick={send}>
                Enviar
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Secretaria" />
          <CardBody className="flex flex-col gap-4">
            <Line icon={<MapPin size={16} />} label="Endereço" value={`${SCHOOL.name} — unidade de demonstração`} />
            <Line icon={<Phone size={16} />} label="Telefone" value="(61) 3000-0000" />
            <Line icon={<Mail size={16} />} label="E-mail" value="secretaria@cil.exemplo.br" />
            <Line
              icon={<Mail size={16} />}
              label="Coordenação de inglês"
              value={`${TEACHER.name} responde pela coordenação neste semestre`}
            />
            <p className="mt-2 text-caption text-muted">
              Dados de contato fictícios, usados apenas nesta demonstração.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}

function Line({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="text-label text-muted">{label}</p>
        <p className="mt-0.5 text-body text-primary">{value}</p>
      </div>
    </div>
  )
}
