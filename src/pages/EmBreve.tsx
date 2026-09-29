import { useLocation } from 'react-router-dom'
import { Hammer } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { useSession } from '@/mocks/session'
import { navFor } from '@/components/Sidebar'

/* Andaime de desenvolvimento.
 *
 * Existe para que o menu não termine em beco sem saída enquanto as demais
 * telas não são construídas. PRODUCT.md é explícito: numa apresentação, tela
 * sem conteúdo quebra a venda — nenhuma rota pode chegar aqui no dia da demo. */

export function EmBreve() {
  const location = useLocation()
  const { role } = useSession()
  const items = navFor(role ?? 'teacher')
  const current = items.find((item) => item.to === location.pathname)
  const title = current?.label ?? 'Em construção'

  return (
    <>
      <PageHeader title={title} crumbs={[{ label: title }]} />
      <Card>
        <EmptyState
          icon={<Hammer size={40} />}
          title={`${title} entra no próximo passo`}
          description="O painel foi a primeira tela construída. Esta ainda não existe — e precisa existir antes de qualquer apresentação."
        />
      </Card>
    </>
  )
}
