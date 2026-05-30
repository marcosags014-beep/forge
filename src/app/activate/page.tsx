'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { setProUser } from '@/lib/store'

export default function ActivatePage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) { setStatus('error'); setError('No session ID found.'); return }

    fetch(`/api/activate?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.token && data.until) {
          setProUser(data.token, data.until, data.customerId ?? undefined)
          setStatus('success')
        } else {
          setStatus('error')
          setError(data.error ?? 'Could not activate Pro. Contact support.')
        }
      })
      .catch(() => { setStatus('error'); setError('Network error. Try refreshing.') })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-sm w-full">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold mb-2">Activating Pro…</h2>
            <p className="text-sm text-muted-foreground">Verifying your payment with Stripe</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">You&apos;re Pro 🔥</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Unlimited Oracle access is now active on this device. Enjoy.
            </p>
            <Link href="/oracle"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              <Sparkles className="w-4 h-4" />
              Open Oracle
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Activation failed</h2>
            <p className="text-sm text-muted-foreground mb-2">{error}</p>
            <p className="text-xs text-muted-foreground mb-6">
              If you were charged, email <span className="text-primary">support@forge-life.app</span>
            </p>
            <Link href="/pricing" className="text-sm text-primary hover:underline">Back to pricing</Link>
          </>
        )}
      </div>
    </div>
  )
}
