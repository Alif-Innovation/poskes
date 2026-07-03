import { Badge } from '@/components/Badge'
import { classifyAllergy } from '../validation/pasienSchema'

export function AllergyBadge({ riwayatAlergi }: { riwayatAlergi?: string }) {
  const { hasAllergy, label } = classifyAllergy(riwayatAlergi)

  if (!hasAllergy) {
    return <Badge variant="neutral">Tidak Ada</Badge>
  }

  return (
    <Badge variant="danger" pulse>
      ⚠ Alergi: {label}
    </Badge>
  )
}
