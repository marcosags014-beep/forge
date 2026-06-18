'use client'

import { useEffect, useState } from 'react'
import { Settings, Download, Trash2, User, Shield, Bell, AlertTriangle, Watch, Copy, Check, Sparkles, Cloud, LogOut, Mail, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { profileStore, vitalsStore, workoutsStore, nutritionStore, bodyStore, financeStore, goalsStore, habitsStore, tasksStore, journalStore, getReferralCode, isProUser, getProCustomerId, setProUser } from '@/lib/store'
import { supabase, supabaseEnabled } from '@/lib/supabase'
import { pushAllToCloud, pullFromCloud } from '@/lib/sync'
import type { UserProfile } from '@/lib/types'
import { isNative, requestNotificationPermission, scheduleDailyVitalsReminder, cancelDailyReminder } from '@/lib/health'
import Link from 'next/link'

// Section must be at module level — if defined inside the component it gets a
// new type reference every render, causing React to unmount/remount children
// (input loses focus and keyboard closes after every keystroke on mobile).
function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="forge-card mb-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Icon className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">{title}</span>
      </div>
      {children}
    </div>
  )
}

function ReferralBlock({ referralCode, copied, setCopied }: {
  referralCode: string
  copied: boolean
  setCopied: (v: boolean) => void
}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://forge-five-flax.vercel.app'
  const referralLink = `${origin}/?ref=${referralCode}`
  const tweetText = encodeURIComponent(
    `I track my health, fitness, finances and goals in one app — FORGE. It's free and the AI is actually useful: ${origin}/?ref=${referralCode}`
  )

  return (
    <div className="space-y-2 pt-2 border-t border-border">
      <label className="forge-label">Your referral link</label>
      <div className="flex gap-2">
        <div className="forge-input flex-1 font-mono text-xs select-all truncate">{referralLink}</div>
        <Button size="sm" variant="outline" className="gap-1.5 flex-shrink-0"
          onClick={() => { navigator.clipboard.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Share your link. When 3 friends complete setup, you get 1 month of FORGE Pro free.
      </p>
      <Button
        size="sm"
        variant="outline"
        className="gap-2 w-full mt-1"
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'noopener,noreferrer')}>
        <Share2 className="w-3.5 h-3.5 text-[#1DA1F2]" />
        Share on Twitter
      </Button>
    </div>
  )
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [name, setName] = useState('')
  const [identity, setIdentity] = useState('')
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [reminderOn, setReminderOn] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [pro, setPro] = useState(false)
  const [proCustomerId, setProCustomerId] = useState<string | null>(null)
  const [managingSubscription, setManagingSubscription] = useState(false)
  const [stats, setStats] = useState({ vitals: 0, workouts: 0, transactions: 0, habits: 0, goals: 0, journal: 0 })
  const [accessCode, setAccessCode] = useState('')
  const [codeStatus, setCodeStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [syncEmail, setSyncEmail] = useState('')
  const [syncUser, setSyncUser] = useState<string | null>(null)
  const [syncStep, setSyncStep] = useState<'idle' | 'loading' | 'sent'>('idle')
  const [syncStatus, setSyncStatus] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const p = profileStore.get()
    setProfile(p)
    setName(p?.name ?? '')
    setIdentity(p?.identity ?? '')
    setStats({
      vitals:       vitalsStore.getAll().length,
      workouts:     workoutsStore.getAll().length,
      transactions: financeStore.getAll().length,
      habits:       habitsStore.getAll().length,
      goals:        goalsStore.getAll().length,
      journal:      journalStore.getAll().length,
    })
    setReferralCode(getReferralCode())
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          // Google OAuth may not expose email — fall back to display name or masked ID
          const label = user.email
            ?? user.user_metadata?.full_name
            ?? user.user_metadata?.name
            ?? `Google account (${user.id.slice(0, 8)}…)`
          setSyncUser(label)
        }
      })
    }
    const proStatus = isProUser()
    setPro(proStatus)
    if (proStatus) setProCustomerId(getProCustomerId())
  }, [])

  function saveProfile() {
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'You',
      identity: identity.trim() || profile?.identity,
      primaryGoal: profile?.primaryGoal ?? 'fitness',
      setupComplete: true,
      joinedAt: profile?.joinedAt ?? new Date().toISOString(),
    }
    profileStore.save(updated)
    setProfile(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function exportData() {
    const data = {
      exportDate: new Date().toISOString(),
      profile: profileStore.get(),
      vitals: vitalsStore.getAll(),
      workouts: workoutsStore.getAll(),
      nutrition: nutritionStore.getAll(),
      body: bodyStore.getAll(),
      finance: financeStore.getAll(),
      goals: goalsStore.getAll(),
      habits: habitsStore.getAll(),
      tasks: tasksStore.getAll(),
      journal: journalStore.getAll(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forge-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportCSV() {
    function toCSV(rows: Record<string, unknown>[]): string {
      if (!rows.length) return ''
      const keys = Object.keys(rows[0])
      const header = keys.join(',')
      const body = rows.map(r => keys.map(k => {
        const v = r[k]
        const s = v === null || v === undefined ? '' : String(v)
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
      }).join(',')).join('\n')
      return `${header}\n${body}`
    }
    const sheets: Record<string, string> = {
      vitals: toCSV(vitalsStore.getAll() as unknown as Record<string, unknown>[]),
      finance: toCSV(financeStore.getAll() as unknown as Record<string, unknown>[]),
      workouts: toCSV(workoutsStore.getAll().map(w => ({ ...w, exercises: JSON.stringify(w.exercises) })) as unknown as Record<string, unknown>[]),
      journal: toCSV(journalStore.getAll() as unknown as Record<string, unknown>[]),
    }
    // Bundle as single multi-sheet CSV (each sheet separated by a header line)
    const combined = Object.entries(sheets)
      .filter(([, csv]) => csv)
      .map(([name, csv]) => `# ${name.toUpperCase()}\n${csv}`)
      .join('\n\n')
    const blob = new Blob([combined], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forge-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function signInWithGoogle() {
    if (!supabase) { setAuthError('Sync not available — Supabase not configured.'); return }
    setAuthError(null)
    try { sessionStorage.setItem('forge_auth_return', '/settings') } catch {}
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setAuthError(error.message)
  }

  async function sendMagicLink() {
    if (!supabase) { setAuthError('Sync not available — Supabase not configured.'); return }
    if (!syncEmail.trim()) return
    setSyncStep('loading')
    setAuthError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: syncEmail.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) { setSyncStep('idle'); setAuthError(error.message) }
    else setSyncStep('sent')
  }

  async function handleSignOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setSyncUser(null)
  }

  async function handlePush() {
    setSyncStatus('Syncing...')
    const ok = await pushAllToCloud()
    setSyncStatus(ok ? 'All data synced ✓' : 'Sync failed — check connection')
    setTimeout(() => setSyncStatus(null), 3000)
  }

  async function handlePull() {
    setSyncStatus('Downloading...')
    const ok = await pullFromCloud()
    if (ok) { setSyncStatus('Data restored ✓'); setTimeout(() => window.location.reload(), 1000) }
    else { setSyncStatus('Nothing to restore or not connected'); setTimeout(() => setSyncStatus(null), 3000) }
  }

  function redeemCode() {
    const encoded = btoa(accessCode.trim())
    const valid = [
      'TUFSR09TLUZPUkdFLUZPVU5ERVI=',  // founder
      btoa('FORGE-BETA-2026'),            // tester
    ]
    if (valid.includes(encoded)) {
      setProUser('owner', '2099-12-31')
      setPro(true)
      setCodeStatus('success')
    } else {
      setCodeStatus('error')
      setTimeout(() => setCodeStatus('idle'), 2500)
    }
  }

  function resetAllData() {
    const keys = [
      'vitals', 'workouts', 'nutrition', 'body', 'finance', 'goals', 'habits', 'tasks',
      'chat', 'journal', 'achievements', 'profile',
      'supplement_log', 'learning', 'subscriptions', 'timeline',
      'body_measurements', 'net_worth',
      'lifescore_history', 'alignment_history',
      'oracle_daily', 'oracle_brief',
    ]
    keys.forEach(k => localStorage.removeItem(`forge_${k}`))
    window.location.href = '/setup'
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <p className="forge-label mb-1"><Settings className="w-3.5 h-3.5" />Configuration</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gradient">Settings</h1>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="forge-label">Your name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="forge-input"
              placeholder="First name or nickname" />
          </div>

          {/* Identity — core of the app, keep prominent */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-primary uppercase tracking-widest">I am becoming…</label>
              <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">CORE</span>
            </div>
            <textarea
              value={identity}
              onChange={e => setIdentity(e.target.value)}
              rows={4}
              placeholder="A disciplined athlete who is financially free, sleeps 8 hours, and shows up for what matters every single day."
              className="w-full bg-card border border-primary/20 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all leading-relaxed"
            />
            <p className="text-[10px] text-muted-foreground leading-relaxed">Oracle feeds this into every analysis. The more specific, the better your insights.</p>
          </div>
          {profile?.primaryGoal && (
            <div className="space-y-1.5">
              <label className="forge-label">Primary focus</label>
              <div className="px-4 py-3 bg-secondary rounded-xl text-sm capitalize">{profile.primaryGoal}</div>
            </div>
          )}
          {profile?.joinedAt && (
            <p className="text-xs text-muted-foreground">Member since {new Date(profile.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
          )}
          <Button onClick={saveProfile} size="sm" className="bg-primary text-primary-foreground">
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </Section>

      {/* Data stats */}
      <Section title="Your Data" icon={Shield}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Vitals', count: stats.vitals },
            { label: 'Workouts', count: stats.workouts },
            { label: 'Transactions', count: stats.transactions },
            { label: 'Habits', count: stats.habits },
            { label: 'Goals', count: stats.goals },
            { label: 'Journal', count: stats.journal },
          ].map(({ label, count }) => (
            <div key={label} className="text-center p-3 bg-secondary rounded-xl">
              <div className="text-xl font-bold text-primary">{count}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          All data is stored locally on this device. We never upload or sell your personal data.
        </p>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline" className="gap-2 flex-1">
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          <Button onClick={exportCSV} variant="outline" className="gap-2 flex-1">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Daily vitals reminder</div>
              <div className="text-xs text-muted-foreground">8:00 AM — log your morning data</div>
            </div>
            <button
              onClick={async () => {
                if (reminderOn) {
                  await cancelDailyReminder()
                  setReminderOn(false)
                } else {
                  const granted = await requestNotificationPermission()
                  if (granted) { await scheduleDailyVitalsReminder(); setReminderOn(true) }
                  else alert('Enable notifications in your device settings first.')
                }
              }}
              className={`w-10 h-5 rounded-full relative transition-colors ${reminderOn ? 'bg-primary' : 'bg-secondary'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${reminderOn ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>

          {isNative() && (
            <div className="flex items-center gap-2 text-xs text-green-400">
              <Watch className="w-3.5 h-3.5" />
              Apple Health auto-import is active
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {isNative() ? 'Native push notifications via the FORGE app.' : 'Grant permission when prompted. Works on Chrome and Safari.'}
          </p>
        </div>
      </Section>

      {/* Appearance — removed Palette import since unused */}
      <Section title="Appearance" icon={Settings}>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium">Theme</div>
            <div className="text-xs text-muted-foreground">Always dark — the only correct choice</div>
          </div>
          <div className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold">Dark</div>
        </div>
      </Section>

      {/* Trial status */}
      {!pro && profile?.joinedAt && (() => {
        const days = Math.floor((Date.now() - new Date(profile.joinedAt).getTime()) / 86400000)
        const left = Math.max(0, 7 - days)
        return left > 0 ? (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/5 border border-primary/15 mb-4">
            <div>
              <p className="text-xs font-semibold text-primary">{left} day{left !== 1 ? 's' : ''} left in free trial</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Your data is local-only until you connect a backup</p>
            </div>
            <Link href="/pricing" className="text-xs font-bold text-primary-foreground bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0">
              Upgrade
            </Link>
          </div>
        ) : null
      })()}

      {/* Pro / Referral */}
      <Section title={pro ? 'Pro Status' : 'Upgrade to Pro'} icon={Sparkles}>
        {pro ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-primary/10 rounded-xl border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm font-semibold text-primary">Pro — Active</span>
            </div>
            {proCustomerId && (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                disabled={managingSubscription}
                onClick={async () => {
                  setManagingSubscription(true)
                  try {
                    const res = await fetch('/api/portal', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ customerId: proCustomerId }),
                    })
                    const data = await res.json()
                    if (data.url) window.location.href = data.url
                    else alert('Could not open billing portal. Try again.')
                  } catch { alert('Network error. Try again.') }
                  finally { setManagingSubscription(false) }
                }}>
                {managingSubscription ? 'Opening…' : 'Manage Subscription'}
              </Button>
            )}
            <ReferralBlock referralCode={referralCode} copied={copied} setCopied={setCopied} />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Unlock unlimited Oracle queries, advanced insights, and priority support.
            </p>
            <Link href="/pricing">
              <Button className="bg-primary text-primary-foreground gap-2 w-full">
                <Sparkles className="w-4 h-4" />
                Start 7-Day Free Trial
              </Button>
            </Link>
            <ReferralBlock referralCode={referralCode} copied={copied} setCopied={setCopied} />
          </div>
        )}
      </Section>

      {/* Cloud Sync */}
      <Section title="Cloud Sync" icon={Cloud}>
        {!supabaseEnabled ? (
          <p className="text-xs text-muted-foreground">Cloud sync not configured yet. Add Supabase keys to enable.</p>
        ) : syncUser ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <Cloud className="w-4 h-4 text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-400">Sync active</p>
                <p className="text-xs text-muted-foreground truncate">{syncUser}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePush} variant="outline" size="sm" className="flex-1 gap-1.5">
                <Cloud className="w-3.5 h-3.5" />Save to cloud
              </Button>
              <Button onClick={handlePull} variant="outline" size="sm" className="flex-1 gap-1.5">
                <Download className="w-3.5 h-3.5" />Restore
              </Button>
            </div>
            {syncStatus && <p className="text-xs text-primary">{syncStatus}</p>}
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors">
              <LogOut className="w-3 h-3" />Sign out of sync
            </button>
          </div>
        ) : syncStep === 'sent' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-4 py-3 bg-primary/10 rounded-xl border border-primary/20">
              <Mail className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-semibold text-primary">Check your email</p>
                <p className="text-xs text-muted-foreground">Click the link sent to {syncEmail} to activate sync.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Sync your data across all devices. Sign in once — everything follows you.</p>
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors text-sm font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or use email</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex gap-2">
              <input
                value={syncEmail}
                onChange={e => setSyncEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMagicLink()}
                placeholder="your@email.com"
                type="email"
                className="forge-input flex-1"
              />
              <Button onClick={sendMagicLink} disabled={syncStep === 'loading'} className="bg-primary text-primary-foreground flex-shrink-0">
                {syncStep === 'loading' ? '...' : 'Send link'}
              </Button>
            </div>
            {authError && (
              <div className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 font-medium">Auth error: {authError}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Use email link above as alternative, or check Supabase → Auth → Providers → Google.</p>
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Access Code */}
      {!pro && (
        <Section title="Access Code" icon={Shield}>
          <p className="text-sm text-muted-foreground mb-3">Have a founder or partner access code? Redeem it here for full Pro access.</p>
          <div className="flex gap-2">
            <input
              value={accessCode}
              onChange={e => setAccessCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && redeemCode()}
              placeholder="Enter code"
              className="forge-input flex-1 font-mono tracking-widest uppercase"
            />
            <Button onClick={redeemCode} className="bg-primary text-primary-foreground flex-shrink-0">
              Redeem
            </Button>
          </div>
          {codeStatus === 'success' && <p className="text-xs text-green-400 mt-2">✓ Founder access activated — enjoy FORGE Pro.</p>}
          {codeStatus === 'error' && <p className="text-xs text-red-400 mt-2">Invalid code. Check and try again.</p>}
        </Section>
      )}

      {/* Danger zone */}
      <div className="forge-card border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="font-semibold text-sm text-red-400">Danger Zone</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          This will permanently delete all your FORGE data: vitals, workouts, finances, goals, habits, journal — everything. This cannot be undone.
        </p>
        {!confirmReset ? (
          <Button variant="outline" onClick={() => setConfirmReset(true)}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2">
            <Trash2 className="w-4 h-4" />
            Reset All Data
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-400">Are you absolutely sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <Button onClick={resetAllData} className="bg-red-500 text-white hover:bg-red-600 gap-2">
                <Trash2 className="w-4 h-4" />
                Yes, delete everything
              </Button>
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">FORGE Life OS · Built for ambitious people</p>
        <p className="text-[10px] text-muted-foreground mt-1">Your data never leaves this device without your permission.</p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/privacy" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          <a href="mailto:support@forge-life.app" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Support</a>
        </div>
      </div>
    </div>
  )
}
