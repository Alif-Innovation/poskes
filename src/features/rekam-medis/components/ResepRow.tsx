import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import clsx from 'clsx'
import { TableRow } from '@/components/Table'
import type { ObatOption } from '@/features/farmasi/types'
import type { SoapFormValues } from '../validation/soapSchema'

interface ResepRowProps {
  index: number
  register: UseFormRegister<SoapFormValues>
  errors: FieldErrors<SoapFormValues>
  obatOptions: ObatOption[]
  onSelectObat: (obat: ObatOption) => void
  onRemove: () => void
}

export function ResepRow({ index, register, errors, obatOptions, onSelectObat, onRemove }: ResepRowProps) {
  const rowErrors = errors.resepDetail?.[index]
  const stockError = rowErrors?.jumlahMinta?.message

  return (
    <TableRow invalid={!!stockError}>
      <td>
        <select
          {...register(`resepDetail.${index}.obatId`)}
          onChange={(e) => {
            const obat = obatOptions.find((o) => o.id === e.target.value)
            if (obat) onSelectObat(obat)
          }}
          className="w-full rounded-md border border-border bg-bg-surface px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
        >
          <option value="">Pilih obat...</option>
          {obatOptions.map((obat) => (
            <option key={obat.id} value={obat.id}>
              {obat.nama} (sisa {obat.stok})
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="number"
          {...register(`resepDetail.${index}.jumlahMinta`)}
          className={clsx(
            'w-20 rounded-md border bg-bg-surface px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40',
            stockError ? 'border-state-danger text-state-danger' : 'border-border',
          )}
        />
        {stockError && <p className="shh-error-text">{stockError}</p>}
      </td>
      <td>
        <input
          {...register(`resepDetail.${index}.aturanPakai`)}
          placeholder="3x1 sesudah makan"
          className="w-full rounded-md border border-border bg-bg-surface px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
        />
      </td>
      <td>
        <button type="button" onClick={onRemove} className="text-slate-400 hover:text-state-danger" aria-label="Hapus resep">
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </TableRow>
  )
}
