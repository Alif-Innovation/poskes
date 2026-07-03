import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AuthUser } from '@/context/AuthContext'
import { useAuth } from '@/context/AuthContext'
import { useNotification } from '@/context/NotificationContext'
import type { LoginFormValues } from '../validation/loginSchema'

/** Placeholder auth call — swap the mock resolve for a real API request. */
async function authenticate(values: LoginFormValues): Promise<AuthUser> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return {
    id: crypto.randomUUID(),
    username: values.username,
    fullName: 'Pengguna Demo',
    role: 'SUPER_ADMIN',
  }
}

export function useLogin() {
  const { login } = useAuth()
  const { notify } = useNotification()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (values: LoginFormValues) => {
    setIsSubmitting(true)
    try {
      const user = await authenticate(values)
      login(user)
      notify('success', `Selamat datang, ${user.fullName}`)
      navigate('/dashboard')
    } catch {
      notify('danger', 'Username atau password salah')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting }
}
