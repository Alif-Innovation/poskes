import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { Table, TableBody, TableHead, TableRow } from '@/components/Table'
import type { KunjunganRecord } from '@/features/rekam-medis/types'

interface DispenseModalProps {
  open: boolean
  kunjungan: KunjunganRecord | null
  onClose: () => void
  onConfirm: () => void
}

/**
 * Confirms a pharmacy dispense before triggering FEFO stock reduction
 * (PRD §8) — lets the pharmacist verify the prescription items first.
 */
export function DispenseModal({ open, kunjungan, onClose, onConfirm }: DispenseModalProps) {
  if (!kunjungan) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Konfirmasi Penyerahan Obat"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="button" onClick={onConfirm}>
            Serahkan Obat
          </Button>
        </>
      }
    >
      <p className="mb-3 text-sm text-slate-600">
        <span className="font-semibold text-brand-secondary">{kunjungan.nomorRm}</span> — {kunjungan.namaPasien}
      </p>

      <Table>
        <TableHead>
          <TableRow>
            <th>Nama Obat</th>
            <th>Jumlah</th>
            <th>Aturan Pakai</th>
          </TableRow>
        </TableHead>
        <TableBody>
          {kunjungan.resepDetail.map((item, index) => (
            <TableRow key={`${item.obatId}-${index}`}>
              <td>{item.namaObat}</td>
              <td>{item.jumlahMinta}</td>
              <td>{item.aturanPakai}</td>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="mt-3 text-xs text-slate-400">
        Stok akan dipotong otomatis mengikuti metode FEFO (First Expired, First Out).
      </p>
    </Modal>
  )
}
