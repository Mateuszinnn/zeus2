import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/* Trilha e título ficam FORA de qualquer cartão. O cartão contém só dado.
 * Ver design system §4. */

export interface Crumb {
  label: string
  to?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  crumbs?: Crumb[]
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, crumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Trilha de navegação" className="mb-2">
          <ol className="flex flex-wrap items-center gap-1.5 text-caption text-muted">
            {crumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="text-muted no-underline hover:text-secondary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display text-primary text-balance">{title}</h1>
          {subtitle && <p className="mt-1 text-body text-secondary">{subtitle}</p>}
        </div>
        {actions}
      </div>
    </div>
  )
}
