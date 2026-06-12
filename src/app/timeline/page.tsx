'use client'

import { useEffect, useState } from 'react'
import { format, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Trash2, Coffee, Utensils, Dumbbell, Zap, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { timelineStore, generateId, today } from '@/lib/store'
import type { TimelineEntry, TimelineCategory } from '@/lib/types'

const CATEGORY_CONFIG: Record<TimelineCategory, { icon: React.ElementType; label: string; color: string; placeholder: string }> = {
  meal:      { icon: Utensils,  label: 'Meal',      color: 'text-orange-400',  placeholder: 'e.g. Oats + protein, black coffee' },
  stimulant: { icon: Coffee,    label: 'Stimulant', color: 'text-yellow-400',  placeholder: 'e.g. Espresso, pre-workout, green tea' },
  workout:   { icon: Dumbbell,  label: 'Workout',   color: 'text-blue-400',    placeholder: 'e.g. Upper body — chest + back' },
  energy:    { icon: Zap,       label: 'Energy',    color: 'text-green-400',   placeholder: 'How focused / energised do you feel?' },
  note:      { icon: FileText,  label: 'Note',      color: 'text-muted-foreground', placeholder: 'Anything worth logging...' },
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6) // 06:00–23:00

function nowHHMM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function TimelinePage() {
  const [dateOffset, setDateOffset] = useState(0)
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<{ time: string; category: TimelineCategory; title: string; detail: string; energy: number }>({
    time: nowHHMM(), category: 'meal', title: '', detail: '', energy: 7,
  })

  const dateStr = subDays(new Date(), dateOffset).toISOString().split('T')[0]
  const isToday = dateOffset === 0
  const displayDate = format(subDays(new Date(), dateOffset), 'EEEE, MMMM d')

  useEffect(() => {
    setEntries(timelineStore.getForDate(dateStr))
    if (isToday) setForm(f => ({ ...f, time: nowHHMM() }))
  }, [dateStr, isToday])

  function add() {
    if (!form.title.trim()) return
    const entry: TimelineEntry = {
      id: generateId(),
      date: dateStr,
      time: form.time,
      category: form.category,
      title: form.title.trim(),
      detail: form.detail.trim() || undefined,
      energy: form.category === 'energy' ? form.energy : undefined,
    }
    timelineStore.save(entry)
    setEntries(timelineStore.getForDate(dateStr))
    setForm(f => ({ ...f, title: '', detail: '', time: nowHHMM() }))
    setAdding(false)
  }

  function remove(id: string) {
    timelineStore.delete(id)
    setEntries(timelineStore.getForDate(dateStr))
  }

  // Group entries by hour block
  const grouped = HOURS.map(h => {
    const hour = String(h).padStart(2, '0')
    const block = entries.filter(e => e.time.startsWith(hour))
    return { hour, label: `${h > 12 ? h - 12 : h}${h >= 12 ? 'pm' : 'am'}`, entries: block }
  })

  const currentHour = new Date().getHours()

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="forge-label mb-1"><Clock className="w-3.5 h-3.5" />Daily Timeline</p>
          <h1 className="text-2xl md:text-3xl font-bold">{displayDate}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDateOffset(d => d + 1)}
            className="p-2 rounded-xl bg-secondary hover:bg-card border border-border transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button disabled={isToday} onClick={() => setDateOffset(d => Math.max(0, d - 1))}
            className="p-2 rounded-xl bg-secondary hover:bg-card border border-border transition-colors disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add entry */}
      {!adding ? (
        <Button onClick={() => setAdding(true)}
          className="w-full mb-6 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 gap-2">
          <Plus className="w-4 h-4" />
          Log entry
        </Button>
      ) : (
        <div className="forge-card mb-6 space-y-4">
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
                {(Object.keys(CATEGORY_CONFIG) as TimelineCategory[]).map(k => (
                  <option key={k} value={k}>{CATEGORY_CONFIG[k].label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="forge-label">{CATEGORY_CONFIG[form.category].label}</label>
            <input value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder={CATEGORY_CONFIG[form.category].placeholder}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
              onKeyDown={e => e.key === 'Enter' && add()}
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

          <div className="space-y-1">
            <label className="forge-label">Notes (optional)</label>
            <input value={form.detail}
              onChange={e => setForm(f => ({ ...f, detail: e.target.value }))}
              placeholder="Any extra detail..."
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={add} disabled={!form.title.trim()}
              className="flex-1 bg-primary text-primary-foreground">
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Hourly timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[52px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-0">
          {grouped.map(({ hour, label, entries: blockEntries }) => {
            const isCurrent = isToday && parseInt(hour) === currentHour
            const hasContent = blockEntries.length > 0

            if (!hasContent && !isCurrent) return null

            return (
              <div key={hour} className="relative flex gap-4 pb-4">
                {/* Time label */}
                <div className={`w-[52px] flex-shrink-0 text-right pr-3 pt-0.5 text-xs font-medium transition-colors ${
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {label}
                </div>

                {/* Dot */}
                <div className={`absolute left-[49px] top-1.5 w-1.5 h-1.5 rounded-full border-2 transition-colors ${
                  isCurrent ? 'bg-primary border-primary' : hasContent ? 'bg-border border-primary/40' : 'bg-border border-border'
                }`} />

                {/* Entries */}
                <div className="flex-1 space-y-2">
                  {isCurrent && blockEntries.length === 0 && (
                    <div className="text-xs text-muted-foreground italic pt-0.5">Now</div>
                  )}
                  {blockEntries.map(entry => {
                    const cfg = CATEGORY_CONFIG[entry.category]
                    const Icon = cfg.icon
                    return (
                      <div key={entry.id} className="group forge-card py-2.5 px-3 flex items-start gap-3">
                        <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium truncate">{entry.title}</span>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">{entry.time}</span>
                          </div>
                          {entry.detail && <p className="text-xs text-muted-foreground mt-0.5">{entry.detail}</p>}
                          {entry.energy !== undefined && (
                            <div className="flex items-center gap-1 mt-1">
                              <Zap className="w-3 h-3 text-green-400" />
                              <span className="text-xs font-semibold text-green-400">{entry.energy}/10</span>
                            </div>
                          )}
                        </div>
                        <button onClick={() => remove(entry.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all flex-shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {entries.length === 0 && !adding && (
          <div className="text-center py-16">
            <Clock className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">Nothing logged yet</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Track meals, stimulants, workouts, and energy check-ins throughout the day. See your rhythm at a glance.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
