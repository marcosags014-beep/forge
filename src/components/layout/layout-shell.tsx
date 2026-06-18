'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sidebar } from './sidebar'
import { BottomNav } from './bottom-nav'
import { ErrorBoundary } from './error-boundary'
import { AuthGate } from '@/components/AuthGate'
import { Menu, Flame } from 'lucide-react'
import Link from 'next/link'
import { profileStore } from '@/lib/store'
import { SyncDot } from '@/components/SyncProvider'

const NO_SIDEBAR = ['/', '/setup', '/pricing', '/blog', '/for/', '/vs/', '/privacy', '/terms', '/about', '/auth', '/beta', '/launch']

// Routes where Google auth is NOT required (public marketing/info pages + auth flow itself)
const PUBLIC_ROUTES = ['/pricing', '/blog', '/for/', '/vs/', '/privacy', '/terms', '/about', '/auth', '/beta', '/launch']

function isPublicRoute(path: string) {
  return PUBLIC_ROUTES.some(p => p.endsWith('/') ? path.startsWith(p) : path === p || path.startsWith(p + '/'))
}

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Synchronously detect if this is an active app user — avoids layout flash
  const [isAppUser] = useState(() => {
    if (typeof window === 'undefined') return false
    try { return !!(profileStore.get()?.setupComplete) } catch { return false }
  })

  // Skip async verification if we already know the user from localStorage —
  // prevents the null-flash that hides the menu when navigating back to home
  const [setupChecked, setSetupChecked] = useState(() => isAppUser)

  // '/' doubles as marketing landing AND dashboard:
  // - logged-in users get the full nav
  // - visitors without a profile get no nav (marketing page)
  const hideSidebar = isAppUser
    ? NO_SIDEBAR.filter(p => p !== '/').some(p => path.startsWith(p))
    : NO_SIDEBAR.some(p => p === '/' ? path === '/' : path.startsWith(p))

  useEffect(() => {
    if (hideSidebar) { setSetupChecked(true); return }
    const profile = profileStore.get()
    if (!profile?.setupComplete) {
      router.replace('/setup')
    } else {
      setSetupChecked(true)
    }
  }, [hideSidebar, router])

  if (hideSidebar) {
    // Public pages + home marketing page: wrap with AuthGate only if not truly public
    if (isPublicRoute(path)) return <>{children}</>
    // Home ('/') and setup when not in the "public list" still need auth
    return <AuthGate>{children}</AuthGate>
  }
  if (!setupChecked) return null

  return (
    <AuthGate>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pb-3 bg-sidebar/95 backdrop-blur-sm border-b border-border md:hidden"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">FORGE</span>
        </Link>
        <div className="w-9 flex items-center justify-center"><SyncDot /></div>
      </div>

      <main className="md:ml-60 min-h-screen md:pt-0 pb-20 md:pb-0"
        style={{ paddingTop: 'max(56px, calc(env(safe-area-inset-top) + 44px))' }}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      <BottomNav />
    </AuthGate>
  )
}
