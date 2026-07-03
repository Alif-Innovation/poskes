import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/Card'
import { Table, TableBody, TableHead, TableRow } from '@/components/Table'
import { Button } from '@/components/Button'
import { useDebounce } from '@/hooks/useDebounce'
import { PasienFormModal } from '../components/PasienFormModal'
import { AllergyBadge } from '../components/AllergyBadge'
import type { PasienFormValues } from '../validation/pasienSchema'

interface PasienRow extends PasienFormValues {
  id: string
  nomorRm: string
}

export function PasienListPage() {
  const [pasienList, setPasienList] = useState<PasienRow[]>([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const debouncedSearch = useDebounce(search)

  const filtered = pasienList.filter((p) =>
    p.namaLengkap.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  const handleCreate = (values: PasienFormValues) => {
    const nomorRm = `RM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
      pasienList.length + 1,
    ).padStart(4, '0')}`
    setPasienList((prev) => [...prev, { ...values, id: crypto.randomUUID(), nomorRm }])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-brand-secondary">Data Pasien</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Pasien Baru
        </Button>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Daftar Pasien</CardTitle>
          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pasien..."
              className="w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
          </div>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHead>
              <TableRow>
                <th>No. RM</th>
                <th>Nama Lengkap</th>
                <th>Tanggal Lahir</th>
                <th>Kontak</th>
                <th>Riwayat Alergi</th>
                <th></th>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <td colSpan={6} className="py-6 text-center text-sm text-slate-400">
                    Belum ada data pasien.
                  </td>
                </TableRow>
              )}
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <td className="font-medium text-brand-secondary">{p.nomorRm}</td>
                  <td>{p.namaLengkap}</td>
                  <td>{p.tanggalLahir}</td>
                  <td>{p.kontak}</td>
                  <td>
                    <AllergyBadge riwayatAlergi={p.riwayatAlergi} />
                  </td>
                  <td>
                    <Link to={`/pasien/${p.id}`} className="text-sm font-medium text-brand-primary hover:underline">
                      Detail
                    </Link>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <PasienFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreate} />
    </div>
  )
}
