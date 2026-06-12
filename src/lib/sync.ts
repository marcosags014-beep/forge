import { supabase } from './supabase'

export const SYNC_KEYS = ['vitals', 'workouts', 'nutrition', 'body', 'finance', 'goals', 'habits', 'tasks', 'journal', 'profile']

async function getUser() {
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Push all localStorage data to Supabase
export async function pushAllToCloud(): Promise<boolean> {
  const user = await getUser()
  if (!user || !supabase) return false
  try {
    const entries = SYNC_KEYS.map(key => ({
      user_id: user.id,
      key,
      value: (() => {
        try { return JSON.parse(localStorage.getItem(`forge_${key}`) ?? 'null') ?? [] }
        catch { return [] }
      })(),
      updated_at: new Date().toISOString(),
    }))
    const { error } = await supabase.from('forge_stores').upsert(entries, { onConflict: 'user_id,key' })
    return !error
  } catch { return false }
}

// Pull all data from Supabase into localStorage
export async function pullFromCloud(): Promise<boolean> {
  const user = await getUser()
  if (!user || !supabase) return false
  try {
    const { data, error } = await supabase
      .from('forge_stores')
      .select('key, value')
      .eq('user_id', user.id)
    if (error || !data?.length) return false
    for (const row of data) {
      if (row.value !== null && row.value !== undefined) {
        localStorage.setItem(`forge_${row.key}`, JSON.stringify(row.value))
      }
    }
    return true
  } catch { return false }
}

// Debounced per-key sync — called on every store write
const timers: Record<string, ReturnType<typeof setTimeout>> = {}

export function syncKey(key: string) {
  if (!supabase) return
  clearTimeout(timers[key])
  timers[key] = setTimeout(async () => {
    const user = await getUser()
    if (!user) return
    try {
      const value = (() => {
        try { return JSON.parse(localStorage.getItem(`forge_${key}`) ?? 'null') ?? [] }
        catch { return [] }
      })()
      await supabase!.from('forge_stores').upsert(
        { user_id: user.id, key, value, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,key' }
      )
    } catch {}
  }, 1500)
}

export async function getCloudUser() {
  return getUser()
}
