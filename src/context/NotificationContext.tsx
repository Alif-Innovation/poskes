import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type NotificationVariant = 'success' | 'warning' | 'danger' | 'info'

export interface Notification {
  id: string
  variant: NotificationVariant
  message: string
}

interface NotificationContextValue {
  notifications: Notification[]
  notify: (variant: NotificationVariant, message: string) => void
  dismiss: (id: string) => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

const VARIANT_STYLES: Record<NotificationVariant, string> = {
  success: 'border-state-success/30 bg-state-success/10 text-state-success',
  warning: 'border-state-warning/30 bg-state-warning/10 text-state-warning',
  danger: 'border-state-danger/30 bg-state-danger/10 text-state-danger',
  info: 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary',
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const notify = useCallback(
    (variant: NotificationVariant, message: string) => {
      const id = crypto.randomUUID()
      setNotifications((prev) => [...prev, { id, variant, message }])
      setTimeout(() => dismiss(id), 5000)
    },
    [dismiss],
  )

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm font-medium shadow-sm ${VARIANT_STYLES[n.variant]}`}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within a NotificationProvider')
  return ctx
}
