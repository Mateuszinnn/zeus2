/* Teste de fumaça: renderiza cada rota no servidor e falha se alguma quebrar.
 *
 * Build e typecheck só provam que o código compila. Isto prova que cada tela
 * renderiza de verdade, nos dois perfis. Rode com `npm run smoke`.
 */

import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { SessionProvider, type Role } from '@/mocks/session'
import { ToastProvider } from '@/components/Toast'
import { AppRoutes } from '@/App'

const ROUTES: Record<Role, string[]> = {
  teacher: [
    '/painel',
    '/turmas',
    '/alunos',
    '/notas',
    '/faltas',
    '/ocorrencias',
    '/tarefas',
    '/matriculas',
    '/avisos',
    '/configuracoes',
    '/ajuda',
    '/contato',
  ],
  student: [
    '/meu-painel',
    '/minhas-notas',
    '/minhas-faltas',
    '/minhas-tarefas',
    '/minhas-ocorrencias',
    '/minha-ficha',
    '/avisos',
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
    // Um redirecionamento renderiza quase nada; a tela real traz conteúdo.
    if (html.length < 400) {
      failures.push(`${label}: renderizou ${html.length} bytes — provavelmente redirecionou`)
      console.log(`  FALHOU  ${label}`)
      return
    }
    passed += 1
    console.log(`  ok      ${label}`)
  } catch (error) {
    failures.push(`${label}: ${(error as Error).message}`)
    console.log(`  FALHOU  ${label}`)
  }
}

console.log('Sem sessão')
check('/entrar', null, '/entrar')

for (const role of ['teacher', 'student'] as Role[]) {
  console.log(`\nPerfil ${role}`)
  for (const route of ROUTES[role]) check(`${route}`, role, route)
}

/* Caso negativo: prova que o guard acima reprova de verdade.
 * Sem sessão, o shell tem de redirecionar em vez de renderizar a tela — se
 * isto passar como "ok", todos os casos positivos acima são vazios. */
console.log(String.fromCharCode(10) + 'Guard')
const semSessao = renderToString(
  <MemoryRouter initialEntries={['/painel']}>
    <SessionProvider initialRole={null}>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </SessionProvider>
  </MemoryRouter>,
)
if (semSessao.length >= 400) {
  failures.push('guard: /painel renderizou sem sessão — o teste positivo é vazio')
  console.log('  FALHOU  /painel sem sessão deveria redirecionar')
} else {
  console.log('  ok      /painel redireciona sem sessão')
}

const total = 1 + ROUTES.teacher.length + ROUTES.student.length
if (failures.length > 0) {
  console.error(`\n${failures.length} de ${total} rotas quebraram:`)
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}
console.log(`\nTodas as ${passed} rotas renderizaram.`)
