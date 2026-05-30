'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Moon, Heart, Zap, Smile, Save, Watch } from 'lucide-react'
import { fetchTodayHealthData, requestHealthPermissions, isNative, scheduleDailyVitalsReminder, requestNotificationPermission } from '@/lib/health'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { vitalsStore, generateId, today, calculateReadiness } from '@/lib/store'
import type { VitalEntry } from '@/lib/types'

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
        <h1 className="text-3xl font-bold">Vitals</h1>
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
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-sm">
                <span className="text-muted-foreground">{format(new Date(e.date), 'MMM d')}</span>
                <span>Sleep: <b>{e.sleepHours}h</b></span>
                <span>HRV: <b className="text-green-400">{e.hrv}ms</b></span>
                <span>Energy: <b>{e.energy}/10</b></span>
                <span>Readiness: <b className="text-primary">{calculateReadiness(e)}%</b></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
