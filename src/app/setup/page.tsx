'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Heart, Dumbbell, TrendingUp, Target, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { profileStore, vitalsStore, habitsStore, goalsStore, generateId, today } from '@/lib/store'
import { track } from '@vercel/analytics'

const FOCUS_OPTIONS = [
  { id: 'health',  label: 'Health',   icon: Heart,      desc: 'Sleep, HRV, recovery',       color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
  { id: 'fitness', label: 'Fitness',  icon: Dumbbell,   desc: 'Workouts, body, performance', color: 'text-primary',    bg: 'bg-primary/10 border-primary/20' },
  { id: 'wealth',  label: 'Wealth',   icon: TrendingUp, desc: 'Budget, savings, net worth',  color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { id: 'mind',    label: 'Mind',     icon: Target,     desc: 'Goals, habits, clarity',      color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
]

const SUGGESTED_HABITS: Record<string, string[]> = {
  health:  ['Morning sunlight (10 min)', 'No phone 1h before bed', 'Daily walk'],
  fitness: ['Training session', 'Hit protein target', 'Post-workout stretch'],
  wealth:  ['Log all transactions', 'No impulse spend check', 'Review finances'],
  mind:    ['Morning journaling', 'Review goals', 'Evening reflection'],
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-primary' : 'bg-secondary'}`} />
      ))}
    </div>
  )
}

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [focus, setFocus] = useState<'health' | 'fitness' | 'wealth' | 'mind'>('fitness')
  const [identity, setIdentity] = useState('')
  const [vitals, setVitals] = useState({ sleepHours: 7, hrv: 60, rhr: 60, energy: 7, mood: 7 })
  const [hasWearable, setHasWearable] = useState(false)
  const [habits, setHabits] = useState(['', '', ''])
  const [financialGoal, setFinancialGoal] = useState('')
  const TOTAL = 4

  useEffect(() => { track('setup_started') }, [])

  // Step mapping: 1=Name+Focus, 2=Vitals, 3=Habits, 4=Oracle
  function next() {
    const nextStep = Math.min(step + 1, TOTAL)
    const stepNames: Record<number, string> = { 2: 'vitals', 3: 'habits', 4: 'oracle' }
    track('setup_step_completed', { step, focus, hasWearable: step === 2 ? hasWearable : undefined })
    if (stepNames[nextStep]) track(`setup_reached_${stepNames[nextStep]}`)
    setStep(nextStep)
  }

  function finish() {
    // Save profile with identity vision
    profileStore.save({ name: name || 'You', primaryGoal: focus, identity: identity.trim() || undefined, setupComplete: true, joinedAt: new Date().toISOString() })

    // Save baseline vitals (hrv/rhr only if user has a wearable)
    vitalsStore.save({
      id: generateId(), date: today(),
      sleepHours: vitals.sleepHours, sleepQuality: Math.round(vitals.energy * 0.7 + vitals.mood * 0.3),
      ...(hasWearable ? { hrv: vitals.hrv, rhr: vitals.rhr } : {}),
      energy: vitals.energy, mood: vitals.mood,
    })

    // Save habits
    habits.filter(Boolean).forEach(h =>
      habitsStore.save({ id: generateId(), name: h.trim(), category: focus, completions: [] })
    )

    // Save financial goal
    if (financialGoal) {
      goalsStore.save({
        id: generateId(), title: financialGoal, category: 'finance',
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        status: 'active', progress: 0, milestones: [],
      })
    }

    track('setup_completed', { focus, habitCount: habits.filter(Boolean).length, hasWearable })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Flame className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="text-2xl font-bold tracking-tight">FORGE</div>
        </div>

        <ProgressBar step={step} total={TOTAL} />

        {/* Step 1 — Identity */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-2">Let&apos;s build your life OS.</h2>
            <p className="text-muted-foreground mb-8">FORGE adapts to your goals. This takes 90 seconds.</p>

            <div className="space-y-4 mb-8">
              <div className="space-y-1.5">
                <label className="forge-label">Your name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="First name or nickname"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              <div className="space-y-2">
                <label className="forge-label">What matters most to you right now?</label>
                <div className="grid grid-cols-2 gap-3">
                  {FOCUS_OPTIONS.map(opt => {
                    const Icon = opt.icon
                    return (
                      <button key={opt.id} onClick={() => setFocus(opt.id as typeof focus)}
                        className={`p-4 rounded-xl border text-left transition-all ${focus === opt.id ? opt.bg : 'bg-card border-border hover:border-primary/30'}`}>
                        <Icon className={`w-5 h-5 mb-2 ${focus === opt.id ? opt.color : 'text-muted-foreground'}`} />
                        <div className={`font-semibold text-sm ${focus === opt.id ? opt.color : 'text-foreground'}`}>{opt.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <Button onClick={next} className="w-full bg-primary text-primary-foreground py-6 text-base gap-2" disabled={!name.trim()}>
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 2 — Baseline vitals */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-2">Set your baseline.</h2>
            <p className="text-muted-foreground mb-8">How were you feeling when you woke up today? This starts your Life Score.</p>

            <div className="space-y-5 mb-8">
              {[
                { label: 'Sleep last night (hours)', key: 'sleepHours', min: 0, max: 12, step: 0.5, unit: 'h' },
                { label: 'Energy level (1-10)', key: 'energy', min: 1, max: 10, step: 1, unit: '/10' },
                { label: 'Mood (1-10)', key: 'mood', min: 1, max: 10, step: 1, unit: '/10' },
              ].map(({ label, key, min, max, step: s, unit }) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="forge-label">{label}</label>
                    <span className="text-sm font-semibold text-primary">{vitals[key as keyof typeof vitals]}{unit}</span>
                  </div>
                  <input type="range" min={min} max={max} step={s}
                    value={vitals[key as keyof typeof vitals]}
                    onChange={e => setVitals(v => ({ ...v, [key]: parseFloat(e.target.value) }))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: 'oklch(0.705 0.213 47.604)' }} />
                </div>
              ))}

              <button onClick={() => setHasWearable(w => !w)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm ${hasWearable ? 'border-primary/40 bg-primary/10 text-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/20'}`}>
                <span>I have a smartwatch / wearable (Apple Watch, Garmin, Whoop…)</span>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${hasWearable ? 'bg-primary border-primary' : 'border-muted-foreground'}`} />
              </button>

              {hasWearable && [
                { label: 'Resting heart rate', key: 'rhr', min: 30, max: 120, step: 1, unit: 'bpm' },
                { label: 'HRV', key: 'hrv', min: 20, max: 150, step: 1, unit: 'ms' },
              ].map(({ label, key, min, max, step: s, unit }) => (
                <div key={key} className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex justify-between">
                    <label className="forge-label">{label}</label>
                    <span className="text-sm font-semibold text-primary">{vitals[key as keyof typeof vitals]}{unit}</span>
                  </div>
                  <input type="range" min={min} max={max} step={s}
                    value={vitals[key as keyof typeof vitals]}
                    onChange={e => setVitals(v => ({ ...v, [key]: parseFloat(e.target.value) }))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: 'oklch(0.705 0.213 47.604)' }} />
                </div>
              ))}
            </div>

            <Button onClick={next} className="w-full bg-primary text-primary-foreground py-6 text-base gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 3 — Habits */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-2">Pick your daily habits.</h2>
            <p className="text-muted-foreground mb-6">Start with 3. You can add more later. Identity is built through daily reps.</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {SUGGESTED_HABITS[focus].map(s => (
                <button key={s} onClick={() => {
                  const empty = habits.findIndex(h => !h)
                  if (empty >= 0) setHabits(hs => { const n = [...hs]; n[empty] = s; return n })
                }} className="text-xs px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/20 transition-colors">
                  + {s}
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-8">
              {habits.map((h, i) => (
                <input key={i} value={h} onChange={e => setHabits(hs => { const n = [...hs]; n[i] = e.target.value; return n })}
                  placeholder={`Habit ${i + 1}`}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              ))}
            </div>

            <Button onClick={next} className="w-full bg-primary text-primary-foreground py-6 text-base gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 4 — Meet Oracle */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-2xl font-bold mb-3">Meet Oracle.</h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
              {name ? `${name}, your` : 'Your'} AI life coach. It sees everything — your sleep, fitness, finances, and goals — and gives you one focused recommendation every morning.
            </p>

            <div className="text-left bg-card border border-border rounded-2xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">ORACLE</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                &ldquo;Welcome, {name || 'builder'}. I&apos;ve processed your baseline. Today&apos;s priority: build the habit of showing up. Log your data every day for 7 days and I&apos;ll start seeing patterns you can&apos;t see yourself. Let&apos;s go.&rdquo;
              </p>
            </div>

            <Button onClick={finish} className="w-full bg-primary text-primary-foreground py-6 text-base gap-2 shadow-lg shadow-primary/20">
              <Flame className="w-5 h-5" />
              Enter FORGE
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
