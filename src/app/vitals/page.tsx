'use client'

import { useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { Moon, Heart, Zap, Smile, Save, Watch, Trash2, AlarmClock, Sparkles, Plus, CheckCircle2, Circle, Footprints, Droplets } from 'lucide-react'
import { fetchTodayHealthData, requestHealthPermissions, isNative, scheduleDailyVitalsReminder, requestNotificationPermission } from '@/lib/health'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { vitalsStore, supplementLogStore, generateId, today, calculateReadiness, getPeakAlertnessWindow } from '@/lib/store'

import type { VitalEntry, SupplementEntry } from '@/lib/types'

const SUPPLEMENT_PRESETS = [
  { name: 'Vitamin D3', doseMg: 2000 },
  { name: 'Magnesium', doseMg: 400 },
  { name: 'Omega-3', doseMg: 1000 },
  { name: 'Creatine', doseMg: 5000 },
  { name: 'Zinc', doseMg: 25 },
  { name: 'Protein', doseMg: 30000 },
  { name: 'Ashwagandha', doseMg: 600 },
  { name: 'Caffeine', doseMg: 200 },
]

function SupplementStack() {
  const todayStr = today()
  const [todaySupps, setTodaySupps] = useState<SupplementEntry[]>([])
  const [customName, setCustomName] = useState('')
  const [customDose, setCustomDose] = useState('500')
  const [showCustom, setShowCustom] = useState(false)

  const reload = () => setTodaySupps(supplementLogStore.getForDate(todayStr))
  useEffect(reload, [todayStr])

  function log(name: string, doseMg: number, timing: SupplementEntry['timing'] = 'morning') {
    const existing = todaySupps.find(s => s.name === name)
    if (existing) { supplementLogStore.delete(existing.id); reload(); return }
    supplementLogStore.save({ id: generateId(), date: todayStr, name, doseMg, timing })
    reload()
  }

  const loggedNames = new Set(todaySupps.map(s => s.name))

  return (
    <div className="forge-card space-y-3">
      <div className="flex items-center justify-between">
        <span className="forge-label flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />Supplement Stack — Today
        </span>
        <span className="text-[10px] text-muted-foreground">{todaySupps.length} logged</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUPPLEMENT_PRESETS.map(s => {
          const done = loggedNames.has(s.name)
          return (
            <button key={s.name} onClick={() => log(s.name, s.doseMg)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                done ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border bg-secondary text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}>
              {done ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
              {s.name}
            </button>
          )
        })}
        <button onClick={() => setShowCustom(v => !v)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary/40 transition-all">
          <Plus className="w-3 h-3" />Custom
        </button>
      </div>

      {showCustom && (
        <div className="flex gap-2">
          <input value={customName} onChange={e => setCustomName(e.target.value)}
            placeholder="Supplement name"
            className="flex-1 bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground" />
          <input value={customDose} onChange={e => setCustomDose(e.target.value)}
            type="number" placeholder="mg"
            className="w-20 bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground" />
          <Button size="sm" onClick={() => { if (customName) { log(customName, parseInt(customDose) || 0); setCustomName(''); setShowCustom(false) } }}
            className="bg-primary text-primary-foreground">Add</Button>
        </div>
      )}

      {todaySupps.length > 0 && (
        <div className="border-t border-border pt-2 flex flex-wrap gap-1.5">
          {todaySupps.map(s => (
            <span key={s.id} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {s.name} {s.doseMg >= 1000 ? `${s.doseMg / 1000}g` : `${s.doseMg}mg`}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function Slider({ label, value, onChange, min = 1, max = 10, icon: Icon }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; icon: React.ElementType
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 forge-label">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </div>
        <span className="text-sm font-semibold text-primary">{value}{max > 10 ? 'ms' : '/10'}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: 'oklch(0.705 0.213 47.604)' }}
      />
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="forge-card text-xs p-2 space-y-1">
      <p className="text-muted-foreground">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-medium" style={{ color: '#f97316' }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function VitalsPage() {
  const todayStr = today()
  const [entries, setEntries] = useState<VitalEntry[]>([])
  const [form, setForm] = useState<VitalEntry>({
    id: generateId(),
    date: todayStr,
    sleepHours: 7,
    sleepQuality: 7,
    hrv: 60,
    rhr: 55,
    energy: 7,
    mood: 7,
    notes: '',
  })
  const [saved, setSaved] = useState(false)
  const [healthImported, setHealthImported] = useState(false)
  const [importingHealth, setImportingHealth] = useState(false)
  const peakWindow = form.wakeTime ? getPeakAlertnessWindow(form.wakeTime) : null

  useEffect(() => {
    const all = vitalsStore.getRecent(30)
    setEntries(all)
    const todayEntry = all.find(e => e.date === todayStr)
    if (todayEntry) { setForm(todayEntry); return }
    // Auto-import from Apple Health / Google Fit on native
    if (isNative()) importFromHealth(true)
  }, [todayStr])

  async function importFromHealth(silent = false) {
    setImportingHealth(true)
    try {
      const granted = await requestHealthPermissions()
      if (!granted) { if (!silent) alert('Health access denied. Enable it in Settings → Privacy → Health.'); return }
      const data = await fetchTodayHealthData()
      if (data.source === 'none') return
      setForm(f => ({
        ...f,
        ...(data.sleepHours !== null ? { sleepHours: data.sleepHours } : {}),
        ...(data.hrv !== null ? { hrv: data.hrv } : {}),
        ...(data.rhr !== null ? { rhr: data.rhr } : {}),
      }))
      setHealthImported(true)
      // Set up daily reminder on first health import
      const notifGranted = await requestNotificationPermission()
      if (notifGranted) scheduleDailyVitalsReminder()
    } finally {
      setImportingHealth(false)
    }
  }

  function save() {
    vitalsStore.save({ ...form, id: form.id || generateId() })
    setEntries(vitalsStore.getRecent(30))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const chartData = [...entries].reverse().slice(-14).map(e => ({
    date: format(new Date(e.date), 'MM/dd'),
    HRV: e.hrv,
    Sleep: parseFloat((e.sleepHours).toFixed(1)),
    Energy: e.energy * 10,
    Readiness: calculateReadiness(e),
  }))

  const last = entries[0]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="forge-label mb-1">Health & Performance</p>
        <h1 className="text-3xl font-bold text-gradient">Vitals</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Log form */}
        <div className="forge-card space-y-5">
          <div className="flex items-center justify-between">
            <span className="forge-label flex items-center gap-2">
              Log Today — {format(new Date(), 'MMM d')}
              {healthImported && (
                <span className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                  <Watch className="w-3 h-3" />auto-filled
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {isNative() && (
                <Button onClick={() => importFromHealth(false)} size="sm" variant="ghost"
                  disabled={importingHealth}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-primary h-7">
                  <Watch className="w-3 h-3" />
                  {importingHealth ? 'Importing…' : 'Apple Health'}
                </Button>
              )}
            <Button onClick={save} size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="w-3.5 h-3.5" />
              {saved ? 'Saved!' : 'Save'}
            </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="forge-label">Sleep Hours</label>
              <input
                type="number" min={0} max={12} step={0.5} value={form.sleepHours}
                onChange={e => setForm(f => ({ ...f, sleepHours: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="forge-label">RHR (bpm)</label>
              <input
                type="number" min={30} max={120} value={form.rhr}
                onChange={e => setForm(f => ({ ...f, rhr: parseInt(e.target.value) || 0 }))}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>

          <Slider label="Sleep Quality" value={form.sleepQuality} onChange={v => setForm(f => ({ ...f, sleepQuality: v }))} icon={Moon} />
          <Slider label="HRV" value={form.hrv ?? 60} onChange={v => setForm(f => ({ ...f, hrv: v }))} min={20} max={150} icon={Heart} />
          <Slider label="Energy" value={form.energy} onChange={v => setForm(f => ({ ...f, energy: v }))} icon={Zap} />
          <Slider label="Mood" value={form.mood} onChange={v => setForm(f => ({ ...f, mood: v }))} icon={Smile} />
          <Slider label="Overall Feeling" value={form.feeling ?? 7} onChange={v => setForm(f => ({ ...f, feeling: v }))} icon={Sparkles} />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="forge-label flex items-center gap-2"><AlarmClock className="w-3.5 h-3.5" />Wake Time</label>
              {peakWindow && (
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Peak {peakWindow.start}–{peakWindow.end}
                </span>
              )}
            </div>
            <input
              type="time" value={form.wakeTime ?? ''}
              onChange={e => setForm(f => ({ ...f, wakeTime: e.target.value }))}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground"
            />
          </div>

          {/* Steps + Water row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="forge-label flex items-center gap-1.5"><Footprints className="w-3.5 h-3.5" />Steps</label>
              <input
                type="number" min={0} max={100000} step={100} value={form.steps ?? ''}
                onChange={e => setForm(f => ({ ...f, steps: parseInt(e.target.value) || undefined }))}
                placeholder="0"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="forge-label flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-blue-400" />Water</label>
                <span className="text-xs font-bold text-blue-400">{form.waterLiters?.toFixed(1) ?? '0.0'}L</span>
              </div>
              <div className="flex gap-1">
                {[0.25, 0.5, 0.75, 1].map(amt => (
                  <button key={amt} onClick={() => setForm(f => ({ ...f, waterLiters: Math.min(10, (f.waterLiters ?? 0) + amt) }))}
                    className="flex-1 text-[10px] py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors">
                    +{amt}L
                  </button>
                ))}
              </div>
              {(form.waterLiters ?? 0) > 0 && (
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500 bg-blue-400"
                    style={{ width: `${Math.min(100, ((form.waterLiters ?? 0) / 2.5) * 100)}%` }} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="forge-label">Notes</label>
            <textarea
              value={form.notes ?? ''} rows={2}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="How are you feeling today?"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>
        </div>

        {/* Today's snapshot */}
        <div className="space-y-4">
          {!last && (
            <div className="forge-card flex flex-col items-center justify-center text-center p-8 min-h-[200px]">
              <Heart className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-sm mb-1.5">Log your first vitals</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">Track sleep, HRV, and energy daily. After 3+ entries Oracle builds your recovery pattern — the data behind your performance ceiling.</p>
            </div>
          )}
          {last && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Sleep', value: `${last.sleepHours}h`, sub: `Quality ${last.sleepQuality}/10`, color: 'text-blue-400' },
                { label: 'HRV', value: `${last.hrv}ms`, sub: `RHR ${last.rhr}bpm`, color: 'text-green-400' },
                { label: 'Energy', value: `${last.energy}/10`, sub: '', color: 'text-yellow-400' },
                { label: 'Readiness', value: `${calculateReadiness(last)}%`, sub: '', color: 'text-primary' },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="forge-card">
                  <div className="forge-label mb-1">{label}</div>
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Sleep debt */}
          {entries.length >= 3 && (() => {
            const last7 = entries.slice(0, 7)
            const debt = last7.reduce((sum, e) => sum + Math.max(0, 8 - e.sleepHours), 0)
            const avg = last7.reduce((s, e) => s + e.sleepHours, 0) / last7.length
            const color = debt <= 2 ? 'text-green-400' : debt <= 5 ? 'text-yellow-400' : 'text-red-400'
            const label = debt <= 2 ? 'Well rested' : debt <= 5 ? 'Mild deficit' : 'Sleep debt — prioritise recovery'
            return (
              <div className="forge-card flex items-center gap-4">
                <div className="flex-1">
                  <div className="forge-label mb-1">Sleep Debt (7 days)</div>
                  <div className={`text-2xl font-bold ${color}`}>{debt.toFixed(1)}h</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    avg {avg.toFixed(1)}h/night · {label}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {last7.slice(0, 5).reverse().map((e, i) => {
                    const d = Math.max(0, 8 - e.sleepHours)
                    return (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, (e.sleepHours / 8) * 100)}%`, backgroundColor: e.sleepHours >= 7.5 ? '#22c55e' : e.sleepHours >= 6 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-10">{e.sleepHours}h{d > 0 ? ` -${d.toFixed(1)}` : ''}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* Readiness trend */}
          {chartData.length > 1 && (
            <div className="forge-card">
              <div className="forge-label mb-4">14-Day Readiness Trend</div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="Readiness" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Supplement Stack */}
      <div className="mb-6">
        <SupplementStack />
      </div>

      {/* HRV + Sleep charts */}
      {chartData.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="forge-card">
            <div className="forge-label mb-4">HRV Trend</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="HRV" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="forge-card">
            <div className="forge-label mb-4">Sleep Hours</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Sleep" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History */}
      {entries.length > 0 && (
        <div className="forge-card mt-4">
          <div className="forge-label mb-4">History</div>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
            {entries.map(e => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-sm group">
                <span className="text-muted-foreground w-12 flex-shrink-0">{format(new Date(e.date), 'MMM d')}</span>
                <span>Sleep: <b>{e.sleepHours}h</b></span>
                <span>HRV: <b className="text-green-400">{e.hrv}ms</b></span>
                <span>Energy: <b>{e.energy}/10</b></span>
                <span className="flex items-center gap-2">
                  <b className="text-primary">{calculateReadiness(e)}%</b>
                  <button onClick={() => { vitalsStore.delete(e.id); setEntries(vitalsStore.getRecent(30)) }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
