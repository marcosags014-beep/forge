'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sidebar } from './sidebar'
import { QuickLogFAB } from './quick-log-fab'
import { BottomNav } from './bottom-nav'
import { ErrorBoundary } from './error-boundary'
import { Menu, Flame } from 'lucide-react'
import Link from 'next/link'
import { profileStore } from '@/lib/store'

const NO_SIDEBAR = ['/setup', '/pricing', '/blog', '/for/', '/privacy', '/terms', '/about']

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [setupChecked, setSetupChecked] = useState(false)
  const hideSidebar = NO_SIDEBAR.some(p => path.startsWith(p))

  useEffect(() => {
    if (hideSidebar) { setSetupChecked(true); return }
    const profile = profileStore.get()
    if (!profile?.setupComplete) {
      router.replace('/setup')
    } else {
      setSetupChecked(true)
    }
  }, [hideSidebar, router])

  if (hideSidebar) return <>{children}</>
  if (!setupChecked) return null

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-sidebar/95 backdrop-blur-sm border-b border-border md:hidden">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">FORGE</span>
        </Link>
        <div className="w-9" /> {/* spacer */}
      </div>

      <main className="md:ml-60 min-h-screen pt-14 md:pt-0 pb-20 md:pb-0">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      <BottomNav />
      <QuickLogFAB />
    </>
  )
}
