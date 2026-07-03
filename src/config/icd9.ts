/**
 * Reference subset of ICD-9-CM procedure/tindakan codes (PRD §3 Modul 2).
 * Backed by the `icd9_tindakan` table (database/migrations); used in the
 * SOAP Plan step for selecting tindakan medis.
 */
export interface Icd9Entry {
  code: string
  label: string
}

export const ICD9_REFERENCE: Icd9Entry[] = [
  { code: '89.03', label: '89.03 - Pemeriksaan interview dan evaluasi umum' },
  { code: '93.18', label: '93.18 - Terapi fisik lainnya' },
  { code: '99.29', label: '99.29 - Injeksi zat terapeutik lainnya' },
  { code: '96.6', label: '96.6 - Irigasi/pembersihan luka' },
  { code: '87.44', label: '87.44 - Rontgen dada rutin' },
  { code: '90.59', label: '90.59 - Pemeriksaan darah lengkap' },
]
