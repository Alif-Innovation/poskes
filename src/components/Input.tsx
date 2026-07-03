import { forwardRef, type InputHTMLAttributes } from 'react'
import clsx from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

/**
 * Base text input implementing the PRD §7 error-state contract:
 * red border (border-state-danger) plus small helper text under the field
 * whenever `error` is set.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const inputId = id ?? props.name
    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={inputId} className="shh-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'rounded-lg border bg-bg-surface px-3 py-2 text-sm text-slate-800 shadow-sm transition-colors',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/40',
            error ? 'border-state-danger' : 'border-border focus:border-brand-primary',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="shh-error-text">
            {error}
          </p>
        ) : hint ? (
          <p className="mt-1 text-xs text-slate-400">{hint}</p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'
