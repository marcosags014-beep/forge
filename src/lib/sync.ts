import { supabase } from './supabase'

// All keys that flow to the cloud. Excludes ephemeral/billing keys.
export const SYNC_KEYS = [
  'vitals', 'workouts', 'nutrition', 'body', 'body_measurements',
  'finance', 'net_worth', 'subscriptions',
  'goals', 'habits', 'tasks',
  'journal', 'learning', 'supplements',
  'timeline', 'chat',
  'achievements', 'lifescore_history', 'alignment_history',
  'profile', 'body_photos',
]

const PUSH_TS_KEY = 'forge_last_push_ts'

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getUser() {
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

function getLocalPushTs(): number {
  try { return parseInt(localStorage.getItem(PUSH_TS_KEY) ?? '0') || 0 } catch { return 0 }
}

function readLocal(key: string): unknown {
  try {
    const raw = localStorage.getItem(`forge_${key}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(`forge_${key}`, JSON.stringify(value))
  } catch {}
}

// Merge two arrays by id — union with no duplicates, keeping most-recently seen
// copy when both sides have the same id. Falls back to concat for non-object arrays.
function mergeArrays(local: unknown, cloud: unknown): unknown {
  if (!Array.isArray(local) && !Array.isArray(cloud)) {
    // Object (e.g. profile) — shallow merge: local keys override cloud keys
    if (local && typeof local === 'object' && cloud && typeof cloud === 'object') {
      return { ...(cloud as object), ...(local as object) }
    }
    return local ?? cloud
  }
  const a: unknown[] = Array.isArray(local) ? local : []
  const b: unknown[] = Array.isArray(cloud) ? cloud : []

  // Check if items look like {id: string, ...}
  const hasIds = a.every(i => i && typeof i === 'object' && 'id' in (i as object)) &&
                 b.every(i => i && typeof i === 'object' && 'id' in (i as object))
  if (!hasIds) {
    // No ids — just take whichever is longer (safe for append-only arrays)
    return a.length >= b.length ? a : b
  }

  const map = new Map<string, unknown>()
  // Cloud first, then local overwrites (local is most recent from this device)
  for (const item of b) { map.set((item as { id: string }).id, item) }
  for (const item of a) { map.set((item as { id: string }).id, item) }
  return Array.from(map.values())
}

// ── Push ──────────────────────────────────────────────────────────────────────

export async function pushAllToCloud(): Promise<boolean> {
  const user = await getUser()
  if (!user || !supabase) return false
  try {
    const now = new Date().toISOString()
    const entries = SYNC_KEYS.map(key => ({
      user_id: user.id,
      key,
      value: readLocal(key) ?? [],
      updated_at: now,
    }))
    const { error } = await supabase
      .from('forge_stores')
      .upsert(entries, { onConflict: 'user_id,key' })
    if (!error) localStorage.setItem(PUSH_TS_KEY, Date.now().toString())
    return !error
  } catch { return false }
}

// ── Pull (merge) ──────────────────────────────────────────────────────────────

export async function pullFromCloud(forceAll = false): Promise<{ merged: boolean; keys: string[] }> {
  const user = await getUser()
  if (!user || !supabase) return { merged: false, keys: [] }
  try {
    const { data, error } = await supabase
      .from('forge_stores')
      .select('key, value, updated_at')
      .eq('user_id', user.id)
    if (error || !data?.length) return { merged: false, keys: [] }

    const localPushTs = getLocalPushTs()
    const mergedKeys: string[] = []

    for (const row of data) {
      if (row.value === null || row.value === undefined) continue

      const cloudTs = row.updated_at ? new Date(row.updated_at).getTime() : 0

      // Skip if local is strictly newer AND we're not forcing a full pull
      if (!forceAll && localPushTs > 0 && localPushTs > cloudTs + 5000) continue

      const local = readLocal(row.key)
      if (local === null) {
        // Nothing local — take cloud directly
        writeLocal(row.key, row.value)
        mergedKeys.push(row.key)
      } else {
        // Merge: union arrays by id, merge objects
        const merged = mergeArrays(local, row.value)
        const localStr = JSON.stringify(local)
        const mergedStr = JSON.stringify(merged)
        if (localStr !== mergedStr) {
          writeLocal(row.key, merged)
          mergedKeys.push(row.key)
        }
      }
    }

    return { merged: mergedKeys.length > 0, keys: mergedKeys }
  } catch { return { merged: false, keys: [] } }
}

// ── Sign-in sync ──────────────────────────────────────────────────────────────

export async function syncOnSignIn(): Promise<boolean> {
  // Push local data to cloud first (never lose local changes)
  await pushAllToCloud()
  // Then merge cloud changes
  const { merged } = await pullFromCloud()
  return merged
}

// ── Debounced per-key sync ────────────────────────────────────────────────────

const timers: Record<string, ReturnType<typeof setTimeout>> = {}

export function syncKey(key: string) {
  if (!supabase) return
  clearTimeout(timers[key])
  timers[key] = setTimeout(async () => {
    const user = await getUser()
    if (!user) return
    try {
      const value = readLocal(key) ?? []
      await supabase!
        .from('forge_stores')
        .upsert(
          { user_id: user.id, key, value, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,key' }
        )
      localStorage.setItem(PUSH_TS_KEY, Date.now().toString())
    } catch {}
  }, 1500)
}

export async function getCloudUser() {
  return getUser()
}
