import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/Modal'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { pasienSchema, type PasienFormValues } from '../validation/pasienSchema'

interface PasienFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: PasienFormValues) => void
}

/**
 * PRD §7 Form 2: 2-column grid form inside a modal, native date picker for
 * tanggal_lahir, radio buttons for jenis_kelamin.
 */
export function PasienFormModal({ open, onClose, onSubmit }: PasienFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<PasienFormValues>({
    resolver: zodResolver(pasienSchema),
    mode: 'onChange',
    defaultValues: { namaLengkap: '', tanggalLahir: '', jenisKelamin: undefined, kontak: '', alamat: '', riwayatAlergi: '' },
  })

  const submit = (values: PasienFormValues) => {
    onSubmit(values)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrasi Pasien Baru">
      <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
        <div className="sm:col-span-2">
          <Input label="Nama Lengkap" error={errors.namaLengkap?.message} {...register('namaLengkap')} />
        </div>

        <Input type="date" label="Tanggal Lahir" error={errors.tanggalLahir?.message} {...register('tanggalLahir')} />

        <div>
          <span className="shh-label">Jenis Kelamin</span>
          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="radio" value="L" {...register('jenisKelamin')} />
              Laki-laki
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="radio" value="P" {...register('jenisKelamin')} />
              Perempuan
            </label>
          </div>
          {errors.jenisKelamin && <p className="shh-error-text">{errors.jenisKelamin.message}</p>}
        </div>

        <Input
          label="Kontak"
          placeholder="08123456789"
          inputMode="numeric"
          error={errors.kontak?.message}
          {...register('kontak')}
        />

        <Input label="Alamat" {...register('alamat')} />

        <div className="sm:col-span-2">
          <Input
            label="Riwayat Alergi"
            placeholder='Kosongkan atau isi "Tidak Ada" jika tidak ada riwayat'
            hint='Isi nama obat spesifik (mis. "Amoxicillin") untuk memicu badge peringatan.'
            {...register('riwayatAlergi')}
          />
        </div>

        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={!isValid}>
            Simpan Pasien
          </Button>
        </div>
      </form>
    </Modal>
  )
}
