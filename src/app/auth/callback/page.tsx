'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { profileStore } from '@/lib/store'
import { Flame } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    if (!supabase) { router.replace('/'); return }

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const tokenHash = params.get('token_hash')
    const type = params.get('type') as 'email' | 'recovery' | 'magiclink' | null

    async function handleCallback() {
      try {
        if (code) {
          await supabase!.auth.exchangeCodeForSession(code)
        } else if (tokenHash && type) {
          await supabase!.auth.verifyOtp({ token_hash: tokenHash, type })
        }
      } catch {
        // Session may already be set via URL fragment
      }

      // Where to go after auth:
      // 1. Use the saved return URL if present (set before OAuth redirect)
      // 2. Fall back to '/' if the user has a completed profile
      // 3. Fall back to '/setup' if no profile exists (brand-new device / cleared storage)
      let dest = '/'
      try {
        const saved = sessionStorage.getItem('forge_auth_return')
        sessionStorage.removeItem('forge_auth_return')
        // Only accept same-origin paths (must start with / and not contain a protocol)
        if (saved && /^\/[^/]/.test(saved) && !saved.includes('://')) {
          dest = saved
        } else {
          const profile = profileStore.get()
          dest = profile?.setupComplete ? '/' : '/setup'
        }
      } catch {}
      router.replace(dest)
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
