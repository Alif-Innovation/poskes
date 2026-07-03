import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, UserRound } from 'lucide-react'
import clsx from 'clsx'
import { Card, CardBody, CardHeader } from '@/components/Card'
import { Table, TableBody, TableHead, TableRow } from '@/components/Table'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useAuth } from '@/context/AuthContext'
import { useNotification } from '@/context/NotificationContext'
import { ICD10_REFERENCE } from '@/config/icd10'
import { ICD9_REFERENCE } from '@/config/icd9'
import { usePasienDirectory } from '@/features/pasien/hooks/usePasienDirectory'
import { PasienFormModal } from '@/features/pasien/components/PasienFormModal'
import { classifyAllergy } from '@/features/pasien/validation/pasienSchema'
import type { Pasien } from '@/features/pasien/types'
import { useObatDirectory } from '@/features/farmasi/hooks/useObatDirectory'
import { createSoapSchema, type SoapFormValues } from '../validation/soapSchema'
import { ResepRow } from '../components/ResepRow'
import { AllergyAlertModal } from '../components/AllergyAlertModal'
import { PatientSelectorCard } from '../components/PatientSelectorCard'
import { useKunjunganDirectory } from '../hooks/useKunjunganDirectory'

const EMPTY_SOAP_VALUES = {
  sSubjective: '',
  oObjective: { tensi: '', suhu: undefined, nadi: undefined, beratBadan: undefined },
  aAssessmentIcd10: [],
  pPlanTindakanIcd9: [],
  resepDetail: [],
}

const TABS = [
  { key: 'S', label: 'Subjective' },
  { key: 'O', label: 'Objective' },
  { key: 'A', label: 'Assessment' },
  { key: 'P', label: 'Plan & Resep' },
] as const

export function SoapFormPage() {
  const { user, hasRole } = useAuth()
  const { notify } = useNotification()
  const { pasienList, addPasien } = usePasienDirectory()
  const { obatList } = useObatDirectory()
  const { addKunjungan } = useKunjunganDirectory()

  const [activePatient, setActivePatient] = useState<Pasien | null>(null)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['key']>('S')
  const [pendingAllergy, setPendingAllergy] = useState<{ drugName: string; values: SoapFormValues } | null>(null)

  const stockByObatId = useMemo(
    () => Object.fromEntries(obatList.map((o) => [o.id, o.stok])),
    [obatList],
  )
  const soapSchema = useMemo(() => createSoapSchema(stockByObatId), [stockByObatId])

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<SoapFormValues>({
    resolver: zodResolver(soapSchema),
    mode: 'onChange',
    defaultValues: EMPTY_SOAP_VALUES,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'resepDetail' })
  const selectedIcd10 = watch('aAssessmentIcd10')
  const selectedIcd9 = watch('pPlanTindakanIcd9')

  // Starting a fresh visit for a newly-selected patient should not carry over the previous patient's inputs.
  const lastPatientIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (activePatient && lastPatientIdRef.current !== activePatient.id) {
      reset(EMPTY_SOAP_VALUES)
      setActiveTab('S')
      lastPatientIdRef.current = activePatient.id
    }
  }, [activePatient, reset])

  function toggleSelection(field: 'aAssessmentIcd10' | 'pPlanTindakanIcd9', code: string) {
    const current = field === 'aAssessmentIcd10' ? selectedIcd10 : selectedIcd9
    const next = current.includes(code) ? current.filter((c) => c !== code) : [...current, code]
    setValue(field, next, { shouldValidate: true })
  }

  function finalizeSave(values: SoapFormValues) {
    if (!activePatient) return

    addKunjungan({
      pasienId: activePatient.id,
      nomorRm: activePatient.nomorRm,
      namaPasien: activePatient.namaLengkap,
      dokterId: user?.id ?? 'unknown-user',
      sSubjective: values.sSubjective,
      oObjective: values.oObjective,
      aAssessmentIcd10: values.aAssessmentIcd10,
      pPlanTindakanIcd9: values.pPlanTindakanIcd9,
      resepDetail: values.resepDetail,
    })

    notify('success', 'Rekam medis SOAP berhasil disimpan, resep masuk ke antrean farmasi')
    setActivePatient(null)
  }

  const onSubmit = (values: SoapFormValues) => {
    const allergy = classifyAllergy(activePatient?.riwayatAlergi)
    const contraindicated =
      allergy.hasAllergy &&
      values.resepDetail.find((item) => item.namaObat.toLowerCase().includes(allergy.label.toLowerCase()))

    if (contraindicated) {
      setPendingAllergy({ drugName: allergy.label, values })
      return
    }
    finalizeSave(values)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-brand-secondary">Lembar Pemeriksaan SOAP</h1>

      <PatientSelectorCard
        pasienList={pasienList}
        activePatient={activePatient}
        onSelectPatient={setActivePatient}
        onClearPatient={() => setActivePatient(null)}
        onOpenRegisterModal={() => setRegisterModalOpen(true)}
      />

      <Card>
        <CardHeader>
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                disabled={!activePatient}
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  !activePatient && 'cursor-not-allowed text-slate-300',
                  activePatient && activeTab === tab.key && 'bg-brand-primary text-white',
                  activePatient && activeTab !== tab.key && 'text-slate-500 hover:bg-slate-100',
                )}
              >
                {tab.key} — {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardBody>
          {!activePatient ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <UserRound className="h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-400">
                Silakan pilih pasien terlebih dahulu untuk memulai pemeriksaan SOAP.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
              {activeTab === 'S' && (
                <div>
                  <label className="shh-label" htmlFor="sSubjective">
                    Keluhan Utama Pasien
                  </label>
                  <textarea
                    id="sSubjective"
                    rows={5}
                    {...register('sSubjective')}
                    className={`w-full rounded-lg border bg-bg-surface px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${
                      errors.sSubjective ? 'border-state-danger' : 'border-border focus:border-brand-primary'
                    }`}
                  />
                  {errors.sSubjective && <p className="shh-error-text">{errors.sSubjective.message}</p>}
                </div>
              )}

              {activeTab === 'O' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Tensi (sistole/diastole)"
                    placeholder="120/80"
                    error={errors.oObjective?.tensi?.message}
                    {...register('oObjective.tensi')}
                  />
                  <Input
                    label="Suhu (°C)"
                    type="number"
                    step="0.1"
                    error={errors.oObjective?.suhu?.message}
                    {...register('oObjective.suhu')}
                  />
                  <Input label="Nadi (bpm)" type="number" error={errors.oObjective?.nadi?.message} {...register('oObjective.nadi')} />
                  <Input
                    label="Berat Badan (kg)"
                    type="number"
                    step="0.1"
                    error={errors.oObjective?.beratBadan?.message}
                    {...register('oObjective.beratBadan')}
                  />
                </div>
              )}

              {activeTab === 'A' && (
                <div>
                  <span className="shh-label">Diagnosis (ICD-10) — minimal 1</span>
                  <div className="flex flex-wrap gap-2">
                    {ICD10_REFERENCE.map((entry) => (
                      <button
                        type="button"
                        key={entry.code}
                        onClick={() => toggleSelection('aAssessmentIcd10', entry.code)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          selectedIcd10.includes(entry.code)
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                            : 'border-border text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {entry.label}
                      </button>
                    ))}
                  </div>
                  {errors.aAssessmentIcd10 && <p className="shh-error-text">{errors.aAssessmentIcd10.message}</p>}
                </div>
              )}

              {activeTab === 'P' && (
                <div className="flex flex-col gap-5">
                  <div>
                    <span className="shh-label">Rencana Tindakan (ICD-9-CM)</span>
                    <div className="flex flex-wrap gap-2">
                      {ICD9_REFERENCE.map((entry) => (
                        <button
                          type="button"
                          key={entry.code}
                          onClick={() => toggleSelection('pPlanTindakanIcd9', entry.code)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            selectedIcd9.includes(entry.code)
                              ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                              : 'border-border text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {entry.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="shh-label mb-0">Resep Obat</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => append({ obatId: '', namaObat: '', jumlahMinta: 1, aturanPakai: '' })}
                      >
                        <Plus className="h-4 w-4" /> Tambah Resep
                      </Button>
                    </div>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <th>Nama Obat</th>
                          <th>Jumlah</th>
                          <th>Aturan Pakai</th>
                          <th></th>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fields.length === 0 && (
                          <TableRow>
                            <td colSpan={4} className="py-4 text-center text-sm text-slate-400">
                              Belum ada resep ditambahkan.
                            </td>
                          </TableRow>
                        )}
                        {fields.map((field, index) => (
                          <ResepRow
                            key={field.id}
                            index={index}
                            register={register}
                            errors={errors}
                            obatOptions={obatList}
                            onSelectObat={(obat) => {
                              setValue(`resepDetail.${index}.obatId`, obat.id, { shouldValidate: true })
                              setValue(`resepDetail.${index}.namaObat`, obat.nama, { shouldValidate: true })
                            }}
                            onRemove={() => remove(index)}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="flex justify-end border-t border-border pt-4">
                <Button type="submit" disabled={!isValid}>
                  Simpan Rekam Medis
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>

      <PasienFormModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSubmit={(values) => {
          const newPasien = addPasien(values)
          setActivePatient(newPasien)
          notify('success', `Pasien ${newPasien.namaLengkap} (${newPasien.nomorRm}) berhasil didaftarkan`)
        }}
      />

      <AllergyAlertModal
        open={!!pendingAllergy}
        drugName={pendingAllergy?.drugName ?? ''}
        onCancel={() => setPendingAllergy(null)}
        onBypass={() => {
          if (!hasRole('TENAGA_MEDIS', 'SUPER_ADMIN')) {
            notify('danger', 'Bypass hanya dapat dilakukan oleh Dokter / Tenaga Medis')
            return
          }
          if (pendingAllergy) finalizeSave(pendingAllergy.values)
          setPendingAllergy(null)
        }}
      />
    </div>
  )
}
