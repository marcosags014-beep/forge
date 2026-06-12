'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { pullFromCloud } from '@/lib/sync'

export function SyncProvider() {
  useEffect(() => {
    if (!supabase) return

    // Pull on initial load if already logged in
    pullFromCloud()

    // Pull whenever user signs in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        pullFromCloud().then(pulled => {
          if (pulled) window.location.reload()
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return null
}
