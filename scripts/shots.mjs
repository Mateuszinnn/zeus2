/* Captura cada rota nos dois perfis, em 1440 e 390, e reporta erro de console
 * e rolagem horizontal. A interface e em ingles; os seletores seguem os
 * rotulos reais.
 *
 * Existe porque typecheck, build e o teste de fumaça provam que a tela ABRE,
 * nunca que ela está certa. Foi este script que mostrou que a tabela de notas
 * não exibia nota nenhuma no telefone, com todas as outras verificações verdes.
 *
 * Exige o dev server no ar (`npm run dev`) e o Edge instalado.
 * Uso: npm run shots — as imagens saem em .shots/ (ignorado pelo git).
 */

import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = 'http://127.0.0.1:5173'
const OUT = process.argv[2] ?? 'shots'
mkdirSync(OUT, { recursive: true })

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 390, height: 844 }

const PROFILES = [
  {
    role: 'teacher',
    routes: [
      ['painel', '/dashboard'],
      ['turmas', '/classes'],
      ['alunos', '/students'],
      ['notas', '/grades'],
      ['faltas', '/attendance'],
      ['ocorrencias', '/incidents'],
      ['tarefas', '/assignments'],
      ['matriculas', '/enrollments'],
      ['avisos', '/announcements'],
      ['configuracoes', '/settings'],
      ['contato', '/contact'],
    ],
  },
  {
    role: 'student',
    routes: [
      ['meu-painel', '/my-dashboard'],
      ['minhas-notas', '/my-grades'],
      ['minhas-faltas', '/my-attendance'],
      ['minhas-tarefas', '/my-assignments'],
      ['minha-ficha', '/my-record'],
    ],
  },
]

const problems = []
const browser = await chromium.launch({ executablePath: EDGE, headless: true })

async function overflowOf(page, label) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  if (overflow > 1) problems.push(`overflow-x ${label}: ${overflow}px`)
}

function ctx() {
  return browser.newContext({
    viewport: DESKTOP,
    deviceScaleFactor: 2,
    locale: 'pt-BR',
    reducedMotion: 'reduce',
  })
}

{
  const context = await ctx()
  const page = await context.newPage()
  await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `${OUT}/desktop-sign-in.png` })
  await overflowOf(page, 'desktop/sign-in')
  await page.setViewportSize(MOBILE)
  await page.waitForTimeout(250)
  await page.screenshot({ path: `${OUT}/mobile-sign-in.png` })
  await overflowOf(page, 'mobile/sign-in')
  await context.close()
}

for (const { role, routes } of PROFILES) {
  const context = await ctx()
  const page = await context.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`console: ${m.text().slice(0, 160)}`)
  })
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message.slice(0, 160)}`))

  await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle' })
  if (role === 'student') await page.getByRole('button', { name: /^Student/ }).click()
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await page.waitForFunction(() => location.pathname.includes('dashboard'), null, { timeout: 10000 })

  for (const [name, route] of routes) {
    if (!page.url().endsWith(route)) {
      await page.locator(`a[href="${route}"]`).first().click({ timeout: 10000 })
      await page.waitForFunction((r) => location.pathname === r, route, { timeout: 10000 })
    }
    await page.waitForTimeout(900)

    await page.screenshot({ path: `${OUT}/desktop-${name}.png` })
    await overflowOf(page, `desktop/${name}`)

    // Mobile por redimensionamento: sem reload, a sessão em memória sobrevive.
    await page.setViewportSize(MOBILE)
    await page.waitForTimeout(350)
    await page.screenshot({ path: `${OUT}/mobile-${name}.png` })
    await overflowOf(page, `mobile/${name}`)

    await page.setViewportSize(DESKTOP)
    await page.waitForTimeout(250)
  }
  await context.close()
}

await browser.close()

if (problems.length) {
  console.log('PROBLEMAS:')
  for (const p of [...new Set(problems)]) console.log('  ' + p)
} else {
  console.log('Sem erro de console nem rolagem horizontal em 1440 e 390.')
}
