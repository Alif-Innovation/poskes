/** Age in whole years as of today, given a `tanggal_lahir` (YYYY-MM-DD). */
export function calculateAge(tanggalLahir: string): number {
  const dob = new Date(tanggalLahir)
  if (Number.isNaN(dob.getTime())) return 0

  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
  if (!hasHadBirthdayThisYear) age -= 1

  return age
}
