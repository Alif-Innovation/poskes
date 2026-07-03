import type { StatusAlur } from '@/config/constants'

export interface ResepDetailRecord {
  obatId: string
  namaObat: string
  jumlahMinta: number
  aturanPakai: string
}

/** A persisted SOAP visit (PRD §6.D kunjungan_medis), denormalized with patient display fields. */
export interface KunjunganRecord {
  id: string
  pasienId: string
  nomorRm: string
  namaPasien: string
  dokterId: string
  tanggalKunjungan: string
  sSubjective: string
  oObjective: { tensi: string; suhu: number; nadi: number; beratBadan: number }
  aAssessmentIcd10: string[]
  pPlanTindakanIcd9: string[]
  resepDetail: ResepDetailRecord[]
  statusAlur: StatusAlur
}
