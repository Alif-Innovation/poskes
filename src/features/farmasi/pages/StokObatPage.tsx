import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/Card'
import { Table, TableBody, TableHead, TableRow } from '@/components/Table'
import { Button } from '@/components/Button'
import { useNotification } from '@/context/NotificationContext'
import { StockRow } from '../components/StockRow'
import { stokFormSchema, type StokFormValues } from '../components/stokFormTypes'
import { useObatDirectory } from '../hooks/useObatDirectory'

const emptyRow = { obatId: '', batchNumber: '', stockQty: 0, expiredDate: '' }

/**
 * PRD §7 Form 3 (Manajemen Stok Masuk & Opname): dynamic inline-editable rows.
 * "Simpan Stok" stays locked until every row passes validation.
 */
export function StokObatPage() {
  const { notify } = useNotification()
  const { obatList, addBatches } = useObatDirectory()
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<StokFormValues>({
    resolver: zodResolver(stokFormSchema),
    mode: 'onChange',
    defaultValues: { rows: [emptyRow] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'rows' })
  const rows = watch('rows')

  const onSubmit = (values: StokFormValues) => {
    addBatches(values.rows)
    notify('success', `${values.rows.length} baris stok berhasil disimpan`)
    reset({ rows: [emptyRow] })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-brand-secondary">Manajemen Stok Masuk & Opname</h1>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Penerimaan Batch Obat</CardTitle>
          <Button type="button" size="sm" variant="ghost" onClick={() => append(emptyRow)}>
            <Plus className="h-4 w-4" /> Tambah Baris
          </Button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Table>
              <TableHead>
                <TableRow>
                  <th>Nama Obat</th>
                  <th>Batch Number</th>
                  <th>Jumlah Stok</th>
                  <th>Expired Date</th>
                  <th></th>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <StockRow
                    key={field.id}
                    index={index}
                    register={register}
                    errors={errors}
                    obatOptions={obatList}
                    expiredDate={rows?.[index]?.expiredDate ?? ''}
                    onRemove={() => remove(index)}
                  />
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={!isValid}>
                Simpan Stok
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
