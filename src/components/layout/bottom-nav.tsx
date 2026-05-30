'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, Sparkles, Target, BarChart3 } from 'lucide-react'

const TABS = [
  { href: '/',        icon: Home,     label: 'Home' },
  { href: '/vitals',  icon: Heart,    label: 'Vitals' },
  { href: '/oracle',  icon: Sparkles, label: 'Oracle', primary: true },
  { href: '/mind',    icon: Target,   label: 'Mind' },
  { href: '/review',  icon: BarChart3, label: 'Review' },
]

export function BottomNav() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-sidebar/95 backdrop-blur-md border-t border-sidebar-border pb-safe">
      <div className="flex items-center justify-around px-2 pt-1 pb-2">
        {TABS.map(({ href, icon: Icon, label, primary }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          if (primary) return (
            <Link key={href} href={href}
              className="flex flex-col items-center justify-center -mt-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                active
                  ? 'bg-primary shadow-primary/50 scale-105'
                  : 'bg-primary/85 shadow-primary/20 hover:bg-primary/95'
              }`}
                style={active ? { boxShadow: '0 0 20px oklch(0.705 0.213 47.604 / 45%), 0 4px 12px oklch(0 0 0 / 30%)' } : undefined}>
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className={`text-[9px] mt-1 font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            </Link>
          )
          return (
            <Link key={href} href={href}
              className="relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all">
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
              )}
              <Icon className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-[9px] font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
