'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { pullFromCloud, syncOnSignIn, pushAllToCloud } from '@/lib/sync'
import { Cloud, CloudOff, RefreshCw } from 'lucide-react'

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error'

// Global sync status — exported so other components can read it if needed
let _globalStatus: SyncStatus = 'idle'
const _listeners = new Set<(s: SyncStatus) => void>()

export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>(_globalStatus)
  useEffect(() => {
    _listeners.add(setStatus)
    return () => { _listeners.delete(setStatus) }
  }, [])
  return status
}

function emit(s: SyncStatus) {
  _globalStatus = s
  _listeners.forEach(fn => fn(s))
}

export function SyncProvider() {
  const doSync = useCallback(async (force = false) => {
    if (!supabase) return
    emit('syncing')
    try {
      const { merged } = await pullFromCloud(force)
      emit('synced')
      if (merged) {
        // Data changed from another device — reload page to reflect updates
        window.location.reload()
      }
    } catch {
      emit('error')
    }
  }, [])

  useEffect(() => {
    if (!supabase) return

    // Pull on page load
    doSync()

    // Auth state — sync on sign-in
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        emit('syncing')
        try {
          const merged = await syncOnSignIn()
          emit('synced')
          if (merged) window.location.reload()
        } catch { emit('error') }
      }
      if (event === 'SIGNED_OUT') emit('offline')
    })

    // ── Realtime: listen for changes pushed by another device ──────────────
    let realtimeSub: ReturnType<typeof supabase.channel> | null = null

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      realtimeSub = supabase!
        .channel(`forge_sync_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'forge_stores',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Another device pushed data — merge it in
            doSync()
          }
        )
        .subscribe()
    })

    return () => {
      authSub.unsubscribe()
      realtimeSub?.unsubscribe()
    }
  }, [doSync])

  return null
}

// ── Sync status dot — drop this anywhere in the layout ────────────────────────

export function SyncDot() {
  const status = useSyncStatus()
  if (!supabase) return null

  const config: Record<SyncStatus, { icon: React.ElementType; color: string; title: string }> = {
    idle:    { icon: Cloud,      color: 'text-muted-foreground/30', title: 'Sync idle' },
    syncing: { icon: RefreshCw,  color: 'text-primary/60',          title: 'Syncing…' },
    synced:  { icon: Cloud,      color: 'text-green-400/60',        title: 'Synced' },
    offline: { icon: CloudOff,   color: 'text-muted-foreground/30', title: 'Not signed in' },
    error:   { icon: CloudOff,   color: 'text-red-400/60',          title: 'Sync error' },
  }

  const { icon: Icon, color, title } = config[status]

  return (
    <button
      title={title}
      onClick={() => { emit('syncing'); pushAllToCloud().then(() => emit('synced')) }}
      className={`${color} transition-colors hover:opacity-100`}
    >
      <Icon className={`w-3.5 h-3.5 ${status === 'syncing' ? 'animate-spin' : ''}`} />
    </button>
  )
}
