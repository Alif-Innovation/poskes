/** A drug + its live aggregate stock, as consumed by selection UIs (resep, stok masuk). */
export interface ObatOption {
  id: string
  nama: string
  stok: number
}

export interface ObatMaster {
  id: string
  kodeObat: string
  namaObat: string
  satuan: string
}

export interface ObatStockBatch {
  id: string
  obatId: string
  batchNumber: string
  stockQty: number
  expiredDate: string
}
