import { Outlet } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'

/** PRD §7 Form 1: centered card layout on the auth background. */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-main px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-primary text-white">
            <Stethoscope className="h-6 w-6" />
          </span>
          <h1 className="text-lg font-semibold text-brand-secondary">Smart Health Hub</h1>
        </div>
        <div className="shh-card p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
