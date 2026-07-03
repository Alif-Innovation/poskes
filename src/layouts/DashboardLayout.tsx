import { NavLink, Outlet } from 'react-router-dom'
import { LogOut, Stethoscope } from 'lucide-react'
import clsx from 'clsx'
import { NAV_ITEMS, ROLE_LABELS } from '@/config/constants'
import { useAuth } from '@/context/AuthContext'

/**
 * PRD §4 Main Grid: fixed-width left sidebar (256px) + scrollable content area.
 * Sidebar uses brand-secondary (Slate 900) as specified for nav/title surfaces.
 */
export function DashboardLayout() {
  const { user, logout, hasRole } = useAuth()

  const visibleItems = NAV_ITEMS.filter((item) => !user || hasRole(...item.roles))

  return (
    <div className="flex min-h-screen bg-bg-main">
      <aside className="fixed inset-y-0 left-0 flex w-sidebar flex-col bg-brand-secondary text-slate-200">
        <div className="flex items-center gap-2 px-5 py-5 text-white">
          <Stethoscope className="h-6 w-6 text-brand-primary" />
          <span className="text-lg font-semibold">Smart Health Hub</span>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-primary text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="border-t border-slate-800 px-5 py-4">
            <p className="text-sm font-medium text-white">{user.fullName}</p>
            <p className="text-xs text-slate-400">{ROLE_LABELS[user.role]}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        )}
      </aside>

      <main className="ml-sidebar min-h-screen flex-1 overflow-y-auto px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}
