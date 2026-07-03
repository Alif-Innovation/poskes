import { Card, CardBody, CardHeader, CardTitle } from '@/components/Card'
import { Table, TableBody, TableHead, TableRow } from '@/components/Table'

/** Antrean resep masuk untuk Farmasi (PRD §3 Modul 6). */
export function ResepAntreanPage() {
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
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <td colSpan={4} className="py-6 text-center text-sm text-slate-400">
                  Tidak ada resep dalam antrean.
                </td>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}
