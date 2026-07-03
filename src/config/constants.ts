/** RBAC roles as defined in PRD §2 and the `users.role` enum (PRD §6.A). */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  REGISTRASI: 'REGISTRASI',
  TENAGA_MEDIS: 'TENAGA_MEDIS',
  FARMASI: 'FARMASI',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  REGISTRASI: 'Petugas Registrasi',
  TENAGA_MEDIS: 'Dokter / Tenaga Medis',
  FARMASI: 'Apoteker / Petugas Farmasi',
}

/** `kunjungan_medis.status_alur` enum (PRD §6.D). */
export const STATUS_ALUR = {
  ANTREAN_MEDIS: 'ANTREAN_MEDIS',
  PEMERIKSAAN: 'PEMERIKSAAN',
  ANTREAN_FARMASI: 'ANTREAN_FARMASI',
  SELESAI: 'SELESAI',
} as const

export type StatusAlur = (typeof STATUS_ALUR)[keyof typeof STATUS_ALUR]

export const STOK_OPNAME_WARNING_MONTHS = 3

export const NAV_ITEMS: Array<{ label: string; path: string; roles: Role[] }> = [
  { label: 'Dashboard', path: '/dashboard', roles: [ROLES.SUPER_ADMIN, ROLES.REGISTRASI, ROLES.TENAGA_MEDIS, ROLES.FARMASI] },
  { label: 'Data Pasien', path: '/pasien', roles: [ROLES.SUPER_ADMIN, ROLES.REGISTRASI, ROLES.TENAGA_MEDIS] },
  { label: 'Pemeriksaan SOAP', path: '/rekam-medis/soap', roles: [ROLES.SUPER_ADMIN, ROLES.TENAGA_MEDIS] },
  { label: 'Stok Obat', path: '/farmasi/stok', roles: [ROLES.SUPER_ADMIN, ROLES.FARMASI] },
  { label: 'Antrean Resep', path: '/farmasi/resep', roles: [ROLES.SUPER_ADMIN, ROLES.FARMASI] },
  { label: 'Master Obat', path: '/master-data/obat', roles: [ROLES.SUPER_ADMIN, ROLES.FARMASI] },
  { label: 'Master Diagnosis', path: '/master-data/diagnosis', roles: [ROLES.SUPER_ADMIN, ROLES.TENAGA_MEDIS] },
]
