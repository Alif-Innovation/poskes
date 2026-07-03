import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Trash2, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'
import { TableRow } from '@/components/Table'
import { isNearExpiry } from '../validation/stokSchema'
import type { StokFormValues } from './stokFormTypes'

interface StockRowProps {
  index: number
  register: UseFormRegister<StokFormValues>
  errors: FieldErrors<StokFormValues>
  expiredDate: string
  onRemove: () => void
}

export function StockRow({ index, register, errors, expiredDate, onRemove }: StockRowProps) {
  const rowErrors = errors.rows?.[index]
  const hasError = !!rowErrors
  const nearExpiry = !hasError && isNearExpiry(expiredDate)

  return (
    <TableRow invalid={hasError}>
      <td>
        <input
          {...register(`rows.${index}.batchNumber`)}
          placeholder="BATCH2026A"
          className={clsx(
            'w-full rounded-md border bg-bg-surface px-2 py-1 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand-primary/40',
            rowErrors?.batchNumber ? 'border-state-danger' : 'border-border',
          )}
        />
        {rowErrors?.batchNumber && <p className="shh-error-text">{rowErrors.batchNumber.message}</p>}
      </td>
      <td>
        <input
          type="number"
          {...register(`rows.${index}.stockQty`)}
          className={clsx(
            'w-24 rounded-md border bg-bg-surface px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40',
            rowErrors?.stockQty ? 'border-state-danger' : 'border-border',
          )}
        />
        {rowErrors?.stockQty && <p className="shh-error-text">{rowErrors.stockQty.message}</p>}
      </td>
      <td>
        <input
          type="date"
          {...register(`rows.${index}.expiredDate`)}
          className={clsx(
            'rounded-md border bg-bg-surface px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40',
            rowErrors?.expiredDate ? 'border-state-danger' : nearExpiry ? 'border-state-warning' : 'border-border',
          )}
        />
        {rowErrors?.expiredDate ? (
          <p className="shh-error-text">{rowErrors.expiredDate.message}</p>
        ) : nearExpiry ? (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-state-warning">
            <AlertTriangle className="h-3 w-3" /> Mendekati ED (&lt; 3 bulan)
          </p>
        ) : null}
      </td>
      <td>
        <button type="button" onClick={onRemove} className="text-slate-400 hover:text-state-danger" aria-label="Hapus baris">
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </TableRow>
  )
}
