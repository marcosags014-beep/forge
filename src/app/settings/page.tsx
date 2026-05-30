'use client'

import { useEffect, useState } from 'react'
import { Settings, Download, Trash2, User, Shield, Bell, Palette, ChevronRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { profileStore, vitalsStore, workoutsStore, nutritionStore, bodyStore, financeStore, goalsStore, habitsStore, tasksStore, journalStore } from '@/lib/store'
import type { UserProfile } from '@/lib/types'

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
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
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
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

      {/* Notifications placeholder */}
      <Section title="Notifications" icon={Bell}>
        <div className="space-y-3">
          {[
            { label: 'Daily vitals reminder', time: '8:00 AM', enabled: true },
            { label: 'Habit check-in', time: '9:00 PM', enabled: true },
            { label: 'Weekly review', time: 'Sunday 10:00 AM', enabled: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.time}</div>
              </div>
              <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.enabled ? 'bg-primary' : 'bg-secondary'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.enabled ? 'left-5' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Browser notifications — grant permission when prompted.</p>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Palette}>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium">Theme</div>
            <div className="text-xs text-muted-foreground">Always dark — the only correct choice</div>
          </div>
          <div className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold">Dark</div>
        </div>
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
