import { z } from 'zod'

/**
 * PRD §7 Form 1 (Autentikasi/Login) validation rules:
 * - username: required, min 4 chars, lowercase letters + digits only, no spaces/special chars.
 * - password: required, min 8 chars.
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username tidak boleh kosong')
    .min(4, 'Username minimal 4 karakter')
    .regex(/^[a-z0-9]+$/, 'Username hanya boleh huruf kecil dan angka, tanpa spasi atau karakter spesial'),
  password: z.string().min(1, 'Password tidak boleh kosong').min(8, 'Password minimal 8 karakter'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
