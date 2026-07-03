import type { PasienFormValues } from './validation/pasienSchema'

/** A persisted patient record: validated form values plus server-assigned identifiers. */
export interface Pasien extends PasienFormValues {
  id: string
  nomorRm: string
}
