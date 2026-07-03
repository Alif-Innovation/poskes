import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Role } from '@/config/constants'

export interface AuthUser {
  id: string
  username: string
  fullName: string
  role: Role
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
  hasRole: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login: (nextUser) => setUser(nextUser),
      logout: () => setUser(null),
      hasRole: (...roles) => (user ? roles.includes(user.role) : false),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
