import { z } from 'zod'
import { stokBatchRowSchema } from '../validation/stokSchema'

export const stokFormSchema = z.object({
  rows: z.array(stokBatchRowSchema).min(1, 'Tambahkan minimal 1 baris stok'),
})

export type StokFormValues = z.infer<typeof stokFormSchema>
