import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DEMO_STUDENT_ID, TEACHER, studentById, turmaOf } from './data'

/* Sessão mockada. Não há autenticação: o login aceita qualquer credencial e o
 * seletor de perfil define quem está usando o sistema. É o que permite
 * alternar entre a visão do professor e a do aluno ao vivo, durante a
 * apresentação, sem tela de administração. */

export type Role = 'teacher' | 'student'

interface Session {
  role: Role | null
  name: string
  subtitle: string
  signIn: (role: Role) => void
  signOut: () => void
}

const SessionContext = createContext<Session | null>(null)

export function useSession(): Session {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession precisa estar dentro de <SessionProvider>')
  return ctx
}

export function SessionProvider({
  children,
  initialRole = null,
}: {
  children: ReactNode
  /** Sessão já aberta. Usado pelo teste de fumaça e por deep link. */
  initialRole?: Role | null
}) {
  const [role, setRole] = useState<Role | null>(initialRole)

  const signIn = useCallback((next: Role) => setRole(next), [])
  const signOut = useCallback(() => setRole(null), [])

  const value = useMemo<Session>(() => {
    if (role === 'student') {
      const student = studentById(DEMO_STUDENT_ID)
      return {
        role,
        name: student.name,
        subtitle: `Aluno · ${turmaOf(student).name}`,
        signIn,
        signOut,
      }
    }
    return {
      role,
      name: TEACHER.name,
      subtitle: TEACHER.role,
      signIn,
      signOut,
    }
  }, [role, signIn, signOut])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
