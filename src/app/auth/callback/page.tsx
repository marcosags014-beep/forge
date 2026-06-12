'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Flame } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    if (!supabase) { router.replace('/settings'); return }

    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(() => router.replace('/settings'))
        .catch(() => router.replace('/settings'))
    } else {
      router.replace('/settings')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Flame className="w-7 h-7 text-primary-foreground" />
        </div>
        <p className="text-muted-foreground text-sm animate-pulse">Connecting your account…</p>
      </div>
    </div>
  )
}
