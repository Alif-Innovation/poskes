import { Card, CardBody, CardHeader, CardTitle } from '@/components/Card'

/** Chronological EHR timeline per patient (PRD §3 Modul 7). */
export function HistoryTimeline() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-brand-secondary">Riwayat Rekam Medis</h1>
      <Card>
        <CardHeader>
          <CardTitle>Timeline Kunjungan</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-slate-500">Belum ada riwayat kunjungan untuk pasien ini.</p>
        </CardBody>
      </Card>
    </div>
  )
}
