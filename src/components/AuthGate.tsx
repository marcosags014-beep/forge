'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Flame, Loader2 } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

interface AuthGateProps {
  children: React.ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  // If Supabase isn't configured, let everything through
  if (!supabase) return <>{children}</>

  return <AuthGateInner>{children}</AuthGateInner>
}

function AuthGateInner({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'signed-in' | 'signed-out'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return

    // Check current session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setStatus(session ? 'signed-in' : 'signed-out')
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'signed-in' : 'signed-out')
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signInWithGoogle() {
    if (!supabase) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      })
      if (error) setError(error.message)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  if (status === 'signed-in') {
    return <>{children}</>
  }

  // Not signed in — show the login gate
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 mb-5">
          <Flame className="w-9 h-9 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">FORGE</h1>
        <p className="text-sm text-muted-foreground mt-1">Life OS</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-2xl">
        <h2 className="text-xl font-bold mb-1 text-center">Welcome back</h2>
        <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
          Sign in to access your dashboard.<br />Your data syncs across all your devices.
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-sm py-3.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          ) : (
            <GoogleIcon />
          )}
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {error && (
          <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-xs text-red-400 text-center leading-relaxed">{error}</p>
            <p className="text-[11px] text-muted-foreground text-center mt-1">
              Make sure Google is enabled in Supabase → Auth → Providers and this URL is whitelisted:{' '}
              <code className="text-primary text-[10px]">{typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback</code>
            </p>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-border">
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            Local-first · Data stays on your device · GDPR compliant
          </p>
        </div>
      </div>
    </div>
  )
}
