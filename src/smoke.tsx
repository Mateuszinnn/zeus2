/* Smoke test: renders every route on the server and fails if any breaks.
 *
 * Build and typecheck only prove the code compiles. This proves each screen
 * actually renders, in both profiles. Run with `npm run smoke`.
 */

import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { SessionProvider, type Role } from '@/mocks/session'
import { ToastProvider } from '@/components/Toast'
import { AppRoutes } from '@/App'

const ROUTES: Record<Role, string[]> = {
  teacher: [
    '/dashboard',
    '/classes',
    '/students',
    '/grades',
    '/attendance',
    '/incidents',
    '/assignments',
    '/enrollments',
    '/announcements',
    '/settings',
    '/help',
    '/contact',
  ],
  student: [
    '/my-dashboard',
    '/my-grades',
    '/my-attendance',
    '/my-assignments',
    '/my-incidents',
    '/my-record',
    '/announcements',
  ],
}

const failures: string[] = []
let passed = 0

function check(label: string, role: Role | null, route: string) {
  try {
    const html = renderToString(
      <MemoryRouter initialEntries={[route]}>
        <SessionProvider initialRole={role}>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </SessionProvider>
      </MemoryRouter>,
    )
    // A redirect renders almost nothing; the real screen carries content.
    if (html.length < 400) {
      failures.push(`${label}: rendered ${html.length} bytes — probably redirected`)
      console.log(`  FAILED  ${label}`)
      return
    }
    passed += 1
    console.log(`  ok      ${label}`)
  } catch (error) {
    failures.push(`${label}: ${(error as Error).message}`)
    console.log(`  FAILED  ${label}`)
  }
}

console.log('No session')
check('/sign-in', null, '/sign-in')

for (const role of ['teacher', 'student'] as Role[]) {
  console.log(`\nProfile ${role}`)
  for (const route of ROUTES[role]) check(`${route}`, role, route)
}

/* Negative case: proves the guard above actually fails.
 * With no session the shell must redirect instead of rendering the screen — if
 * this passes as "ok", every positive case above is vacuous. */
console.log(String.fromCharCode(10) + 'Guard')
const semSessao = renderToString(
  <MemoryRouter initialEntries={['/dashboard']}>
    <SessionProvider initialRole={null}>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </SessionProvider>
  </MemoryRouter>,
)
if (semSessao.length >= 400) {
  failures.push('guard: /dashboard rendered with no session - the positive test is vacuous')
  console.log('  FAILED  /dashboard with no session should redirect')
} else {
  console.log('  ok      /dashboard redirects with no session')
}

const total = 1 + ROUTES.teacher.length + ROUTES.student.length
if (failures.length > 0) {
  console.error(`\n${failures.length} of ${total} routes broke:`)
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}
console.log(`\nAll ${passed} routes rendered.`)
