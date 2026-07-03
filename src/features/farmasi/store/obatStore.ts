import type { ObatMaster, ObatStockBatch } from '../types'

/**
 * In-memory drug catalog + per-batch stock, standing in for a real API/DB.
 * Shared across features (SOAP prescribing, Stok Masuk & Opname, Antrean
 * Resep dispensing) via useSyncExternalStore — see ../hooks/useObatDirectory.
 */
interface ObatStoreState {
  obatList: ObatMaster[]
  batches: ObatStockBatch[]
}

let state: ObatStoreState = {
  obatList: [
    { id: 'obat-paracetamol', kodeObat: 'OBT-001', namaObat: 'Paracetamol 500mg', satuan: 'Tablet' },
    { id: 'obat-amoxicillin', kodeObat: 'OBT-002', namaObat: 'Amoxicillin 500mg', satuan: 'Kapsul' },
    { id: 'obat-cetirizine', kodeObat: 'OBT-003', namaObat: 'Cetirizine 10mg', satuan: 'Tablet' },
  ],
  batches: [
    { id: 'batch-pcm-1', obatId: 'obat-paracetamol', batchNumber: 'PCM2026A', stockQty: 5, expiredDate: '2026-12-01' },
    { id: 'batch-amx-1', obatId: 'obat-amoxicillin', batchNumber: 'AMX2026A', stockQty: 25, expiredDate: '2026-09-01' },
    { id: 'batch-amx-2', obatId: 'obat-amoxicillin', batchNumber: 'AMX2026B', stockQty: 15, expiredDate: '2027-01-01' },
    { id: 'batch-ctz-1', obatId: 'obat-cetirizine', batchNumber: 'CTZ2026A', stockQty: 15, expiredDate: '2026-11-01' },
  ],
}

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

export interface DispenseResult {
  success: boolean
  shortages: Array<{ obatId: string; shortfall: number }>
}

export const obatStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot(): ObatStoreState {
    return state
  },
  getTotalStock(obatId: string): number {
    return state.batches.filter((b) => b.obatId === obatId).reduce((sum, b) => sum + b.stockQty, 0)
  },
  addBatches(rows: Array<{ obatId: string; batchNumber: string; stockQty: number; expiredDate: string }>) {
    const newBatches: ObatStockBatch[] = rows.map((row) => ({ ...row, id: crypto.randomUUID() }))
    state = { ...state, batches: [...state.batches, ...newBatches] }
    emitChange()
  },
  /**
   * PRD §8 Automated Stock Reduction: for each obat, deduct from the batch
   * with the nearest expired_date first (FEFO), spilling into the next
   * batch once the current one is exhausted. All-or-nothing: if any obat
   * can't be fully covered, nothing is committed.
   */
  dispenseFefo(items: Array<{ obatId: string; jumlah: number }>): DispenseResult {
    const draftBatches = state.batches.map((b) => ({ ...b }))
    const shortages: Array<{ obatId: string; shortfall: number }> = []

    for (const item of items) {
      let remaining = item.jumlah
      const batchesForObat = draftBatches
        .filter((b) => b.obatId === item.obatId && b.stockQty > 0)
        .sort((a, b) => a.expiredDate.localeCompare(b.expiredDate))

      for (const batch of batchesForObat) {
        if (remaining <= 0) break
        const deduction = Math.min(batch.stockQty, remaining)
        batch.stockQty -= deduction
        remaining -= deduction
      }

      if (remaining > 0) {
        shortages.push({ obatId: item.obatId, shortfall: remaining })
      }
    }

    if (shortages.length > 0) {
      return { success: false, shortages }
    }

    state = { ...state, batches: draftBatches }
    emitChange()
    return { success: true, shortages: [] }
  },
}
