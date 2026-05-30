'use client'

import type { HealthPlugin, HealthSample } from '@capgo/capacitor-health'

// Lazy-load plugins — they're stubs on web, active on native
async function getHealthPlugin(): Promise<HealthPlugin | null> {
  if (typeof window === 'undefined') return null
  try {
    const { Health } = await import('@capgo/capacitor-health')
    const available = await Health.isAvailable()
    return available.available ? Health : null
  } catch {
    return null
  }
}

async function getLocalNotificationsPlugin() {
  if (typeof window === 'undefined') return null
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    return LocalNotifications
  } catch {
    return null
  }
}

export function isNative(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window as Window & { Capacitor?: { isNativePlatform?: () => boolean } })
    .Capacitor?.isNativePlatform?.()
}

/* ── HealthKit / Health Connect ──────────────────────────── */

export interface HealthSnapshot {
  sleepHours: number | null
  hrv: number | null
  rhr: number | null
  steps: number | null
  source: 'apple_health' | 'google_health' | 'none'
}

export async function requestHealthPermissions(): Promise<boolean> {
  const Health = await getHealthPlugin()
  if (!Health) return false
  try {
    const result = await Health.requestAuthorization({
      read: ['steps', 'heartRate', 'heartRateVariability', 'restingHeartRate', 'sleep'],
    })
    return result.readAuthorized.length > 0
  } catch {
    return false
  }
}

export async function fetchTodayHealthData(): Promise<HealthSnapshot> {
  const Health = await getHealthPlugin()
  if (!Health) return { sleepHours: null, hrv: null, rhr: null, steps: null, source: 'none' }

  const now = new Date()
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0)
  const sleepWindowStart = new Date(now); sleepWindowStart.setDate(now.getDate() - 1); sleepWindowStart.setHours(20, 0, 0, 0)

  try {
    const [sleepRes, hrvRes, rhrRes, stepsRes] = await Promise.allSettled([
      Health.readSamples({ dataType: 'sleep', startDate: sleepWindowStart.toISOString(), endDate: now.toISOString(), limit: 20 }),
      Health.readSamples({ dataType: 'heartRateVariability', startDate: startOfDay.toISOString(), endDate: now.toISOString(), limit: 1 }),
      Health.readSamples({ dataType: 'restingHeartRate', startDate: startOfDay.toISOString(), endDate: now.toISOString(), limit: 1 }),
      Health.readSamples({ dataType: 'steps', startDate: startOfDay.toISOString(), endDate: now.toISOString(), limit: 1 }),
    ])

    // Sleep: sum durations of 'asleep' stages (or all if no stage data)
    let sleepHours: number | null = null
    if (sleepRes.status === 'fulfilled' && sleepRes.value.samples.length) {
      const asleepSamples = sleepRes.value.samples.filter((s: HealthSample) =>
        !s.sleepState || s.sleepState === 'asleep' || s.sleepState === 'rem' || s.sleepState === 'deep' || s.sleepState === 'light'
      )
      const totalMs = asleepSamples.reduce((sum: number, s: HealthSample) => {
        if (s.startDate && s.endDate) {
          return sum + (new Date(s.endDate).getTime() - new Date(s.startDate).getTime())
        }
        return sum + (s.value * 60_000) // value in minutes fallback
      }, 0)
      if (totalMs > 0) sleepHours = Math.round((totalMs / 3_600_000) * 10) / 10
    }

    // HRV: latest ms reading
    let hrv: number | null = null
    if (hrvRes.status === 'fulfilled' && hrvRes.value.samples[0]) {
      const v = hrvRes.value.samples[0].value
      if (v > 0) hrv = Math.round(v)
    }

    // RHR: latest bpm
    let rhr: number | null = null
    if (rhrRes.status === 'fulfilled' && rhrRes.value.samples[0]) {
      const v = rhrRes.value.samples[0].value
      if (v > 0) rhr = Math.round(v)
    }

    // Steps
    let steps: number | null = null
    if (stepsRes.status === 'fulfilled' && stepsRes.value.samples[0]) {
      steps = Math.round(stepsRes.value.samples[0].value)
    }

    const platform = (window as Window & { Capacitor?: { getPlatform?: () => string } }).Capacitor?.getPlatform?.()
    const source = platform === 'ios' ? 'apple_health' : 'google_health'

    return { sleepHours, hrv, rhr, steps, source }
  } catch {
    return { sleepHours: null, hrv: null, rhr: null, steps: null, source: 'none' }
  }
}

/* ── Daily Reminder Notifications ───────────────────────── */

export async function requestNotificationPermission(): Promise<boolean> {
  const LN = await getLocalNotificationsPlugin()
  if (!LN) return false
  try {
    const result = await LN.requestPermissions()
    return result.display === 'granted'
  } catch {
    return false
  }
}

export async function scheduleDailyVitalsReminder(): Promise<void> {
  const LN = await getLocalNotificationsPlugin()
  if (!LN) return
  try {
    await LN.cancel({ notifications: [{ id: 1001 }] })
    await LN.schedule({
      notifications: [{
        id: 1001,
        title: 'FORGE — Morning Check-in',
        body: 'Log your vitals to keep your Life Score accurate. Takes 60 seconds.',
        schedule: { on: { hour: 8, minute: 0 }, repeats: true, allowWhileIdle: true },
        iconColor: '#f97316',
      }],
    })
  } catch {
    // Fails gracefully on web/simulator
  }
}

export async function cancelDailyReminder(): Promise<void> {
  const LN = await getLocalNotificationsPlugin()
  if (!LN) return
  try { await LN.cancel({ notifications: [{ id: 1001 }] }) } catch {}
}
