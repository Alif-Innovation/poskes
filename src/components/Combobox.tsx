import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import clsx from 'clsx'

export interface ComboboxOption {
  key: string
  label: string
  description?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  onSelect: (key: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

/** Searchable select (shadcn-style combobox) filtering a flat option list by label + description. */
export function Combobox({ options, onSelect, placeholder, emptyText = 'Tidak ada hasil ditemukan.', className }: ComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = options.filter((option) =>
    `${option.label} ${option.description ?? ''}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div ref={containerRef} className={clsx('relative flex-1', className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-bg-surface py-2 pl-9 pr-3 text-sm shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-bg-surface shadow-sm">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-slate-400">{emptyText}</p>
          ) : (
            filtered.map((option) => (
              <button
                type="button"
                key={option.key}
                onClick={() => {
                  onSelect(option.key)
                  setQuery('')
                  setOpen(false)
                }}
                className="flex w-full flex-col items-start px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50"
              >
                <span className="font-medium text-slate-700">{option.label}</span>
                {option.description && <span className="text-xs text-slate-400">{option.description}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
