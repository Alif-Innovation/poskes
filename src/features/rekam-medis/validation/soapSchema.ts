import { z } from 'zod'

/**
 * PRD §7 Form 4 (Lembar Pemeriksaan SOAP & Resep) validation rules.
 * Mirrors `kunjungan_medis` / `resep_detail` (database/migrations/005-006).
 */
const objectiveSchema = z.object({
  tensi: z
    .string()
    .min(1, 'Tensi wajib diisi')
    .regex(/^\d{2,3}\/\d{2,3}$/, 'Format tensi harus sistole/diastole, contoh 120/80'),
  suhu: z.coerce
    .number({ invalid_type_error: 'Suhu wajib diisi' })
    .min(35, 'Suhu harus dalam rentang 35.0 - 42.0 °C')
    .max(42, 'Suhu harus dalam rentang 35.0 - 42.0 °C'),
  nadi: z.coerce.number({ invalid_type_error: 'Nadi wajib diisi' }).positive('Nadi harus berupa angka positif'),
  beratBadan: z.coerce.number({ invalid_type_error: 'Berat badan wajib diisi' }).positive('Berat badan harus berupa angka positif'),
})

const resepItemSchema = z.object({
  obatId: z.string().min(1, 'Pilih obat'),
  namaObat: z.string().min(1),
  jumlahMinta: z.coerce.number({ invalid_type_error: 'Jumlah wajib diisi' }).int().positive('Jumlah harus lebih besar dari 0'),
  aturanPakai: z.string().min(1, 'Aturan pakai wajib diisi (contoh: 3x1 sesudah makan)'),
})

const baseSoapSchema = z.object({
  sSubjective: z.string().min(1, 'Keluhan wajib diisi').min(10, 'Keluhan minimal 10 karakter teks naratif'),
  oObjective: objectiveSchema,
  aAssessmentIcd10: z.array(z.string()).min(1, 'Pilih minimal 1 diagnosis ICD-10'),
  pPlanTindakanIcd9: z.array(z.string()).default([]),
  resepDetail: z.array(resepItemSchema).default([]),
})

export type SoapFormValues = z.infer<typeof baseSoapSchema>

/**
 * Stock is only known at runtime (per obat_id), so the real-time
 * `jumlahMinta <= sisaStok` check (PRD §7 Form 4) is wired as a superRefine
 * built from the current stock snapshot, rather than baked into the static schema.
 */
export function createSoapSchema(stockByObatId: Record<string, number>) {
  return baseSoapSchema.superRefine((values, ctx) => {
    values.resepDetail.forEach((item, index) => {
      const sisaStok = stockByObatId[item.obatId] ?? 0
      if (item.jumlahMinta > sisaStok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['resepDetail', index, 'jumlahMinta'],
          message: `Stok tidak cukup, sisa: ${sisaStok}`,
        })
      }
    })
  })
}
