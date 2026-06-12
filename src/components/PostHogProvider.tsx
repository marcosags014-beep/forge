'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initAnalytics, capture } from '@/lib/analytics'
import { checkAndUnlockAchievements } from '@/lib/store'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => { initAnalytics() }, [])

  useEffect(() => {
    // Check achievements on every navigation — fixes "only unlocks on Mind page" bug
    try { checkAndUnlockAchievements() } catch {}

    // Track retention milestones based on join date
    try {
      const profileRaw = localStorage.getItem('forge_profile')
      if (!profileRaw) return
      const profile = JSON.parse(profileRaw)
      if (!profile?.joinedAt) return
      const daysSince = Math.floor((Date.now() - new Date(profile.joinedAt).getTime()) / 86400000)
      const milestones = JSON.parse(localStorage.getItem('forge_milestones') ?? '{}')
      if (daysSince >= 1 && !milestones.d1)  { capture('d1_active');  localStorage.setItem('forge_milestones', JSON.stringify({...milestones, d1: true})) }
      if (daysSince >= 7 && !milestones.d7)  { capture('d7_active');  localStorage.setItem('forge_milestones', JSON.stringify({...milestones, d7: true})) }
      if (daysSince >= 30 && !milestones.d30) { capture('d30_active'); localStorage.setItem('forge_milestones', JSON.stringify({...milestones, d30: true})) }
    } catch {}
  }, [pathname])

  return <>{children}</>
}
