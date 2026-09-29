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

/* The three screens in the navigation footer. They exist because the menu
 * offers them, and a menu item that leads nowhere breaks the demo. */

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
    toast('Preferences saved.')
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Preferences for your Zeus account"
        crumbs={[{ label: 'Settings' }]}
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader title="Account" />
          <CardBody className="grid gap-6 sm:grid-cols-2">
            <ReadOnlyField label="Name" value={name} />
            <ReadOnlyField label="Profile" value={subtitle} />
            <ReadOnlyField label="Unit" value={`${SCHOOL.name} · ${SCHOOL.course}`} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Notifications" />
          <ul className="divide-y divide-default">
            <SettingRow
              title="Email me"
              description="Get an email when the coordination posts an important announcement."
              checked={emailAlerts}
              onChange={setEmailAlerts}
            />
            <SettingRow
              title="Weekly digest"
              description="A Friday digest of what is pending for the week ahead."
              checked={weeklyDigest}
              onChange={setWeeklyDigest}
            />
            <SettingRow
              title="Data saver"
              description="Load fewer visual elements on slow connections."
              checked={reducedData}
              onChange={setReducedData}
            />
          </ul>
          <CardBody className="border-t border-default">
            <Button variant="primary" loading={saving} onClick={save}>
              Save preferences
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
    q: 'How is the English average calculated?',
    a: 'The average comes from the five skills — Listening, Speaking, Reading, Writing and Use of English — each weighted the same. It is never typed directly: change one skill and the average is recomputed.',
  },
  {
    q: 'What is the passing average?',
    a: 'The passing average is 5.0 and minimum attendance is 75% of the classes in the term. Below 4.0 a student shows up as critical in the attention list on the dashboard.',
  },
  {
    q: 'Can I enter grades straight into the table?',
    a: 'Yes. On the Grades screen, click the grade and edit it in place. It accepts a comma or a dot, Enter confirms and Esc cancels.',
  },
  {
    q: 'What if I get the roll call wrong?',
    a: 'Take the roll call again from the Attendance screen. The term history is recomputed immediately.',
  },
]

export function Ajuda() {
  return (
    <>
      <PageHeader
        title="Help"
        subtitle="The questions that come up most day to day"
        crumbs={[{ label: 'Help' }]}
      />
      <Card>
        <CardHeader title="Frequently asked questions" />
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
  const [subject, setSubject] = useState('question')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const toast = useToast()

  async function send() {
    if (message.trim().length < 10) {
      setError('Write a little more so the front office can understand the request.')
      return
    }
    setSending(true)
    await delay()
    setSending(false)
    toast('Message sent to the front office.')
    setMessage('')
    setError(null)
  }

  return (
    <>
      <PageHeader
        title="Accountct"
        subtitle="Get in touch with the CIL front office"
        crumbs={[{ label: 'Accountct' }]}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Send a message" />
          <CardBody className="flex flex-col gap-5">
            <Field label="Subject" required>
              {(props) => (
                <NativeSelect
                  {...props}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="question">Question about the system</option>
                  <option value="enrollment">Enrollment and re-enrollment</option>
                  <option value="grade">Grade or attendance correction</option>
                  <option value="other">Other</option>
                </NativeSelect>
              )}
            </Field>
            <Field label="Message" required error={error ?? undefined}>
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
            <Field label="Reply to">
              {(props) => (
                <TextInput {...props} defaultValue="helena.vasconcelos@cil.example.br" />
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
          <CardHeader title="Front office" />
          <CardBody className="flex flex-col gap-4">
            <Line icon={<MapPin size={16} />} label="Address" value={`${SCHOOL.name} — demonstration unit`} />
            <Line icon={<Phone size={16} />} label="Phone" value="(61) 3000-0000" />
            <Line icon={<Mail size={16} />} label="E-mail" value="frontoffice@cil.example.br" />
            <Line
              icon={<Mail size={16} />}
              label="English coordination"
              value={`${TEACHER.name} is acting coordinator this semester`}
            />
            <p className="mt-2 text-caption text-muted">
              Fictional contact details, used for this demonstration only.
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
