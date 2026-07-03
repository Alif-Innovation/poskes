import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  /** PRD §7 Form 2: allergy badges blink to draw attention to contraindication risk. */
  pulse?: boolean
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-state-success/10 text-state-success',
  warning: 'bg-state-warning/10 text-state-warning',
  danger: 'bg-state-danger/10 text-state-danger',
  info: 'bg-brand-primary/10 text-brand-primary',
}

export function Badge({ variant = 'neutral', pulse, className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANT_CLASSES[variant],
        pulse && 'animate-pulse',
        className,
      )}
      {...props}
    />
  )
}
