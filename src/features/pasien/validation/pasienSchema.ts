import { z } from 'zod'

/**
 * PRD §7 Form 2 (Registrasi Pasien Baru) validation rules.
 * Mirrors the `pasien` table constraints in database/migrations/003_pasien.sql.
 */
export const pasienSchema = z.object({
  namaLengkap: z
    .string()
    .min(1, 'Nama lengkap wajib diisi')
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(150, 'Nama lengkap maksimal 150 karakter')
    .regex(/^[A-Za-z\s]+$/, 'Nama lengkap hanya boleh berisi huruf dan spasi'),

  tanggalLahir: z
    .string()
    .min(1, 'Tanggal lahir wajib diisi')
    .refine((value) => new Date(value) <= new Date(new Date().toDateString()), {
      message: 'Tanggal lahir tidak boleh lebih besar dari hari ini',
    }),

  jenisKelamin: z.enum(['L', 'P'], { errorMap: () => ({ message: 'Pilih salah satu jenis kelamin' }) }),

  kontak: z
    .string()
    .min(1, 'Kontak wajib diisi')
    .regex(/^\d+$/, 'Kontak hanya boleh berisi angka')
    .min(9, 'Kontak minimal 9 digit')
    .max(15, 'Kontak maksimal 15 digit'),

  alamat: z.string().optional(),

  riwayatAlergi: z.string().optional(),
})

export type PasienFormValues = z.infer<typeof pasienSchema>

/**
 * PRD §7 Form 2 error-state UI: "Tidak Ada" renders a neutral grey badge,
 * any other free-text value (a specific drug name) renders a pulsing red
 * alert badge on the patient summary.
 */
export function classifyAllergy(riwayatAlergi: string | undefined): {
  hasAllergy: boolean
  label: string
} {
  const trimmed = riwayatAlergi?.trim()
  if (!trimmed) return { hasAllergy: false, label: 'Tidak Ada' }
  if (trimmed.toLowerCase() === 'tidak ada') return { hasAllergy: false, label: 'Tidak Ada' }
  return { hasAllergy: true, label: trimmed }
}
