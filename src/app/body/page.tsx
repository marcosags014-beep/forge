'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Plus, Trash2, Save, Dumbbell, Apple, Scale, X, Camera, Sparkles, Upload, RefreshCw, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { workoutsStore, nutritionStore, bodyStore, bodyMeasurementsStore, bodyPhotosStore, generateId, today, getAllDataForAI } from '@/lib/store'
import { useRef } from 'react'

import type { WorkoutEntry, NutritionEntry, BodyMetric, Exercise, BodyMeasurement, BodyPhoto } from '@/lib/types'

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
              <div key={w.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-sm group">
                <span className="text-muted-foreground w-12 flex-shrink-0">{format(new Date(w.date), 'MMM d')}</span>
                <span className="flex-1 truncate px-2">{w.exercises.filter(e => e.name).map(e => e.name).join(', ') || w.notes || '—'}</span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  {w.duration}min
                  <button onClick={() => { workoutsStore.delete(w.id); setHistory(workoutsStore.getRecent(10)) }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {history.length === 0 && (
        <div className="forge-card flex flex-col items-center justify-center text-center py-8">
          <Dumbbell className="w-8 h-8 text-muted-foreground/30 mb-3" />
          <p className="font-semibold text-sm mb-1.5">No workouts logged yet</p>
          <p className="text-xs text-muted-foreground max-w-xs">Log your first session above. Volume trends and progressive overload tracking appear after 3+ workouts.</p>
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
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeResult, setAnalyzeResult] = useState<{ foods: string[]; confidence: string; note?: string } | null>(null)
  const [planLoading, setPlanLoading] = useState(false)
  const [planNote, setPlanNote] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

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

  async function analyzePhoto(file: File) {
    setAnalyzing(true)
    setAnalyzeResult(null)
    try {
      const MAX = 1024
      const img = new Image()
      const url = URL.createObjectURL(file)
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url })
      URL.revokeObjectURL(url)
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
      const mediaType = 'image/jpeg'

      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64, mediaType }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()

      if (data.calories || data.protein) {
        setForm(f => ({
          ...f,
          calories: f.calories + (data.calories || 0),
          protein: f.protein + (data.protein || 0),
          carbs: f.carbs + (data.carbs || 0),
          fat: f.fat + (data.fat || 0),
        }))
        setAnalyzeResult({ foods: data.foods || [], confidence: data.confidence || 'low', note: data.note })
      }
    } catch {
      setAnalyzeResult({ foods: [], confidence: 'low', note: 'Could not analyze photo' })
    } finally {
      setAnalyzing(false)
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
  }

  async function generateNutritionPlan() {
    setPlanLoading(true)
    setPlanNote(null)
    try {
      const userData = getAllDataForAI()
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'nutrition_plan',
          message: 'Create a precise daily nutrition plan (calories, protein, carbs, fat, water) based on my body metrics, goals, and activity level. Be specific to my data.',
          userData,
        }),
      })
      const data = await res.json()
      const content: string = data.content ?? ''

      const planRe = /\[NUTRITION_PLAN:\s*([^|\]]+)\|([^|\]]+)\|([^|\]]+)\|([^|\]]+)\|([^|\]]+)\|([^\]]+)\]/
      const match = content.match(planRe)
      if (match) {
        const [, cal, prot, carbs, fat, water, desc] = match.map(s => s?.trim())
        setForm(f => ({
          ...f,
          calories: parseInt(cal) || f.calories,
          protein: parseInt(prot) || f.protein,
          carbs: parseInt(carbs) || f.carbs,
          fat: parseInt(fat) || f.fat,
          water: parseFloat(water) || f.water,
        }))
        setPlanNote(desc)
      } else {
        setPlanNote('Plan generated — adjust numbers above if needed.')
      }
    } catch {
      setPlanNote('Could not reach Oracle. Try again.')
    } finally {
      setPlanLoading(false)
    }
  }

  const macroData = [
    { name: 'Protein', g: form.protein, color: '#f97316' },
    { name: 'Carbs', g: form.carbs, color: '#3b82f6' },
    { name: 'Fat', g: form.fat, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-4">
      {/* Photo log — prominent on mobile */}
      <div className="forge-card space-y-3">
        <span className="forge-label flex items-center gap-2"><Camera className="w-3.5 h-3.5" />Log Food by Photo</span>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) analyzePhoto(f) }}
        />
        <button
          onClick={() => photoInputRef.current?.click()}
          disabled={analyzing}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all active:scale-95"
        >
          {analyzing
            ? <><RefreshCw className="w-5 h-5 text-primary animate-spin" /><span className="text-sm font-medium text-primary">Analyzing…</span></>
            : <><Camera className="w-5 h-5 text-primary" /><span className="text-sm font-medium text-primary">Take photo or upload food</span></>
          }
        </button>
        {analyzeResult && (
          <div className={`px-3 py-2 rounded-xl border text-xs ${
            analyzeResult.confidence === 'high' ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : analyzeResult.confidence === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
            : 'bg-secondary border-border text-muted-foreground'
          }`}>
            {analyzeResult.foods.length > 0
              ? <><span className="font-medium">Detected:</span> {analyzeResult.foods.join(', ')} · Macros added</>
              : analyzeResult.note || 'Could not identify food'
            }
            {analyzeResult.note && analyzeResult.foods.length > 0 && <span className="ml-1 opacity-70">· {analyzeResult.note}</span>}
          </div>
        )}
      </div>

      <div className="forge-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="forge-label flex items-center gap-2"><Apple className="w-3.5 h-3.5" />Daily Targets</span>
          <div className="flex items-center gap-2">
            <button
              onClick={generateNutritionPlan}
              disabled={planLoading}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {planLoading
                ? <><RefreshCw className="w-3 h-3 animate-spin" />Planning…</>
                : <><Sparkles className="w-3 h-3" />Oracle Plan</>
              }
            </button>
            <Button size="sm" onClick={save} className="gap-1 text-xs bg-primary text-primary-foreground">
              <Save className="w-3.5 h-3.5" />{saved ? 'Saved!' : 'Save'}
            </Button>
          </div>
        </div>

        {planNote && (
          <div className="px-3 py-2 rounded-xl bg-primary/5 border border-primary/15 text-xs text-primary/80 flex items-start gap-2">
            <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>{planNote}</span>
          </div>
        )}

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

const MEASURE_FIELDS: { key: keyof BodyMeasurement; label: string; emoji: string }[] = [
  { key: 'waist', label: 'Waist', emoji: '📏' },
  { key: 'chest', label: 'Chest', emoji: '💪' },
  { key: 'hips', label: 'Hips', emoji: '🏃' },
  { key: 'arms', label: 'Arms (bicep)', emoji: '💪' },
  { key: 'thighs', label: 'Thighs', emoji: '🦵' },
  { key: 'neck', label: 'Neck', emoji: '📐' },
]

function BodyMeasurements() {
  const [history, setHistory] = useState<BodyMeasurement[]>([])
  const [form, setForm] = useState<Partial<Record<keyof BodyMeasurement, string>>>({})
  const [saved, setSaved] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<keyof BodyMeasurement>('waist')

  const reload = () => setHistory(bodyMeasurementsStore.getRecent(30))
  useEffect(reload, [])

  function save() {
    const hasValue = MEASURE_FIELDS.some(f => form[f.key] && !isNaN(parseFloat(form[f.key] as string)))
    if (!hasValue) return
    const entry: BodyMeasurement = { id: generateId(), date: today() }
    MEASURE_FIELDS.forEach(({ key }) => {
      const v = form[key]
      if (v && !isNaN(parseFloat(v))) (entry as unknown as Record<string, unknown>)[key] = parseFloat(v)
    })
    bodyMeasurementsStore.save(entry)
    setForm({})
    setSaved(true)
    reload()
    setTimeout(() => setSaved(false), 2000)
  }

  // Chart data for selected metric
  const chartData = history
    .filter(e => e[selectedMetric] !== undefined)
    .slice(0, 20)
    .reverse()
    .map(e => ({ date: format(new Date(e.date), 'MM/dd'), value: e[selectedMetric] as number }))

  // Latest values
  const latest = history[0]
  const prev = history[1]

  return (
    <div className="space-y-4">
      {/* Log form */}
      <div className="forge-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="forge-label flex items-center gap-2"><Ruler className="w-3.5 h-3.5" />Log Measurements (cm)</span>
          <Button size="sm" onClick={save} className="gap-1 text-xs bg-primary text-primary-foreground">
            <Save className="w-3.5 h-3.5" />{saved ? 'Saved!' : 'Log'}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {MEASURE_FIELDS.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <label className="forge-label">{label}</label>
              <input
                type="number" step={0.1}
                value={form[key] ?? ''}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={latest?.[key] !== undefined ? String(latest[key]) : '—'}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Current stats */}
      {latest && (
        <div className="forge-card">
          <span className="forge-label mb-3 flex items-center gap-2">Latest Measurements</span>
          <div className="grid grid-cols-3 gap-3">
            {MEASURE_FIELDS.map(({ key, label }) => {
              const val = latest[key] as number | undefined
              const pval = prev?.[key] as number | undefined
              const diff = val !== undefined && pval !== undefined ? val - pval : null
              return (
                <div key={key} className="text-center p-2 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
                  <div className="text-lg font-bold">{val !== undefined ? `${val}` : '—'}</div>
                  {diff !== null && (
                    <div className={`text-[10px] font-medium ${diff < 0 ? 'text-green-400' : diff > 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                      {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} cm
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Trend chart */}
      {history.length > 1 && (
        <div className="forge-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="forge-label">Trend</span>
            <div className="flex gap-1 flex-wrap">
              {MEASURE_FIELDS.filter(f => history.some(e => e[f.key] !== undefined)).map(f => (
                <button key={f.key} onClick={() => setSelectedMetric(f.key)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${selectedMetric === f.key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#71717a' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip formatter={(v) => [`${v} cm`, MEASURE_FIELDS.find(f => f.key === selectedMetric)?.label ?? '']}
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="value" stroke="oklch(0.705 0.213 47.604)" strokeWidth={2} dot={{ r: 3, fill: 'oklch(0.705 0.213 47.604)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function BodyScan() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [currentBase64, setCurrentBase64] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<BodyPhoto[]>([])
  const [selected, setSelected] = useState<BodyPhoto | null>(null)

  useEffect(() => { setPhotos(bodyPhotosStore.getAll()) }, [])

  function resizeAndEncode(file: File, maxPx: number, quality = 0.82): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * ratio)
        canvas.height = Math.round(img.height * ratio)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1])
      }
      img.onerror = reject
      img.src = url
    })
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAnalysis('')
    setError('')
    const full = await resizeAndEncode(file, 1024, 0.82)
    const thumb = await resizeAndEncode(file, 320, 0.75)
    setPreview(`data:image/jpeg;base64,${full}`)
    setCurrentBase64(thumb)
    await analyse(full, thumb)
  }

  async function analyse(base64: string, thumb: string) {
    setLoading(true)
    setAnalysis('')
    try {
      const userData = getAllDataForAI()
      const bodyHist = (userData.bodyHistory as Array<{date:string;weight:number;bodyFat?:number}>)
        ?.slice(0, 5).map(b => `${b.date}: ${b.weight}kg${b.bodyFat ? ` / ${b.bodyFat}% fat` : ''}`).join(', ') || 'no history'
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'vision',
          imageData: base64,
          mediaType: 'image/jpeg',
          agentPrompt: `You are a professional physique coach analysing a body progress photo. Structure with plain text sections (no markdown):

POSTURE & STRUCTURE — spine, shoulder symmetry, hip balance, visible imbalances.
MUSCLE DEVELOPMENT — dominant groups, weak points, development stage.
BODY COMPOSITION — estimated body fat range, muscle-to-fat ratio, frame type.
CHANGE vs HISTORY — if weight/fat history shows a trend, comment on visible progress or regression.
TRAINING FOCUS — 3 specific priorities based on what you see.
PRIORITY — single highest-leverage improvement right now.

Be direct. No generic disclaimers.`,
          message: `Analyse my body photo.\nWeight history: ${bodyHist}.\nGoals: ${userData.goals?.map((g: {title:string}) => g.title).join(', ') || 'none set'}.`,
          userData,
        }),
      })
      const data = await res.json()
      const text = data.content ?? ''
      setAnalysis(text)

      // Save to memory
      const photo: BodyPhoto = {
        id: generateId(),
        date: today(),
        thumbnail: thumb,
        analysis: text,
      }
      bodyPhotosStore.save(photo)
      setPhotos(bodyPhotosStore.getAll())
    } catch {
      setError('Could not reach Oracle. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setPreview(null)
    setCurrentBase64(null)
    setAnalysis('')
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  function deletePhoto(id: string) {
    bodyPhotosStore.delete(id)
    setPhotos(bodyPhotosStore.getAll())
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="space-y-4">
      {/* New scan */}
      <div className="forge-card">
        <div className="flex items-center justify-between mb-3">
          <span className="forge-label flex items-center gap-2">
            <Camera className="w-3.5 h-3.5" />AI Body Analysis
          </span>
          {preview && (
            <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!preview ? (
          <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-0.5">Take photo or upload</p>
              <p className="text-xs text-muted-foreground">Front or side · saved to your progress</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={handleFile} className="hidden" />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Body scan" className="w-full max-h-80 object-contain rounded-xl bg-secondary" />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-xl">
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                    <p className="text-xs text-muted-foreground">Oracle is analysing…</p>
                  </div>
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {analysis && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">Oracle&apos;s Assessment · saved to memory</span>
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-line text-foreground">{analysis}</div>
                <button onClick={() => { reset(); fileRef.current?.click() }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2">
                  <RefreshCw className="w-3 h-3" />New photo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress gallery */}
      {photos.length > 0 && (
        <div className="forge-card space-y-3">
          <span className="forge-label flex items-center gap-2"><Camera className="w-3.5 h-3.5" />Progress Photos ({photos.length})</span>
          <div className="grid grid-cols-3 gap-2">
            {photos.map(p => (
              <button key={p.id} onClick={() => setSelected(s => s?.id === p.id ? null : p)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${selected?.id === p.id ? 'border-primary' : 'border-transparent hover:border-primary/30'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`data:image/jpeg;base64,${p.thumbnail}`} alt={p.date}
                  className="w-full aspect-[3/4] object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 px-1.5 py-1">
                  <p className="text-[9px] text-white/90 font-medium">{format(new Date(p.date), 'MMM d')}</p>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">{format(new Date(selected.date), 'MMMM d, yyyy')}</span>
                <button onClick={() => deletePhoto(selected.id)} className="text-xs text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-1">
                  <Trash2 className="w-3 h-3" />Delete
                </button>
              </div>
              {selected.analysis && (
                <div className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line max-h-48 overflow-y-auto">
                  {selected.analysis}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function BodyPage() {
  const [tab, setTab] = useState<'workout' | 'nutrition' | 'body' | 'measures' | 'scan'>('workout')
  const tabs = [
    { id: 'workout', label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'body', label: 'Weight', icon: Scale },
    { id: 'measures', label: 'Measures', icon: Ruler },
    { id: 'scan', label: 'Scan', icon: Camera },
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
      {tab === 'measures' && <BodyMeasurements />}
      {tab === 'scan' && <BodyScan />}
    </div>
  )
}
