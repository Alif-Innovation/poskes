import { useSyncExternalStore } from 'react'
import { obatStore } from '../store/obatStore'
import type { ObatOption } from '../types'

/** Read/write access to the shared drug catalog + stock batches (see ../store/obatStore). */
export function useObatDirectory() {
  const state = useSyncExternalStore(obatStore.subscribe, obatStore.getSnapshot)

  const obatList: ObatOption[] = state.obatList.map((obat) => ({
    id: obat.id,
    nama: obat.namaObat,
    stok: obatStore.getTotalStock(obat.id),
  }))

  return {
    obatList,
    batches: state.batches,
    addBatches: obatStore.addBatches,
    dispenseFefo: obatStore.dispenseFefo,
  }
}
