import { useSyncExternalStore } from 'react'
import { kunjunganStore } from '../store/kunjunganStore'

/** Read/write access to the shared visit log (see ../store/kunjunganStore). */
export function useKunjunganDirectory() {
  const kunjunganList = useSyncExternalStore(kunjunganStore.subscribe, kunjunganStore.getSnapshot)
  return {
    kunjunganList,
    addKunjungan: kunjunganStore.addKunjungan,
    markSelesai: kunjunganStore.markSelesai,
  }
}
