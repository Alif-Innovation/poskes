import { STATUS_ALUR } from '@/config/constants'
import type { KunjunganRecord } from '../types'

/**
 * In-memory visit log standing in for a real API/DB. A visit is created by
 * the SOAP form with status ANTREAN_FARMASI, picked up by the pharmacy
 * queue (Antrean Resep), and flipped to SELESAI once dispensed (PRD §8).
 */
let kunjunganList: KunjunganRecord[] = []

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

export const kunjunganStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot(): KunjunganRecord[] {
    return kunjunganList
  },
  addKunjungan(input: Omit<KunjunganRecord, 'id' | 'tanggalKunjungan' | 'statusAlur'>): KunjunganRecord {
    const record: KunjunganRecord = {
      ...input,
      id: crypto.randomUUID(),
      tanggalKunjungan: new Date().toISOString(),
      statusAlur: STATUS_ALUR.ANTREAN_FARMASI,
    }
    kunjunganList = [record, ...kunjunganList]
    emitChange()
    return record
  },
  markSelesai(id: string) {
    kunjunganList = kunjunganList.map((k) => (k.id === id ? { ...k, statusAlur: STATUS_ALUR.SELESAI } : k))
    emitChange()
  },
}
