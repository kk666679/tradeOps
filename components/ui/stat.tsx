import { cn } from '@/lib/utils'

interface StatProps {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export function Stat({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  className,
}: StatProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-slate-600',
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200/70 bg-white p-4 shadow-sm transition hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
          {change && (
            <p className={cn('mt-1 text-xs font-medium', changeColor[changeType])}>
              {change}
            </p>
          )}
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
    </div>
  )
}
