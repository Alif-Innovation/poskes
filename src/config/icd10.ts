/**
 * Reference subset of ICD-10 diagnosis codes (PRD §3 Modul 2 — Master Data Penyakit).
 * Backed by the `icd10_diagnosis` table (database/migrations); this local list
 * only seeds the searchable combo box used in the SOAP Assessment step.
 */
export interface Icd10Entry {
  code: string
  label: string
}

export const ICD10_REFERENCE: Icd10Entry[] = [
  { code: 'J00', label: 'J00 - Nasofaringitis akut (common cold)' },
  { code: 'J06.9', label: 'J06.9 - Infeksi akut saluran pernapasan atas' },
  { code: 'A09', label: 'A09 - Diare dan gastroenteritis' },
  { code: 'K30', label: 'K30 - Dispepsia' },
  { code: 'I10', label: 'I10 - Hipertensi esensial' },
  { code: 'E11', label: 'E11 - Diabetes melitus tipe 2' },
  { code: 'R50.9', label: 'R50.9 - Demam, tidak diketahui sebabnya' },
  { code: 'M79.1', label: 'M79.1 - Mialgia' },
  { code: 'L23.9', label: 'L23.9 - Dermatitis kontak alergi' },
  { code: 'R51', label: 'R51 - Nyeri kepala' },
]
