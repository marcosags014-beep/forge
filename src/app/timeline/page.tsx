'use client'

import { useEffect, useState } from 'react'
import { format, subDays, startOfWeek, addDays } from 'date-fns'
import {
  ChevronLeft, ChevronRight, Plus, Trash2, Coffee,
  Utensils, Dumbbell, Zap, FileText, Clock,
  CalendarDays, Sparkles, Check, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  timelineStore, generateId, today,
  getCaffeineCurve, getCaffeineLevel, getAllDataForAI,
} from '@/lib/store'
import type { TimelineEntry, TimelineCategory } from '@/lib/types'
import Link from 'next/link'

// ── Config ────────────────────────────────────────────────────────────────────

const CAFFEINE_PRESETS = [
  { label: 'Espresso', mg: 65 },
  { label: 'Coffee', mg: 95 },
  { label: 'Green tea', mg: 30 },
  { label: 'Energy drink', mg: 80 },
  { label: 'Pre-workout', mg: 200 },
]

const CAT: Record<TimelineCategory, {
  icon: React.ElementType
  label: string
  color: string       // text colour
  bg: string          // block background
  border: string      // block border
  placeholder: string
}> = {
  meal:      { icon: Utensils,  label: 'Meal',      color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  placeholder: 'e.g. Oats + protein, black coffee' },
  stimulant: { icon: Coffee,    label: 'Stimulant', color: 'text-yellow-400',  bg: 'bg-yellow-500/10', border: 'border-yellow-500/30',  placeholder: 'e.g. Espresso, pre-workout' },
  workout:   { icon: Dumbbell,  label: 'Workout',   color: 'text-blue-400',    bg: 'bg-blue-500/10',   border: 'border-blue-500/30',    placeholder: 'e.g. Upper body — chest + back' },
  energy:    { icon: Zap,       label: 'Energy',    color: 'text-green-400',   bg: 'bg-green-500/10',  border: 'border-green-500/30',   placeholder: 'How focused / energised do you feel?' },
  note:      { icon: FileText,  label: 'Note',      color: 'text-zinc-400',    bg: 'bg-zinc-500/10',   border: 'border-zinc-500/30',    placeholder: 'Anything worth logging...' },
}

const HOUR_START = 5   // 05:00
const HOUR_END   = 24  // 00:00 next day
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i)
const SLOT_H = 56      // px per hour slot

function nowHHMM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function timeToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function getMondayOfWeek(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 }).toISOString().split('T')[0]
}

// ── Chart bar height: assume 45-min blocks unless we have next entry ──────────
function blockHeight(entry: TimelineEntry, next: TimelineEntry | null) {
  if (next) {
    const diff = timeToMinutes(next.time) - timeToMinutes(entry.time)
    if (diff > 0 && diff <= 240) return Math.max(36, (diff / 60) * SLOT_H - 6)
  }
  // Default durations by category
  const defaults: Record<TimelineCategory, number> = {
    workout: 60, meal: 30, stimulant: 15, energy: 10, note: 10,
  }
  return (defaults[entry.category] / 60) * SLOT_H
}

// ── Day Chart ─────────────────────────────────────────────────────────────────

function DayChart({
  entries,
  isToday,
  onRemove,
  onMarkDone,
}: {
  entries: TimelineEntry[]
  isToday: boolean
  onRemove: (id: string) => void
  onMarkDone: (e: TimelineEntry) => void
}) {
  const nowMin = timeToMinutes(nowHHMM())
  const nowTop = isToday ? ((nowMin - HOUR_START * 60) / 60) * SLOT_H : null

  return (
    <div className="relative flex" style={{ minHeight: HOURS.length * SLOT_H }}>
      {/* Hour axis */}
      <div className="flex-shrink-0 w-12 relative">
        {HOURS.map(h => (
          <div
            key={h}
            className="absolute right-0 flex items-start pr-2"
            style={{ top: (h - HOUR_START) * SLOT_H, height: SLOT_H }}
          >
            <span className="text-[10px] font-medium text-muted-foreground/50 leading-none pt-0.5 tabular-nums">
              {h === 24 ? '00' : String(h).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      {/* Grid + blocks */}
      <div className="flex-1 relative ml-1">
        {/* Hour grid lines */}
        {HOURS.map(h => (
          <div
            key={h}
            className="absolute left-0 right-0 border-t border-border/30"
            style={{ top: (h - HOUR_START) * SLOT_H }}
          />
        ))}

        {/* Now line */}
        {nowTop !== null && nowTop >= 0 && (
          <div
            className="absolute left-0 right-0 z-10 flex items-center gap-1 pointer-events-none"
            style={{ top: nowTop }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 -ml-0.5" />
            <div className="flex-1 h-px bg-primary opacity-70" />
          </div>
        )}

        {/* Entry blocks */}
        {entries.map((entry, i) => {
          const next = entries[i + 1] ?? null
          const topPx = ((timeToMinutes(entry.time) - HOUR_START * 60) / 60) * SLOT_H
          const h = blockHeight(entry, next)
          const cfg = CAT[entry.category]
          const Icon = cfg.icon
          const isPlanned = !!entry.planned

          return (
            <div
              key={entry.id}
              className={`absolute left-1 right-1 rounded-lg border px-2.5 py-1.5 group flex gap-2 overflow-hidden transition-all
                ${isPlanned
                  ? `border-dashed ${cfg.border} ${cfg.bg} opacity-70`
                  : `${cfg.border} ${cfg.bg}`
                }`}
              style={{ top: topPx + 2, height: h - 2 }}
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-l-lg ${cfg.color.replace('text-', 'bg-')} opacity-60`} />

              <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 pl-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Icon className={`w-3 h-3 flex-shrink-0 ${cfg.color} ${isPlanned ? 'opacity-60' : ''}`} />
                  <span className={`text-xs font-semibold truncate leading-tight ${isPlanned ? 'text-foreground/60' : 'text-foreground'}`}>
                    {entry.title}
                  </span>
                  {isPlanned && (
                    <span className="flex-shrink-0 text-[9px] text-primary/60 bg-primary/10 px-1 rounded-sm">
                      {entry.source === 'oracle' ? '✦' : 'plan'}
                    </span>
                  )}
                </div>
                {h > 44 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{entry.time}</span>
                    {entry.detail && (
                      <span className="text-[10px] text-muted-foreground truncate">— {entry.detail}</span>
                    )}
                    {entry.energy !== undefined && (
                      <span className="text-[10px] text-green-400 font-semibold">{entry.energy}/10 energy</span>
                    )}
                    {entry.caffeineMg !== undefined && entry.caffeineMg > 0 && (
                      <span className="text-[10px] text-yellow-400 font-semibold">{entry.caffeineMg}mg</span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions (hover) */}
              <div className="flex-shrink-0 flex flex-col justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isPlanned && (
                  <button
                    onClick={() => onMarkDone(entry)}
                    className="text-muted-foreground hover:text-green-400 transition-colors"
                    title="Mark done"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onRemove(entry.id)}
                  className="text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )
        })}

        {/* Placeholder when empty */}
        {entries.length === 0 && (
          <div
            className="absolute left-0 right-0 flex items-center justify-center"
            style={{ top: (8 - HOUR_START) * SLOT_H, height: 160 }}
          >
            <div className="text-center">
              <Clock className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Nothing logged yet</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                Prepare with Oracle or log an entry
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Week strip ────────────────────────────────────────────────────────────────

function WeekStrip({
  weekOffset,
  onSelectDay,
  selectedDay,
}: {
  weekOffset: number
  onSelectDay: (d: string | null) => void
  selectedDay: string | null
}) {
  const [weekEntries, setWeekEntries] = useState<TimelineEntry[]>([])
  const monday = getMondayOfWeek(subDays(new Date(), weekOffset * 7))
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(monday), i))
  const todayStr = today()

  useEffect(() => {
    setWeekEntries(timelineStore.getForWeek(monday))
  }, [monday])

  return (
    <div className="grid grid-cols-7 gap-1 mb-4">
      {days.map(day => {
        const ds = day.toISOString().split('T')[0]
        const dayE = weekEntries.filter(e => e.date === ds)
        const planned = dayE.filter(e => e.planned).length
        const logged  = dayE.filter(e => !e.planned).length
        const isT = ds === todayStr
        const isSel = ds === selectedDay

        return (
          <button
            key={ds}
            onClick={() => onSelectDay(isSel ? null : ds)}
            className={`rounded-xl p-1.5 text-center transition-all border ${
              isSel   ? 'bg-primary/15 border-primary/50' :
              isT     ? 'bg-primary/8  border-primary/25' :
                        'bg-secondary/40 border-border hover:bg-secondary/70'
            }`}
          >
            <p className={`text-[9px] font-semibold uppercase tracking-wide ${isT ? 'text-primary' : 'text-muted-foreground'}`}>
              {format(day, 'EEE')}
            </p>
            <p className={`text-sm font-bold mt-0.5 ${isT ? 'text-primary' : 'text-foreground'}`}>
              {format(day, 'd')}
            </p>
            <div className="mt-1 space-y-0.5 min-h-[18px]">
              {logged  > 0 && <div className="text-[8px] font-medium bg-foreground/10 text-foreground/60 rounded px-0.5">{logged}✓</div>}
              {planned > 0 && <div className="text-[8px] font-medium bg-primary/15 text-primary/70 rounded px-0.5">{planned}✦</div>}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Oracle Plan Button ────────────────────────────────────────────────────────

function OraclePlanButton({ dateStr, onDone }: { dateStr: string; onDone: () => void }) {
  const [loading, setLoading] = useState(false)
  const [scope, setScope]     = useState<'day' | 'week' | null>(null)
  const [error, setError]     = useState('')

  async function requestPlan(s: 'day' | 'week') {
    setLoading(true); setScope(s); setError('')
    try {
      const userData = getAllDataForAI()
      const prompt = s === 'day'
        ? `Prepare my day for ${dateStr}. Build a structured plan: wake-up, meals, workout, focus blocks, breaks, wind-down. Use PLAN_DAY tokens for every block.`
        : `Prepare my full week starting from ${dateStr}. 7 days of meals, workouts, focus blocks, and recovery. Use PLAN_DAY tokens for every scheduled activity.`

      const res  = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'plan', message: prompt, userData }),
      })
      const data = await res.json()

      const planRe    = /\[PLAN_DAY:\s*([^|\]]+?)\s*\|\s*([^|\]]+?)\s*\|\s*([^|\]]+?)\s*\|\s*([^|\]]+?)(?:\s*\|\s*([^\]]*?))?\s*\]/g
      const validCats = ['meal','workout','stimulant','note','energy']
      let m: RegExpExecArray | null
      let saved = 0
      while ((m = planRe.exec(data.content)) !== null) {
        const cat = m[3].trim().toLowerCase()
        timelineStore.save({
          id: generateId(),
          date: m[1].trim(),
          time: m[2].trim(),
          category: (validCats.includes(cat) ? cat : 'note') as TimelineCategory,
          title: m[4].trim(),
          detail: m[5]?.trim() || undefined,
          planned: true,
          source: 'oracle',
        })
        saved++
      }
      if (saved > 0) onDone()
      else setError('No plan blocks returned — try asking in Oracle chat.')
    } catch {
      setError('Oracle unavailable')
    } finally {
      setLoading(false); setScope(null)
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <Button onClick={() => requestPlan('day')} disabled={loading} size="sm"
          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 gap-1.5 text-xs h-8">
          {loading && scope === 'day'
            ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />Preparing…</>
            : <><Sparkles className="w-3.5 h-3.5" />Prepare today</>
          }
        </Button>
        <Button onClick={() => requestPlan('week')} disabled={loading} size="sm"
          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 gap-1.5 text-xs h-8">
          {loading && scope === 'week'
            ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />Preparing…</>
            : <><CalendarDays className="w-3.5 h-3.5" />Prepare week</>
          }
        </Button>
      </div>
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  )
}

// ── Add entry form ────────────────────────────────────────────────────────────

function AddForm({ dateStr, onSave, onCancel }: { dateStr: string; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    time: nowHHMM(), category: 'meal' as TimelineCategory,
    title: '', detail: '', energy: 7, caffeineMg: 95,
  })

  function save() {
    if (!form.title.trim()) return
    timelineStore.save({
      id: generateId(),
      date: dateStr,
      time: form.time,
      category: form.category,
      title: form.title.trim(),
      detail: form.detail.trim() || undefined,
      energy: form.category === 'energy' ? form.energy : undefined,
      caffeineMg: form.category === 'stimulant' ? form.caffeineMg : undefined,
    })
    onSave()
  }

  return (
    <div className="forge-card mb-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold">New entry</p>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="forge-label">Time</label>
          <input type="time" value={form.time}
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
        </div>
        <div className="space-y-1">
          <label className="forge-label">Category</label>
          <select value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value as TimelineCategory }))}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
            {(Object.keys(CAT) as TimelineCategory[]).map(k => (
              <option key={k} value={k}>{CAT[k].label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="forge-label">{CAT[form.category].label}</label>
        <input value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder={CAT[form.category].placeholder}
          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          onKeyDown={e => e.key === 'Enter' && save()}
        />
      </div>

      {form.category === 'energy' && (
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="forge-label">Energy level</label>
            <span className="text-sm font-bold text-primary">{form.energy}/10</span>
          </div>
          <input type="range" min={1} max={10} value={form.energy}
            onChange={e => setForm(f => ({ ...f, energy: parseInt(e.target.value) }))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: 'oklch(0.705 0.213 47.604)' }} />
        </div>
      )}

      {form.category === 'stimulant' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="forge-label flex items-center gap-1"><Coffee className="w-3.5 h-3.5 text-yellow-400" />Caffeine</label>
            <span className="text-sm font-bold text-yellow-400">{form.caffeineMg}mg</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CAFFEINE_PRESETS.map(p => (
              <button key={p.label}
                onClick={() => setForm(f => ({ ...f, title: f.title || p.label, caffeineMg: p.mg }))}
                className={`text-[10px] px-2 py-1 rounded-full border transition-all ${
                  form.caffeineMg === p.mg
                    ? 'border-yellow-400/60 bg-yellow-400/10 text-yellow-400'
                    : 'border-border bg-secondary text-muted-foreground hover:border-yellow-400/40'
                }`}>
                {p.label} {p.mg}mg
              </button>
            ))}
          </div>
          <input type="number" min={0} max={600} step={5} value={form.caffeineMg}
            onChange={e => setForm(f => ({ ...f, caffeineMg: parseInt(e.target.value) || 0 }))}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground"
            placeholder="Custom mg" />
        </div>
      )}

      <input value={form.detail}
        onChange={e => setForm(f => ({ ...f, detail: e.target.value }))}
        placeholder="Notes (optional)"
        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
      />

      <div className="flex gap-2">
        <Button size="sm" onClick={save} disabled={!form.title.trim()} className="flex-1 bg-primary text-primary-foreground">
          Add
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="flex-1">Cancel</Button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TimelinePage() {
  const [view, setView]         = useState<'day' | 'week'>('day')
  const [dateOffset, setDateOffset] = useState(0)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedWeekDay, setSelectedWeekDay] = useState<string | null>(null)
  const [entries, setEntries]   = useState<TimelineEntry[]>([])
  const [adding, setAdding]     = useState(false)
  const [showPlanned, setShowPlanned] = useState(true)

  const dateStr    = subDays(new Date(), dateOffset).toISOString().split('T')[0]
  const isToday    = dateOffset === 0
  const displayDate = format(subDays(new Date(), dateOffset), 'EEEE, MMMM d')

  function reload() { setEntries(timelineStore.getForDate(dateStr)) }

  useEffect(() => { reload() }, [dateStr])

  const visibleEntries = (showPlanned ? entries : entries.filter(e => !e.planned))
    .sort((a, b) => a.time.localeCompare(b.time))

  const plannedCount = entries.filter(e => e.planned).length

  function remove(id: string) { timelineStore.delete(id); reload() }
  function markDone(e: TimelineEntry) { timelineStore.save({ ...e, planned: false }); reload() }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="forge-label mb-1"><Clock className="w-3.5 h-3.5" />Timeline</p>
          <h1 className="text-2xl font-bold leading-tight">
            {view === 'week' ? 'Weekly Plan' : displayDate}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Day / Week toggle */}
          <div className="flex rounded-xl border border-border overflow-hidden text-xs font-medium">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 transition-colors ${view === 'day' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
            >Day</button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 transition-colors ${view === 'week' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
            >Week</button>
          </div>

          {/* Prev / Next */}
          <button
            onClick={() => view === 'day' ? setDateOffset(d => d + 1) : setWeekOffset(w => w + 1)}
            className="p-1.5 rounded-lg bg-secondary hover:bg-card border border-border transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={view === 'day' ? isToday : weekOffset === 0}
            onClick={() => view === 'day' ? setDateOffset(d => Math.max(0, d - 1)) : setWeekOffset(w => Math.max(0, w - 1))}
            className="p-1.5 rounded-lg bg-secondary hover:bg-card border border-border transition-colors disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Oracle prep bar */}
      <div className="forge-card mb-4">
        <OraclePlanButton dateStr={dateStr} onDone={reload} />
        {plannedCount > 0 && (
          <button
            onClick={() => setShowPlanned(s => !s)}
            className="w-full mt-2.5 text-[10px] text-muted-foreground flex items-center justify-center gap-1.5 hover:text-foreground transition-colors"
          >
            <CalendarDays className="w-3 h-3" />
            {showPlanned ? `Hide ${plannedCount} planned` : `Show ${plannedCount} planned`}
          </button>
        )}
      </div>

      {/* Week view */}
      {view === 'week' && (
        <div className="space-y-3">
          <WeekStrip weekOffset={weekOffset} onSelectDay={setSelectedWeekDay} selectedDay={selectedWeekDay} />

          {selectedWeekDay && (
            <div className="forge-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">
                  {format(new Date(selectedWeekDay + 'T00:00:00'), 'EEEE, MMMM d')}
                </p>
                <Link href="/timeline" className="text-xs text-primary hover:underline">Full view →</Link>
              </div>
              <DayChart
                entries={timelineStore.getForDate(selectedWeekDay)}
                isToday={selectedWeekDay === today()}
                onRemove={id => { timelineStore.delete(id); setSelectedWeekDay(d => d) }}
                onMarkDone={e => { timelineStore.save({ ...e, planned: false }); setSelectedWeekDay(d => d) }}
              />
            </div>
          )}

          {!selectedWeekDay && (
            <div className="text-center py-8 text-xs text-muted-foreground">
              Tap a day above to see its schedule
            </div>
          )}
        </div>
      )}

      {/* Day view */}
      {view === 'day' && (
        <>
          {/* Log button */}
          {!adding && (
            <Button
              onClick={() => setAdding(true)}
              className="w-full mb-4 bg-secondary hover:bg-card text-foreground border border-border gap-2 h-9 text-sm"
            >
              <Plus className="w-4 h-4" />Log entry
            </Button>
          )}

          {adding && (
            <AddForm dateStr={dateStr} onSave={() => { reload(); setAdding(false) }} onCancel={() => setAdding(false)} />
          )}

          {/* The chart */}
          <div className="forge-card p-0 overflow-hidden">
            <div className="p-3 pb-0">
              <DayChart
                entries={visibleEntries}
                isToday={isToday}
                onRemove={remove}
                onMarkDone={markDone}
              />
            </div>

            {/* Caffeine mini-legend (if any stimulants logged) */}
            {entries.filter(e => !e.planned && e.category === 'stimulant' && e.caffeineMg).length > 0 && (
              <div className="px-4 py-2 border-t border-border/30 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-yellow-400" />
                  {Math.round(getCaffeineLevel(entries.filter(e => !e.planned), nowHHMM()))}mg caffeine now
                </span>
                <span className="text-[9px] text-muted-foreground/50">half-life 5h</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
