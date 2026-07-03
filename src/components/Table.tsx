import type { HTMLAttributes, TableHTMLAttributes } from 'react'
import clsx from 'clsx'

/** Compact data-density table shell per PRD §4 (py-2 px-4 cell padding). */
export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="shh-card overflow-x-auto">
      <table className={clsx('shh-table w-full border-collapse', className)} {...props} />
    </div>
  )
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={clsx('border-b border-border bg-slate-50', className)} {...props} />
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={clsx('divide-y divide-border', className)} {...props} />
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** PRD §7 Form 3: rows failing validation render with a transparent red background. */
  invalid?: boolean
}

export function TableRow({ invalid, className, ...props }: TableRowProps) {
  return <tr className={clsx(invalid && 'bg-red-50', className)} {...props} />
}
