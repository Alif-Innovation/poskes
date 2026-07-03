import { Card, CardBody, CardHeader, CardTitle } from '@/components/Card'
import { Table, TableBody, TableHead, TableRow } from '@/components/Table'
import { ICD10_REFERENCE } from '@/config/icd10'

/** Master Data Penyakit — ICD-10 reference table (PRD §3 Modul 2). */
export function DiagnosisPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-brand-secondary">Master Data Diagnosis (ICD-10)</h1>
      <Card>
        <CardHeader>
          <CardTitle>Referensi Kode ICD-10</CardTitle>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHead>
              <TableRow>
                <th>Kode</th>
                <th>Deskripsi</th>
              </TableRow>
            </TableHead>
            <TableBody>
              {ICD10_REFERENCE.map((entry) => (
                <TableRow key={entry.code}>
                  <td className="font-medium text-brand-secondary">{entry.code}</td>
                  <td>{entry.label}</td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}
