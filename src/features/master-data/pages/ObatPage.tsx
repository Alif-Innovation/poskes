import { Card, CardBody, CardHeader, CardTitle } from '@/components/Card'
import { Table, TableBody, TableHead, TableRow } from '@/components/Table'

/** Master Data Obat (PRD §3 Modul 2) — drug catalog management. */
export function ObatPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-brand-secondary">Master Data Obat</h1>
      <Card>
        <CardHeader>
          <CardTitle>Katalog Obat</CardTitle>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHead>
              <TableRow>
                <th>Kode Obat</th>
                <th>Nama Obat</th>
                <th>Satuan</th>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <td colSpan={3} className="py-6 text-center text-sm text-slate-400">
                  Belum ada data obat.
                </td>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}
