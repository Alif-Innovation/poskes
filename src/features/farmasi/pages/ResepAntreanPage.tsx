import { useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/Card'
import { Table, TableBody, TableHead, TableRow } from '@/components/Table'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { useAuth } from '@/context/AuthContext'
import { useNotification } from '@/context/NotificationContext'
import { useKunjunganDirectory } from '@/features/rekam-medis/hooks/useKunjunganDirectory'
import type { KunjunganRecord } from '@/features/rekam-medis/types'
import { useObatDirectory } from '../hooks/useObatDirectory'
import { DispenseModal } from '../components/DispenseModal'

/**
 * PRD §3 Modul 6 + §8: pharmacy queue for prescriptions awaiting dispense,
 * with FEFO-based automated stock reduction on confirmation.
 */
export function ResepAntreanPage() {
  const { hasRole } = useAuth()
  const { notify } = useNotification()
  const { kunjunganList, markSelesai } = useKunjunganDirectory()
  const { dispenseFefo, obatList } = useObatDirectory()
  const [selected, setSelected] = useState<KunjunganRecord | null>(null)

  const obatNameById = Object.fromEntries(obatList.map((o) => [o.id, o.nama]))
  const pending = kunjunganList.filter((k) => k.statusAlur === 'ANTREAN_FARMASI')

  function handleConfirmDispense() {
    if (!selected) return

    if (!hasRole('FARMASI', 'SUPER_ADMIN')) {
      notify('danger', 'Hanya Apoteker/Petugas Farmasi yang dapat menyerahkan obat')
      return
    }

    const result = dispenseFefo(selected.resepDetail.map((item) => ({ obatId: item.obatId, jumlah: item.jumlahMinta })))

    if (!result.success) {
      const shortageText = result.shortages
        .map((s) => `${obatNameById[s.obatId] ?? s.obatId} (kurang ${s.shortfall})`)
        .join(', ')
      notify('danger', `Stok tidak mencukupi saat penyerahan: ${shortageText}`)
      return
    }

    markSelesai(selected.id)
    notify('success', `Obat untuk ${selected.namaPasien} berhasil diserahkan (FEFO), stok diperbarui`)
    setSelected(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-brand-secondary">Antrean Resep</h1>
      <Card>
        <CardHeader>
          <CardTitle>Resep Menunggu Penyerahan</CardTitle>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHead>
              <TableRow>
                <th>No. RM</th>
                <th>Pasien</th>
                <th>Jumlah Item</th>
                <th>Status</th>
                <th></th>
              </TableRow>
            </TableHead>
            <TableBody>
              {pending.length === 0 && (
                <TableRow>
                  <td colSpan={5} className="py-6 text-center text-sm text-slate-400">
                    Tidak ada resep dalam antrean.
                  </td>
                </TableRow>
              )}
              {pending.map((kunjungan) => (
                <TableRow key={kunjungan.id}>
                  <td className="font-medium text-brand-secondary">{kunjungan.nomorRm}</td>
                  <td>{kunjungan.namaPasien}</td>
                  <td>{kunjungan.resepDetail.length} item</td>
                  <td>
                    <Badge variant="warning">Antrean Farmasi</Badge>
                  </td>
                  <td>
                    <Button type="button" size="sm" onClick={() => setSelected(kunjungan)}>
                      Serahkan Obat
                    </Button>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <DispenseModal
        open={!!selected}
        kunjungan={selected}
        onClose={() => setSelected(null)}
        onConfirm={handleConfirmDispense}
      />
    </div>
  )
}
