import type { Pasien } from '../types'
import type { PasienFormValues } from '../validation/pasienSchema'

/**
 * Minimal in-memory patient directory standing in for a real API/DB call.
 * Exposed via useSyncExternalStore (see ../hooks/usePasienDirectory) so a
 * patient registered from any entry point (Data Pasien, SOAP patient-first
 * workflow) is immediately visible everywhere else in the app.
 */
let pasienList: Pasien[] = [
  {
    id: 'demo-siti-rahayu',
    nomorRm: 'RM-20260601-0001',
    namaLengkap: 'Siti Rahayu',
    tanggalLahir: '1990-05-14',
    jenisKelamin: 'P',
    kontak: '081234567890',
    alamat: 'Jl. Merdeka No. 10, Jakarta',
    riwayatAlergi: 'Paracetamol',
  },
  {
    id: 'demo-budi-santoso',
    nomorRm: 'RM-20260601-0002',
    namaLengkap: 'Budi Santoso',
    tanggalLahir: '1985-11-02',
    jenisKelamin: 'L',
    kontak: '081298765432',
    alamat: 'Jl. Sudirman No. 5, Jakarta',
    riwayatAlergi: 'Tidak Ada',
  },
]

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function generateNomorRm(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const sequence = String(pasienList.length + 1).padStart(4, '0')
  return `RM-${datePart}-${sequence}`
}

export const pasienStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot(): Pasien[] {
    return pasienList
  },
  addPasien(values: PasienFormValues): Pasien {
    const newPasien: Pasien = { ...values, id: crypto.randomUUID(), nomorRm: generateNomorRm() }
    pasienList = [...pasienList, newPasien]
    emitChange()
    return newPasien
  },
}
