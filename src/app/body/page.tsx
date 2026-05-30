'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Plus, Trash2, Save, Dumbbell, Apple, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { workoutsStore, nutritionStore, bodyStore, generateId, today } from '@/lib/store'
import type { WorkoutEntry, NutritionEntry, BodyMetric, Exercise } from '@/lib/types'

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="forge-card text-xs p-2 space-y-1">
      <p className="text-muted-foreground">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

const TEMPLATES: Record<string, { exercises: Exercise[]; duration: number }> = {
  Push: {
    duration: 60,
    exercises: [
      { name: 'Bench Press', sets: [{ reps: 8, weight: 60 }, { reps: 8, weight: 60 }, { reps: 8, weight: 60 }] },
      { name: 'Overhead Press', sets: [{ reps: 8, weight: 40 }, { reps: 8, weight: 40 }, { reps: 8, weight: 40 }] },
      { name: 'Tricep Pushdown', sets: [{ reps: 12, weight: 30 }, { reps: 12, weight: 30 }, { reps: 12, weight: 30 }] },
      { name: 'Lateral Raises', sets: [{ reps: 15, weight: 10 }, { reps: 15, weight: 10 }, { reps: 15, weight: 10 }] },
    ],
  },
  Pull: {
    duration: 60,
    exercises: [
      { name: 'Pull-ups', sets: [{ reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }] },
      { name: 'Barbell Row', sets: [{ reps: 8, weight: 50 }, { reps: 8, weight: 50 }, { reps: 8, weight: 50 }] },
      { name: 'Face Pulls', sets: [{ reps: 15, weight: 20 }, { reps: 15, weight: 20 }, { reps: 15, weight: 20 }] },
      { name: 'Bicep Curls', sets: [{ reps: 12, weight: 15 }, { reps: 12, weight: 15 }, { reps: 12, weight: 15 }] },
    ],
  },
  Legs: {
    duration: 70,
    exercises: [
      { name: 'Squat', sets: [{ reps: 6, weight: 80 }, { reps: 6, weight: 80 }, { reps: 6, weight: 80 }, { reps: 6, weight: 80 }] },
      { name: 'Romanian Deadlift', sets: [{ reps: 10, weight: 60 }, { reps: 10, weight: 60 }, { reps: 10, weight: 60 }] },
      { name: 'Leg Press', sets: [{ reps: 12, weight: 100 }, { reps: 12, weight: 100 }, { reps: 12, weight: 100 }] },
      { name: 'Calf Raises', sets: [{ reps: 15, weight: 50 }, { reps: 15, weight: 50 }, { reps: 15, weight: 50 }, { reps: 15, weight: 50 }] },
    ],
  },
  Cardio: {
    duration: 40,
    exercises: [
      { name: 'Zone 2 Run', sets: [{ reps: 1, weight: 0 }] },
    ],
  },
}

function WorkoutLogger() {
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '', sets: [{ reps: 8, weight: 60 }] }])
  const [duration, setDuration] = useState(60)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState<WorkoutEntry[]>([])

  function applyTemplate(name: string) {
    const t = TEMPLATES[name]
    setExercises(JSON.parse(JSON.stringify(t.exercises)))
    setDuration(t.duration)
  }

  useEffect(() => { setHistory(workoutsStore.getRecent(10)) }, [])

  function addExercise() {
    setExercises(e => [...e, { name: '', sets: [{ reps: 8, weight: 60 }] }])
  }

  function addSet(ei: number) {
    setExercises(e => {
      const n = [...e]
      n[ei] = { ...n[ei], sets: [...n[ei].sets, { reps: 8, weight: n[ei].sets.at(-1)?.weight ?? 60 }] }
      return n
    })
  }

  function save() {
    if (exercises.every(e => !e.name)) return
    const entry: WorkoutEntry = { id: generateId(), date: today(), exercises, duration, notes }
    workoutsStore.save(entry)
    setHistory(workoutsStore.getRecent(10))
    setExercises([{ name: '', sets: [{ reps: 8, weight: 60 }] }])
    setNotes('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const weeklyData = (() => {
    const days: Record<string, number> = {}
    history.slice(0, 7).forEach(w => {
      const d = format(new Date(w.date), 'EEE')
      days[d] = (days[d] || 0) + w.duration
    })
    return Object.entries(days).map(([day, mins]) => ({ day, mins }))
  })()

  return (
    <div className="space-y-4">
      <div className="forge-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="forge-label flex items-center gap-2"><Dumbbell className="w-3.5 h-3.5" />Log Workout</span>
          <div className="flex items-center gap-2">
            <label className="forge-label">Duration</label>
            <input type="number" value={duration} onChange={e => setDuration(+e.target.value)}
              className="w-16 bg-secondary border border-border rounded px-2 py-1 text-sm text-center" />
            <span className="text-xs text-muted-foreground">min</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Templates:</span>
          {Object.keys(TEMPLATES).map(name => (
            <button key={name} onClick={() => applyTemplate(name)}
              className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-primary hover:text-primary transition-colors">
              {name}
            </button>
          ))}
        </div>

        {exercises.map((ex, ei) => (
          <div key={ei} className="space-y-2 p-3 bg-secondary/50 rounded-lg">
            <input
              value={ex.name} placeholder="Exercise name (e.g. Bench Press)"
              onChange={e => setExercises(es => { const n = [...es]; n[ei] = { ...n[ei], name: e.target.value }; return n })}
              className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none border-b border-border pb-1"
            />
            <div className="space-y-1">
              {ex.sets.map((set, si) => (
                <div key={si} className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground w-6">#{si + 1}</span>
                  <input type="number" value={set.reps} min={1}
                    onChange={e => setExercises(es => {
                      const n = JSON.parse(JSON.stringify(es))
                      n[ei].sets[si].reps = +e.target.value
                      return n
                    })}
                    className="w-14 bg-secondary border border-border rounded px-2 py-1 text-center" />
                  <span className="text-muted-foreground">reps @</span>
                  <input type="number" value={set.weight} min={0} step={2.5}
                    onChange={e => setExercises(es => {
                      const n = JSON.parse(JSON.stringify(es))
                      n[ei].sets[si].weight = +e.target.value
                      return n
                    })}
                    className="w-16 bg-secondary border border-border rounded px-2 py-1 text-center" />
                  <span className="text-muted-foreground">kg</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-6 text-primary" onClick={() => addSet(ei)}>
              + Add set
            </Button>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={addExercise} className="gap-1 text-xs">
            <Plus className="w-3 h-3" /> Exercise
          </Button>
          <Button size="sm" onClick={save} className="gap-1 text-xs ml-auto bg-primary text-primary-foreground">
            <Save className="w-3.5 h-3.5" />{saved ? 'Saved!' : 'Save Workout'}
          </Button>
        </div>
      </div>

      {weeklyData.length > 0 && (
        <div className="forge-card">
          <div className="forge-label mb-3">Weekly Volume (minutes)</div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mins" fill="#f97316" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {history.length > 0 && (
        <div className="forge-card">
          <div className="forge-label mb-3">Recent Workouts</div>
          <div className="space-y-2">
            {history.slice(0, 5).map(w => (
              <div key={w.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-sm">
                <span className="text-muted-foreground">{format(new Date(w.date), 'MMM d')}</span>
                <span>{w.exercises.filter(e => e.name).map(e => e.name).join(', ')}</span>
                <span className="text-muted-foreground">{w.duration}min</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function NutritionTracker() {
  const todayStr = today()
  const [form, setForm] = useState<NutritionEntry>({
    id: generateId(), date: todayStr, calories: 2200, protein: 180, carbs: 220, fat: 70, water: 2.5, meals: ['']
  })
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState<NutritionEntry[]>([])

  useEffect(() => {
    const all = nutritionStore.getAll().slice(0, 14)
    setHistory(all)
    const todayEntry = all.find(e => e.date === todayStr)
    if (todayEntry) setForm(todayEntry)
  }, [todayStr])

  function save() {
    nutritionStore.save(form)
    setHistory(nutritionStore.getAll().slice(0, 14))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const macroData = [
    { name: 'Protein', g: form.protein, color: '#f97316' },
    { name: 'Carbs', g: form.carbs, color: '#3b82f6' },
    { name: 'Fat', g: form.fat, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-4">
      <div className="forge-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="forge-label flex items-center gap-2"><Apple className="w-3.5 h-3.5" />Nutrition Today</span>
          <Button size="sm" onClick={save} className="gap-1 text-xs bg-primary text-primary-foreground">
            <Save className="w-3.5 h-3.5" />{saved ? 'Saved!' : 'Save'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Calories', key: 'calories', unit: 'kcal', step: 50 },
            { label: 'Protein', key: 'protein', unit: 'g', step: 5 },
            { label: 'Carbs', key: 'carbs', unit: 'g', step: 5 },
            { label: 'Fat', key: 'fat', unit: 'g', step: 2 },
            { label: 'Water', key: 'water', unit: 'L', step: 0.25 },
          ].map(({ label, key, unit, step }) => (
            <div key={key} className="space-y-1">
              <label className="forge-label">{label} ({unit})</label>
              <input
                type="number" step={step}
                value={form[key as keyof NutritionEntry] as number}
                onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              />
            </div>
          ))}
        </div>

        {/* Macro bars */}
        <div className="space-y-2 pt-2 border-t border-border">
          {macroData.map(m => (
            <div key={m.name} className="flex items-center gap-3">
              <span className="w-14 text-xs text-muted-foreground">{m.name}</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (m.g / 300) * 100)}%`, backgroundColor: m.color }} />
              </div>
              <span className="text-xs font-medium w-10 text-right" style={{ color: m.color }}>{m.g}g</span>
            </div>
          ))}
        </div>
      </div>

      {history.length > 1 && (
        <div className="forge-card">
          <div className="forge-label mb-3">Protein Trend</div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={[...history].reverse().map(e => ({ date: format(new Date(e.date), 'MM/dd'), Protein: e.protein }))}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Protein" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function BodyTracker() {
  const [weight, setWeight] = useState(75)
  const [fat, setFat] = useState(15)
  const [history, setHistory] = useState<BodyMetric[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => { setHistory(bodyStore.getAll().slice(0, 30)) }, [])

  function save() {
    bodyStore.save({ id: generateId(), date: today(), weight, bodyFat: fat })
    setHistory(bodyStore.getAll().slice(0, 30))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="forge-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="forge-label flex items-center gap-2"><Scale className="w-3.5 h-3.5" />Body Metrics</span>
          <Button size="sm" onClick={save} className="gap-1 text-xs bg-primary text-primary-foreground">
            <Save className="w-3.5 h-3.5" />{saved ? 'Saved!' : 'Log'}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="forge-label">Body Weight (kg)</label>
            <input type="number" step={0.1} value={weight} onChange={e => setWeight(parseFloat(e.target.value))}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>
          <div className="space-y-1">
            <label className="forge-label">Body Fat (%)</label>
            <input type="number" step={0.5} value={fat} onChange={e => setFat(parseFloat(e.target.value))}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>
        </div>
      </div>

      {history.length > 1 && (
        <div className="forge-card">
          <div className="forge-label mb-3">Weight Trend</div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={[...history].reverse().map(e => ({ date: format(new Date(e.date), 'MM/dd'), Weight: e.weight }))}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Weight" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default function BodyPage() {
  const [tab, setTab] = useState<'workout' | 'nutrition' | 'body'>('workout')
  const tabs = [
    { id: 'workout', label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'body', label: 'Body', icon: Scale },
  ] as const

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="forge-label mb-1">Physical Performance</p>
        <h1 className="text-3xl font-bold text-gradient">Body</h1>
      </div>

      <div className="forge-tabs w-fit mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`forge-tab ${tab === id ? 'forge-tab-active' : ''}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {tab === 'workout' && <WorkoutLogger />}
      {tab === 'nutrition' && <NutritionTracker />}
      {tab === 'body' && <BodyTracker />}
    </div>
  )
}
