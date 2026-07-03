import { UserPlus, X } from 'lucide-react'
import { Card, CardBody } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Combobox } from '@/components/Combobox'
import { classifyAllergy } from '@/features/pasien/validation/pasienSchema'
import { calculateAge } from '@/features/pasien/utils/calculateAge'
import type { Pasien } from '@/features/pasien/types'

interface PatientSelectorCardProps {
  pasienList: Pasien[]
  activePatient: Pasien | null
  onSelectPatient: (pasien: Pasien) => void
  onClearPatient: () => void
  onOpenRegisterModal: () => void
}

/**
 * Patient-first workflow entry point for the SOAP form (PRD §7 Form 4).
 * Renders a searchable patient picker until a patient is selected, then
 * collapses into a compact "Active Patient Banner" carrying the allergy
 * indicator used by the contraindication check further down the page.
 */
export function PatientSelectorCard({
  pasienList,
  activePatient,
  onSelectPatient,
  onClearPatient,
  onOpenRegisterModal,
}: PatientSelectorCardProps) {
  if (activePatient) {
    const { hasAllergy, label } = classifyAllergy(activePatient.riwayatAlergi)

    return (
      <Card>
        <CardBody className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-secondary">
                {activePatient.nomorRm} — {activePatient.namaLengkap}
              </p>
              <p className="text-xs text-slate-500">
                {activePatient.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}, {calculateAge(activePatient.tanggalLahir)}{' '}
                tahun · {activePatient.kontak}
              </p>
            </div>
            {hasAllergy ? (
              <Badge variant="danger" pulse>
                ⚠ Alergi: {label}
              </Badge>
            ) : (
              <Badge variant="neutral">Tidak Ada Alergi</Badge>
            )}
          </div>

          <button
            type="button"
            onClick={onClearPatient}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
            Ganti Pasien
          </button>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Combobox
          options={pasienList.map((p) => ({
            key: p.id,
            label: p.namaLengkap,
            description: `${p.nomorRm} · ${p.kontak}`,
          }))}
          onSelect={(key) => {
            const found = pasienList.find((p) => p.id === key)
            if (found) onSelectPatient(found)
          }}
          placeholder="Cari nama pasien atau nomor Rekam Medis (RM)..."
        />
        <Button type="button" onClick={onOpenRegisterModal} className="shrink-0">
          <UserPlus className="h-4 w-4" />
          Pasien Baru
        </Button>
      </CardBody>
    </Card>
  )
}
