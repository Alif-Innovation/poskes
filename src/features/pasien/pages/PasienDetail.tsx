import { useParams } from 'react-router-dom'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/Card'

/** Patient profile detail — hosts EHR timeline (Modul 7) in a future iteration. */
export function PasienDetail() {
  const { id } = useParams()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-brand-secondary">Detail Pasien</h1>
      <Card>
        <CardHeader>
          <CardTitle>ID Pasien: {id}</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-slate-500">Riwayat kunjungan medis akan ditampilkan di sini.</p>
        </CardBody>
      </Card>
    </div>
  )
}
