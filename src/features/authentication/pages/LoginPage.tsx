import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { PasswordInput } from '../components/PasswordInput'
import { loginSchema, type LoginFormValues } from '../validation/loginSchema'
import { useLogin } from '../hooks/useLogin'

export function LoginPage() {
  const { submit, isSubmitting } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { username: '', password: '' },
  })

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
      <div>
        <h2 className="text-base font-semibold text-brand-secondary">Masuk ke akun Anda</h2>
        <p className="text-sm text-slate-500">Gunakan kredensial staf klinik untuk melanjutkan.</p>
      </div>

      <Input
        label="Username"
        placeholder="contoh: drwijaya01"
        autoComplete="username"
        error={errors.username?.message}
        {...register('username')}
      />

      <PasswordInput
        label="Password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* PRD §7 Form 1: submit button disabled while form data is invalid. */}
      <Button type="submit" disabled={!isValid || isSubmitting} className="mt-2 w-full">
        {isSubmitting ? 'Memproses...' : 'Masuk'}
      </Button>
    </form>
  )
}
