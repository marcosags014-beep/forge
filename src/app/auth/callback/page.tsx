'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Flame } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    if (!supabase) { router.replace('/settings'); return }

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const tokenHash = params.get('token_hash')
    const type = params.get('type') as 'email' | 'recovery' | 'magiclink' | null

    async function handleCallback() {
      try {
        if (code) {
          // OAuth PKCE flow (Google, etc.)
          await supabase!.auth.exchangeCodeForSession(code)
        } else if (tokenHash && type) {
          // Magic link / OTP flow
          await supabase!.auth.verifyOtp({ token_hash: tokenHash, type })
        }
      } catch {
        // Session may already be set via URL fragment — Supabase handles it
      }
      router.replace('/settings')
    }

    handleCallback()
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
