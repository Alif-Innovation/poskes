import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'

interface AllergyAlertModalProps {
  open: boolean
  drugName: string
  onCancel: () => void
  onBypass: () => void
}

/**
 * PRD §7 Form 4 Error State UI: hard interruption when a prescribed drug
 * matches the patient's recorded allergy. Bypass is gated to physician role
 * in the calling page (only rendered/enabled for TENAGA_MEDIS / SUPER_ADMIN).
 */
export function AllergyAlertModal({ open, drugName, onCancel, onBypass }: AllergyAlertModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="⚠ Peringatan Kontraindikasi"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            Batalkan
          </Button>
          <Button variant="danger" onClick={onBypass}>
            Bypass (Butuh Hak Akses Dokter)
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-700">
        Pasien memiliki riwayat alergi terhadap <span className="font-semibold text-state-danger">{drugName}</span>.
        Resep ini mengandung komponen obat tersebut. Lanjutkan hanya jika secara klinis diperlukan.
      </p>
    </Modal>
  )
}
