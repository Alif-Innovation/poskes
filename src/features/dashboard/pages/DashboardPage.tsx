import { Card, CardBody, CardHeader, CardTitle } from '@/components/Card'
import { Badge } from '@/components/Badge'

/** PRD §3 Modul 9 — visual widgets summarizing daily activity and stock health. */
export function DashboardPage() {
  const widgets = [
    { label: 'Kunjungan Hari Ini', value: '0', variant: 'info' as const },
    { label: 'Stok Menipis', value: '0', variant: 'warning' as const },
    { label: 'Stok Kritis / Habis', value: '0', variant: 'danger' as const },
    { label: 'Resep Selesai', value: '0', variant: 'success' as const },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-brand-secondary">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {widgets.map((widget) => (
          <Card key={widget.label}>
            <CardBody>
              <p className="text-sm text-slate-500">{widget.label}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-semibold text-brand-secondary">{widget.value}</span>
                <Badge variant={widget.variant}>Live</Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tren Penyakit Terbanyak (Top 5 ICD-10)</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-slate-500">Grafik akan tersedia setelah data kunjungan tercatat.</p>
        </CardBody>
      </Card>
    </div>
  )
}
