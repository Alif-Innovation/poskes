import { useSyncExternalStore } from 'react'
import { pasienStore } from '../store/pasienStore'

/** Read/write access to the shared patient directory (see ../store/pasienStore). */
export function usePasienDirectory() {
  const pasienList = useSyncExternalStore(pasienStore.subscribe, pasienStore.getSnapshot)
  return { pasienList, addPasien: pasienStore.addPasien }
}
