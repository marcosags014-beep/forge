'use client'

import { useEffect, useState } from 'react'
import { Settings, Download, Trash2, User, Shield, Bell, AlertTriangle, Watch, Copy, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { profileStore, vitalsStore, workoutsStore, nutritionStore, bodyStore, financeStore, goalsStore, habitsStore, tasksStore, journalStore, getReferralCode, isProUser, getProCustomerId } from '@/lib/store'
import type { UserProfile } from '@/lib/types'
import { isNative, requestNotificationPermission, scheduleDailyVitalsReminder, cancelDailyReminder } from '@/lib/health'
import Link from 'next/link'

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [reminderOn, setReminderOn] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [pro, setPro] = useState(false)
  const [proCustomerId, setProCustomerId] = useState<string | null>(null)
  const [managingSubscription, setManagingSubscription] = useState(false)
  const [stats, setStats] = useState({ vitals: 0, workouts: 0, transactions: 0, habits: 0, goals: 0, journal: 0 })

  useEffect(() => {
    const p = profileStore.get()
    setProfile(p)
    setName(p?.name ?? '')
    setStats({
      vitals:       vitalsStore.getAll().length,
      workouts:     workoutsStore.getAll().length,
      transactions: financeStore.getAll().length,
      habits:       habitsStore.getAll().length,
      goals:        goalsStore.getAll().length,
      journal:      journalStore.getAll().length,
    })
    setReferralCode(getReferralCode())
    const proStatus = isProUser()
    setPro(proStatus)
    if (proStatus) setProCustomerId(getProCustomerId())
  }, [])

  function saveProfile() {
    const updated: UserProfile = {
      name: name.trim() || 'You',
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

  function resetAllData() {
    const keys = ['vitals', 'workouts', 'nutrition', 'body', 'finance', 'goals', 'habits', 'tasks', 'chat', 'journal', 'achievements', 'profile']
    keys.forEach(k => localStorage.removeItem(`forge_${k}`))
    window.location.href = '/setup'
  }

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="forge-card mb-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Icon className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">{title}</span>
      </div>
      {children}
    </div>
  )

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <p className="forge-label mb-1"><Settings className="w-3.5 h-3.5" />Configuration</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gradient">Settings</h1>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="forge-label">Your name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="forge-input"
              placeholder="First name or nickname" />
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
        <Button onClick={exportData} variant="outline" className="gap-2 w-full">
          <Download className="w-4 h-4" />
          Export All Data (JSON)
        </Button>
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
            <div className="space-y-1">
              <label className="forge-label">Your referral code</label>
              <div className="flex gap-2">
                <div className="forge-input flex-1 font-mono text-sm select-all">{referralCode}</div>
                <Button size="sm" variant="outline" className="gap-1.5 flex-shrink-0"
                  onClick={() => { navigator.clipboard.writeText(referralCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Share with friends to earn free months.</p>
            </div>
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
            <div className="space-y-1">
              <label className="forge-label">Your referral code</label>
              <div className="flex gap-2">
                <div className="forge-input flex-1 font-mono text-sm select-all">{referralCode}</div>
                <Button size="sm" variant="outline" className="gap-1.5 flex-shrink-0"
                  onClick={() => { navigator.clipboard.writeText(referralCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Share with friends — both get a free month when they subscribe.</p>
            </div>
          </div>
        )}
      </Section>

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
      </div>
    </div>
  )
}
