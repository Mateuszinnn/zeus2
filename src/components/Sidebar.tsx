import { NavLink } from 'react-router-dom'
import {
  BookOpen,
  CalendarCheck,
  CircleHelp,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageCircle,
  Settings,
  TriangleAlert,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useSession, type Role } from '@/mocks/session'
import { ZeusMark } from './ZeusMark'
import { Avatar } from './Avatar'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const TEACHER_NAV: NavItem[] = [
  { to: '/painel', label: 'Painel', icon: LayoutDashboard },
  { to: '/turmas', label: 'Turmas', icon: BookOpen },
  { to: '/alunos', label: 'Alunos', icon: Users },
  { to: '/notas', label: 'Notas', icon: GraduationCap },
  { to: '/faltas', label: 'Faltas', icon: CalendarCheck },
  { to: '/ocorrencias', label: 'Ocorrências', icon: TriangleAlert },
  { to: '/tarefas', label: 'Tarefas', icon: ClipboardList },
  { to: '/avisos', label: 'Avisos', icon: Megaphone },
  { to: '/matriculas', label: 'Matrículas', icon: FileText },
]

const STUDENT_NAV: NavItem[] = [
  { to: '/meu-painel', label: 'Meu painel', icon: LayoutDashboard },
  { to: '/minhas-notas', label: 'Minhas notas', icon: GraduationCap },
  { to: '/minhas-faltas', label: 'Minhas faltas', icon: CalendarCheck },
  { to: '/minhas-ocorrencias', label: 'Minhas ocorrências', icon: TriangleAlert },
  { to: '/minhas-tarefas', label: 'Minhas tarefas', icon: ClipboardList },
  { to: '/avisos', label: 'Avisos', icon: Megaphone },
  { to: '/minha-ficha', label: 'Minha ficha', icon: FileText },
]

const FOOTER_NAV: NavItem[] = [
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
  { to: '/ajuda', label: 'Ajuda', icon: CircleHelp },
  { to: '/contato', label: 'Contato', icon: MessageCircle },
]

export function navFor(role: Role): NavItem[] {
  return role === 'student' ? STUDENT_NAV : TEACHER_NAV
}

function Item({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex h-10 items-center gap-2.5 rounded-md px-3 text-body transition-colors duration-150 ease-expo',
          isActive
            ? 'bg-sidebar-active text-on-dark'
            : 'text-on-dark-muted hover:bg-sidebar-active/50 hover:text-on-dark',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={20} className={isActive ? 'text-purple-400' : undefined} aria-hidden="true" />
          {item.label}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role, name, subtitle, signOut } = useSession()
  const items = navFor(role ?? 'teacher')

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <ZeusMark size={28} />
        <span className="text-h2 text-on-dark">Zeus</span>
      </div>

      <div className="mx-3 flex items-center gap-3 rounded-md px-2 py-2">
        <Avatar name={name} size="lg" />
        <span className="min-w-0">
          <span className="block truncate text-body font-medium text-on-dark">{name}</span>
          <span className="block truncate text-caption text-on-dark-muted">{subtitle}</span>
        </span>
      </div>

      <div className="mx-5 my-4 h-px bg-sidebar-active" />

      <nav aria-label="Navegação principal" className="scroll-on-dark flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.to}>
              <Item item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 pt-4 pb-5">
        <ul className="flex flex-col gap-1">
          {FOOTER_NAV.map((item) => (
            <li key={item.to}>
              <Item item={item} onNavigate={onNavigate} />
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={signOut}
              className={cn(
                'flex h-10 w-full items-center gap-2.5 rounded-md px-3 text-body',
                'text-on-dark-muted transition-colors duration-150 ease-expo',
                'hover:bg-sidebar-active/50 hover:text-on-dark',
              )}
            >
              <LogOut size={20} aria-hidden="true" />
              Sair
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
