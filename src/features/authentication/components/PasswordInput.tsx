import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'
import type { InputProps } from '@/components/Input'

/** Password field with a visibility toggle icon, per PRD §7 Form 1 UI spec. */
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    const inputId = id ?? props.name

    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={inputId} className="shh-label">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={clsx(
              'w-full rounded-lg border bg-bg-surface px-3 py-2 pr-10 text-sm text-slate-800 shadow-sm transition-colors',
              'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/40',
              error ? 'border-state-danger' : 'border-border focus:border-brand-primary',
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
            aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="shh-error-text">
            {error}
          </p>
        )}
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'
