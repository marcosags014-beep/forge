'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flame, Home, Heart, Dumbbell, TrendingUp, Target, Sparkles, Lightbulb, BarChart3, BookOpen, Settings, X, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { calculateLifeScores } from '@/lib/store'

const nav = [
  { href: '/',         label: 'Command',   icon: Home,       desc: 'Life Score & overview' },
  { href: '/insights', label: 'Insights',  icon: Lightbulb,  desc: 'AI-powered analysis',   badge: 'NEW' },
  { href: '/vitals',   label: 'Vitals',    icon: Heart,      desc: 'Sleep, HRV, mood' },
  { href: '/body',     label: 'Body',      icon: Dumbbell,   desc: 'Workouts & nutrition' },
  { href: '/wealth',   label: 'Wealth',    icon: TrendingUp, desc: 'Finances & budget' },
  { href: '/mind',     label: 'Mind',      icon: Target,     desc: 'Goals, habits, tasks' },
  { href: '/journal',   label: 'Journal',   icon: BookOpen,   desc: 'Daily reflections' },
  { href: '/timeline',  label: 'Timeline',  icon: Clock,      desc: 'Hourly activity log' },
  { href: '/review',    label: 'Review',    icon: BarChart3,  desc: 'Weekly performance' },
  { href: '/oracle',   label: 'Oracle',    icon: Sparkles,   desc: 'AI life coach' },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const path = usePathname()
  const [lifeScore, setLifeScore] = useState(0)

  useEffect(() => {
    const scores = calculateLifeScores()
    setLifeScore(scores.overall)
  }, [])

  const scoreColor = lifeScore >= 75 ? '#22c55e' : lifeScore >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="sidebar-overlay md:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        'fixed left-0 top-0 h-full w-60 flex flex-col bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300',
        'md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary shadow-lg shadow-primary/30 animate-glow">
              <Flame className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">FORGE</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-widest">Life OS</div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Life Score chip */}
        {lifeScore > 0 && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-secondary flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Life Score</span>
            <span className="text-sm font-bold" style={{ color: scoreColor }}>{lifeScore}</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
          {nav.map(({ href, label, icon: Icon, desc, badge }) => {
            const active = href === '/' ? path === '/' : path.startsWith(href)
            return (
              <Link key={href} href={href} onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
                  active
                    ? 'bg-primary/10 text-primary border border-primary/15 forge-gradient-border'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}>
                <Icon className={cn('w-4 h-4 flex-shrink-0 transition-colors', active ? 'text-primary' : 'group-hover:text-foreground')} />
                <div className="min-w-0 flex-1">
                  <div className={cn('text-sm font-medium flex items-center gap-2', active ? 'text-primary' : '')}>
                    {label}
                    {badge && !active && (
                      <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold tracking-wide">{badge}</span>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">{desc}</div>
                </div>
                {active && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-3 space-y-2">
          <Link href="/settings" onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-muted-foreground hover:bg-secondary hover:text-foreground',
              path.startsWith('/settings') && 'bg-primary/10 text-primary border border-primary/15'
            )}>
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
          </Link>

          <Link href="/pricing" onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all">
            <div>
              <div className="text-xs font-semibold text-primary">FORGE Pro</div>
              <div className="text-[10px] text-muted-foreground">Oracle chat · 90-day history · export</div>
            </div>
            <span className="text-[10px] text-primary font-bold">→</span>
          </Link>
        </div>

        <div className="px-5 py-3 border-t border-sidebar-border">
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Build the life you deserve</p>
        </div>
      </aside>
    </>
  )
}
