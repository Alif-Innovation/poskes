import { z } from 'zod'
import { STOK_OPNAME_WARNING_MONTHS } from '@/config/constants'

/**
 * PRD §7 Form 3 (Manajemen Stok Masuk & Opname) validation rules.
 * Mirrors the `obat_stock_batch` constraints in database/migrations/004_master_data.sql.
 */
export const stokBatchRowSchema = z.object({
  obatId: z.string().min(1, 'Pilih nama obat'),
  batchNumber: z
    .string()
    .min(1, 'Batch number wajib diisi')
    .regex(/^[A-Z0-9]{4,20}$/, 'Batch number harus alfanumerik uppercase, panjang 4-20 karakter'),
  stockQty: z.coerce
    .number({ invalid_type_error: 'Jumlah stok wajib diisi' })
    .int('Jumlah stok harus bilangan bulat, tidak boleh desimal')
    .positive('Jumlah stok harus lebih besar dari 0'),
  expiredDate: z
    .string()
    .min(1, 'Tanggal kedaluwarsa wajib diisi')
    .refine((value) => new Date(value) > new Date(new Date().toDateString()), {
      message: 'Tanggal kedaluwarsa harus lebih besar dari hari ini',
    }),
})

export type StokBatchRowValues = z.infer<typeof stokBatchRowSchema>

/**
 * Soft warning (non-blocking): PRD §7 says rows expiring within 3 months
 * should be flagged orange in the table, distinct from hard validation errors.
 */
export function isNearExpiry(expiredDate: string): boolean {
  if (!expiredDate) return false
  const threshold = new Date()
  threshold.setMonth(threshold.getMonth() + STOK_OPNAME_WARNING_MONTHS)
  return new Date(expiredDate) <= threshold
}
