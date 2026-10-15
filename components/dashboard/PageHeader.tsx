import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">{title}</h1>
        {description && (
          <p className="mt-1 text-base text-slate-600">{description}</p>
        )}
      </div>
      {action && <div className="flex gap-2">{action}</div>}
    </div>
  )
}
