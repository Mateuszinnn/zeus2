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
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/classes', label: 'Classes', icon: BookOpen },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/grades', label: 'Grades', icon: GraduationCap },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/incidents', label: 'Incidents', icon: TriangleAlert },
  { to: '/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/enrollments', label: 'Enrollments', icon: FileText },
]

const STUDENT_NAV: NavItem[] = [
  { to: '/my-dashboard', label: 'My dashboard', icon: LayoutDashboard },
  { to: '/my-grades', label: 'My grades', icon: GraduationCap },
  { to: '/my-attendance', label: 'My attendance', icon: CalendarCheck },
  { to: '/my-incidents', label: 'My incidents', icon: TriangleAlert },
  { to: '/my-assignments', label: 'My assignments', icon: ClipboardList },
  { to: '/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/my-record', label: 'My record', icon: FileText },
]

const FOOTER_NAV: NavItem[] = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help', icon: CircleHelp },
  { to: '/contact', label: 'Contact', icon: MessageCircle },
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
          <Icon size={20} className={isActive ? 'text-accent-bright' : undefined} aria-hidden="true" />
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
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5 text-on-dark">
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

      <nav aria-label="Main navigation" className="scroll-on-dark flex-1 overflow-y-auto px-3">
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
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
