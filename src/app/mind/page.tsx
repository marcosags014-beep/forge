'use client'

import { useEffect, useState, useRef } from 'react'
import { CheckCircle2, Circle, Plus, Trash2, Target, Zap, ListTodo, ChevronRight, Trophy, Lock, LayoutGrid, List, BarChart2, Timer, Pause, Play, RotateCcw, Coffee, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { goalsStore, habitsStore, tasksStore, generateId, today, getHabitStreak, ALL_ACHIEVEMENTS, achievementsStore, checkAndUnlockAchievements, getAlignmentScore } from '@/lib/store'
import type { Goal, Habit, Task, Achievement } from '@/lib/types'
import { format, subDays } from 'date-fns'

const HABIT_BUNDLES: { label: string; habits: { name: string; category: string }[] }[] = [
  {
    label: 'Morning Routine',
    habits: [
      { name: 'Morning sunlight (10 min)', category: 'Health' },
      { name: 'Cold shower', category: 'Health' },
      { name: 'No phone first hour', category: 'Mind' },
    ],
  },
  {
    label: 'Peak Performance',
    habits: [
      { name: 'Workout', category: 'Fitness' },
      { name: 'Read 20 pages', category: 'Mind' },
      { name: 'No alcohol', category: 'Health' },
      { name: 'Asleep by 11pm', category: 'Health' },
    ],
  },
  {
    label: 'Wealth Builder',
    habits: [
      { name: 'Track every expense', category: 'Finance' },
      { name: 'No impulse purchases', category: 'Finance' },
      { name: 'Learn one thing (30 min)', category: 'Mind' },
    ],
  },
]

/* ----- Habits ----- */
function HabitsPanel() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('Health')
  const [showBundles, setShowBundles] = useState(false)
  const todayStr = today()

  const reload = () => setHabits(habitsStore.getAll())
  useEffect(reload, [])

  function addHabit() {
    if (!newName.trim()) return
    habitsStore.save({ id: generateId(), name: newName.trim(), category: newCat, completions: [] })
    setNewName('')
    reload()
  }

  function addBundle(bundle: typeof HABIT_BUNDLES[0]) {
    const existing = new Set(habits.map(h => h.name.toLowerCase()))
    bundle.habits.forEach(h => {
      if (!existing.has(h.name.toLowerCase())) {
        habitsStore.save({ id: generateId(), name: h.name, category: h.category, completions: [] })
      }
    })
    setShowBundles(false)
    reload()
  }

  // Last 7 days for streak grid
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i)
    return d.toISOString().split('T')[0]
  })

  return (
    <div className="space-y-4">
      <div className="forge-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="forge-label flex items-center gap-2"><Zap className="w-3.5 h-3.5" />Add Habit</span>
          <button onClick={() => setShowBundles(v => !v)}
            className="text-xs text-primary hover:underline">
            {showBundles ? 'Custom ↑' : '+ From bundle'}
          </button>
        </div>

        {showBundles ? (
          <div className="space-y-2">
            {HABIT_BUNDLES.map(bundle => (
              <button key={bundle.label} onClick={() => addBundle(bundle)}
                className="w-full text-left p-3 bg-secondary/60 hover:bg-primary/5 border border-border hover:border-primary/30 rounded-xl transition-all">
                <div className="text-sm font-medium mb-1">{bundle.label}</div>
                <div className="text-[11px] text-muted-foreground">{bundle.habits.map(h => h.name).join(' · ')}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            <input value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHabit()}
              placeholder="Habit name (e.g. Cold shower)"
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
            <select value={newCat} onChange={e => setNewCat(e.target.value)}
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              {['Health', 'Fitness', 'Mind', 'Finance', 'Social'].map(c => <option key={c}>{c}</option>)}
            </select>
            <Button onClick={addHabit} size="sm" className="bg-primary text-primary-foreground"><Plus className="w-4 h-4" /></Button>
          </div>
        )}
      </div>

      {habits.length === 0 && (
        <div className="forge-card flex flex-col items-center justify-center text-center py-8">
          <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mb-3" />
          <p className="font-semibold text-sm mb-1.5">No habits tracked yet</p>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">Add your first habit above. Streaks, completion rates, and your FORGE Alignment Score all start here.</p>
        </div>
      )}
      {habits.length > 0 && (
        <div className="forge-card">
          <div className="flex items-center gap-4 mb-3">
            <span className="forge-label flex-1">Your Habits</span>
            <div className="flex gap-1">
              {last7.map(d => (
                <span key={d} className="text-[9px] text-muted-foreground w-6 text-center">
                  {format(new Date(d), 'E')[0]}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {habits.map(habit => {
              const streak = getHabitStreak(habit)
              const doneTodayx = habit.completions.includes(todayStr)
              return (
                <div key={habit.id} className="flex items-center gap-3">
                  <button onClick={() => { habitsStore.toggle(habit.id, todayStr); reload() }} className="flex-shrink-0">
                    {doneTodayx
                      ? <CheckCircle2 className="w-5 h-5 text-primary" />
                      : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                    }
                  </button>
                  <span className={`flex-1 text-sm ${doneTodayx ? 'line-through text-muted-foreground' : ''}`}>{habit.name}</span>
                  {streak > 0 && <span className="text-xs text-primary">{streak}🔥</span>}
                  <div className="flex gap-1">
                    {last7.map(d => (
                      <div key={d} className={`w-6 h-6 rounded-sm flex-shrink-0 ${habit.completions.includes(d) ? 'bg-primary' : 'bg-secondary'}`} />
                    ))}
                  </div>
                  <button onClick={() => { habitsStore.delete(habit.id); reload() }}
                    className="text-muted-foreground hover:text-red-400 transition-colors ml-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Habit Analytics */}
      {habits.length > 0 && <HabitAnalytics habits={habits} />}
    </div>
  )
}

function HabitHeatmap({ habits }: { habits: Habit[] }) {
  const WEEKS = 12
  const days = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const d = subDays(new Date(), WEEKS * 7 - 1 - i)
    return d.toISOString().split('T')[0]
  })
  // For each day: % of habits completed
  const cells = days.map(date => {
    const done = habits.filter(h => h.completions.includes(date)).length
    const pct = habits.length > 0 ? done / habits.length : 0
    return { date, pct }
  })
  // Week column labels (Mon of each week)
  const weekLabels = Array.from({ length: WEEKS }, (_, w) => {
    const dayIdx = w * 7
    return format(new Date(days[dayIdx]), 'MMM d')
  })

  function cellColor(pct: number) {
    if (pct === 0) return 'bg-secondary'
    if (pct < 0.34) return 'bg-primary/20'
    if (pct < 0.67) return 'bg-primary/50'
    return 'bg-primary'
  }

  // Reshape into 7 rows (DOW) × WEEKS cols
  const rows = Array.from({ length: 7 }, (_, dow) =>
    Array.from({ length: WEEKS }, (_, w) => cells[w * 7 + dow])
  )
  const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">12-week habit grid</p>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Week labels */}
          <div className="flex gap-1 mb-1 ml-4">
            {weekLabels.map((l, i) => (
              <span key={i} className="text-[8px] text-muted-foreground w-4 flex-shrink-0 truncate">{i % 3 === 0 ? l.split(' ')[0] : ''}</span>
            ))}
          </div>
          {/* Grid */}
          {rows.map((row, dow) => (
            <div key={dow} className="flex items-center gap-1 mb-1">
              <span className="text-[8px] text-muted-foreground w-3 flex-shrink-0">{DOW[dow]}</span>
              {row.map((cell, w) => (
                <div
                  key={w}
                  title={`${cell.date}: ${Math.round(cell.pct * 100)}%`}
                  className={`w-4 h-4 rounded-sm flex-shrink-0 transition-colors ${cellColor(cell.pct)}`}
                />
              ))}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-2 ml-4">
            <span className="text-[8px] text-muted-foreground">Less</span>
            {['bg-secondary', 'bg-primary/20', 'bg-primary/50', 'bg-primary'].map(c => (
              <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span className="text-[8px] text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function HabitAnalytics({ habits }: { habits: Habit[] }) {
  const [show, setShow] = useState(false)

  // Day-of-week completion rates (last 30 days)
  const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dowData = DOW_LABELS.map((label, idx) => {
    const dayOfWeek = (idx + 1) % 7 // JS: 0=Sun, so Mon=1
    let completed = 0, total = 0
    for (let i = 0; i < 30; i++) {
      const d = subDays(new Date(), i)
      if (d.getDay() === dayOfWeek) {
        const dateStr = d.toISOString().split('T')[0]
        habits.forEach(h => {
          total++
          if (h.completions.includes(dateStr)) completed++
        })
      }
    }
    return { label, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
  })

  // Per-habit 30-day completion rate
  const last30 = Array.from({ length: 30 }, (_, i) => subDays(new Date(), i).toISOString().split('T')[0])
  const habitStats = habits.map(h => ({
    name: h.name.length > 14 ? h.name.slice(0, 13) + '…' : h.name,
    pct: Math.round((h.completions.filter(d => last30.includes(d)).length / 30) * 100),
    streak: getHabitStreak(h),
  })).sort((a, b) => b.pct - a.pct)

  return (
    <div className="forge-card">
      <button onClick={() => setShow(v => !v)} className="w-full flex items-center justify-between">
        <span className="forge-label flex items-center gap-2"><BarChart2 className="w-3.5 h-3.5" />Analytics (30 days)</span>
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${show ? 'rotate-90' : ''}`} />
      </button>

      {show && (
        <div className="mt-4 space-y-5">
          {/* 12-week heatmap */}
          <HabitHeatmap habits={habits} />

          {/* Day-of-week chart */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Best days of the week</p>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={dowData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}%`, 'Completion']}
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
                  {dowData.map((d, i) => (
                    <Cell key={i} fill={d.pct >= 70 ? '#22c55e' : d.pct >= 40 ? 'oklch(0.705 0.213 47.604)' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Per-habit rate */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Habit completion rate</p>
            <div className="space-y-2">
              {habitStats.map(h => (
                <div key={h.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 flex-shrink-0 truncate">{h.name}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${h.pct}%`, backgroundColor: h.pct >= 70 ? '#22c55e' : h.pct >= 40 ? 'oklch(0.705 0.213 47.604)' : '#ef4444' }} />
                  </div>
                  <span className="text-xs font-bold tabular-nums w-8 text-right"
                    style={{ color: h.pct >= 70 ? '#22c55e' : h.pct >= 40 ? 'oklch(0.705 0.213 47.604)' : '#ef4444' }}>
                    {h.pct}%
                  </span>
                  {h.streak > 0 && <span className="text-[10px] text-primary w-8">{h.streak}🔥</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ----- Commitments (formerly Tasks) ----- */
function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [dueDate, setDueDate] = useState('')
  const [alignment, setAlignment] = useState({ score: 0, habitRate: 0, keptRate: 100, overdueCount: 0 })
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const todayStr = today()

  const reload = () => {
    setTasks(tasksStore.getAll())
    setAlignment(getAlignmentScore())
  }
  useEffect(reload, [])

  function addTask() {
    if (!newTitle.trim()) return
    tasksStore.save({ id: generateId(), title: newTitle.trim(), priority, dueDate: dueDate || undefined, completed: false })
    setNewTitle('')
    reload()
  }

  function setPriorityAndReload(taskId: string, p: Task['priority']) {
    const t = tasks.find(t => t.id === taskId)
    if (!t) return
    tasksStore.save({ ...t, priority: p })
    reload()
  }

  const allActive = tasks.filter(t => !t.completed)
  const overdue = allActive.filter(t => t.createdAt && t.createdAt < todayStr)
  const todayTasks = allActive.filter(t => !t.createdAt || t.createdAt >= todayStr)
  const done = tasks.filter(t => t.completed)

  // Kanban columns: Todo (low/medium), Doing (high), Done
  const kanbanTodo = allActive.filter(t => t.priority !== 'high')
  const kanbanDoing = allActive.filter(t => t.priority === 'high')

  const priorityBg = { high: 'bg-red-500/10 border-red-500/20 text-red-400', medium: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', low: 'bg-secondary text-muted-foreground' }

  const TaskCard = ({ task, showMove = true }: { task: Task; showMove?: boolean }) => (
    <div className="flex items-start gap-3 group py-2 border-b border-border/40 last:border-0">
      <button onClick={() => { tasksStore.toggle(task.id); reload() }} className="mt-0.5 flex-shrink-0">
        {task.completed
          ? <CheckCircle2 className="w-4 h-4 text-green-400" />
          : <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        }
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</span>
          <Badge className={`text-[10px] py-0 ${priorityBg[task.priority]}`}>{task.priority}</Badge>
        </div>
        {task.dueDate && <div className="text-xs text-muted-foreground mt-0.5">Due {format(new Date(task.dueDate), 'MMM d')}</div>}
      </div>
      <button onClick={() => { tasksStore.delete(task.id); reload() }}
        className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )

  const KanbanCard = ({ task, col }: { task: Task; col: 'todo' | 'doing' | 'done' }) => (
    <div className="forge-card p-3 space-y-2 group">
      <p className="text-sm font-medium leading-snug">{task.title}</p>
      {task.dueDate && <p className="text-[10px] text-muted-foreground">Due {format(new Date(task.dueDate), 'MMM d')}</p>}
      <div className="flex items-center gap-1.5">
        {col === 'todo' && (
          <button onClick={() => setPriorityAndReload(task.id, 'high')}
            className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
            → Start
          </button>
        )}
        {col === 'doing' && (
          <>
            <button onClick={() => setPriorityAndReload(task.id, 'medium')}
              className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border hover:border-primary/20 transition-colors">
              ← Back
            </button>
            <button onClick={() => { tasksStore.toggle(task.id); reload() }}
              className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors">
              ✓ Done
            </button>
          </>
        )}
        <button onClick={() => { tasksStore.delete(task.id); reload() }}
          className="ml-auto text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between">
        <div>
          {tasks.length > 0 && (
            <span className={`text-xs font-semibold ${alignment.keptRate >= 80 ? 'text-green-400' : alignment.keptRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              {alignment.keptRate}% kept
            </span>
          )}
        </div>
        <div className="flex gap-1 p-0.5 bg-secondary rounded-lg">
          <button onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <List className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add form */}
      <div className="forge-card space-y-3">
        <span className="forge-label flex items-center gap-2"><ListTodo className="w-3.5 h-3.5" />Add Commitment</span>
        <div className="flex gap-2">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="What did you commit to doing?"
            className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {(['high', 'medium', 'low'] as const).map(p => (
              <button key={p} onClick={() => setPriority(p)}
                className={`px-3 py-1 rounded-md text-xs font-medium border transition-all ${priority === p ? priorityBg[p] : 'border-border text-muted-foreground'}`}>
                {p}
              </button>
            ))}
          </div>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground" />
          <Button onClick={addTask} size="sm" className="ml-auto bg-primary text-primary-foreground gap-1">
            <Plus className="w-3.5 h-3.5" />Add
          </Button>
        </div>
      </div>

      {allActive.length === 0 && done.length === 0 && (
        <div className="forge-card text-center py-8">
          <ListTodo className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No commitments yet.</p>
          <p className="text-xs text-muted-foreground mt-1">A commitment is a promise to yourself — add one above.</p>
        </div>
      )}

      {/* ── KANBAN VIEW ─────────────────────────────────── */}
      {viewMode === 'kanban' && tasks.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {/* Todo */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-secondary border border-border" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Todo</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{kanbanTodo.length}</span>
            </div>
            <div className="space-y-2">
              {kanbanTodo.map(t => <KanbanCard key={t.id} task={t} col="todo" />)}
              {kanbanTodo.length === 0 && <div className="forge-card py-4 text-center text-[10px] text-muted-foreground">Empty</div>}
            </div>
          </div>
          {/* Doing */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Doing</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{kanbanDoing.length}</span>
            </div>
            <div className="space-y-2">
              {kanbanDoing.map(t => <KanbanCard key={t.id} task={t} col="doing" />)}
              {kanbanDoing.length === 0 && <div className="forge-card py-4 text-center text-[10px] text-muted-foreground">Nothing in progress</div>}
            </div>
          </div>
          {/* Done */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">Done</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{done.length}</span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
              {done.slice(0, 8).map(t => (
                <div key={t.id} className="forge-card p-3 group">
                  <p className="text-xs text-muted-foreground line-through">{t.title}</p>
                  <button onClick={() => { tasksStore.delete(t.id); reload() }}
                    className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all mt-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {done.length === 0 && <div className="forge-card py-4 text-center text-[10px] text-muted-foreground">Nothing completed yet</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── LIST VIEW ───────────────────────────────────── */}
      {viewMode === 'list' && (
        <>
          {/* Overdue */}
          {overdue.length > 0 && (
            <div className="forge-card border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Overdue — {overdue.length}</span>
              </div>
              {overdue.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          )}

          {todayTasks.length > 0 && (
            <div className="forge-card">
              <span className="forge-label mb-3 block">Active ({todayTasks.length})</span>
              {todayTasks.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          )}

          {done.length > 0 && (
            <div className="forge-card">
              <span className="forge-label mb-3 block">Kept ({done.length})</span>
              <div className="space-y-0 max-h-40 overflow-y-auto scrollbar-hide">
                {done.slice(0, 10).map(t => <TaskCard key={t.id} task={t} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ----- Goals ----- */
function GoalsPanel() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'personal' as Goal['category'], targetDate: '', notes: '' })
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)
  const [newMilestone, setNewMilestone] = useState<Record<string, string>>({})

  const reload = () => setGoals(goalsStore.getAll())
  useEffect(reload, [])

  function addGoal() {
    if (!form.title.trim()) return
    goalsStore.save({
      id: generateId(), title: form.title, category: form.category,
      targetDate: form.targetDate, status: 'active', progress: 0, milestones: [], notes: form.notes
    })
    setForm({ title: '', category: 'personal', targetDate: '', notes: '' })
    setShowForm(false)
    reload()
  }

  function updateProgress(id: string, progress: number) {
    const goal = goals.find(g => g.id === id)
    if (!goal) return
    goalsStore.save({ ...goal, progress })
    reload()
  }

  function toggleMilestone(goalId: string, milestoneId: string) {
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return
    const updated = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    )
    const donePct = updated.length > 0 ? Math.round((updated.filter(m => m.completed).length / updated.length) * 100) : goal.progress
    goalsStore.save({ ...goal, milestones: updated, progress: Math.max(goal.progress, donePct) })
    reload()
  }

  function addMilestone(goalId: string) {
    const title = newMilestone[goalId]?.trim()
    if (!title) return
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return
    goalsStore.save({ ...goal, milestones: [...goal.milestones, { id: generateId(), title, completed: false }] })
    setNewMilestone(m => ({ ...m, [goalId]: '' }))
    reload()
  }

  const categoryColors: Record<Goal['category'], string> = {
    health: 'text-green-400', fitness: 'text-primary', finance: 'text-yellow-400',
    career: 'text-blue-400', personal: 'text-purple-400'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="forge-label flex items-center gap-2"><Target className="w-3.5 h-3.5" />Goals</span>
        <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)} className="gap-1 text-xs">
          <Plus className="w-3.5 h-3.5" />New Goal
        </Button>
      </div>

      {showForm && (
        <div className="forge-card space-y-3">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Goal title"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Goal['category'] }))}
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              {(['health', 'fitness', 'finance', 'career', 'personal'] as const).map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <input type="date" value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))}
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Why does this goal matter?" rows={2}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none" />
          <div className="flex gap-2">
            <Button onClick={addGoal} size="sm" className="bg-primary text-primary-foreground">Create Goal</Button>
            <Button onClick={() => setShowForm(false)} size="sm" variant="ghost">Cancel</Button>
          </div>
        </div>
      )}

      {goals.length === 0 && !showForm && (
        <div className="forge-card text-center py-8">
          <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No goals yet. Create your first one.</p>
        </div>
      )}

      <div className="space-y-3">
        {goals.filter(g => g.status === 'active').map(goal => (
          <div key={goal.id} className="forge-card">
            <div className="flex items-start gap-3 mb-3">
              <ChevronRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${categoryColors[goal.category]}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{goal.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-[10px] py-0 bg-secondary border-border ${categoryColors[goal.category]}`}>
                    {goal.category}
                  </Badge>
                  {goal.targetDate && (
                    <span className="text-xs text-muted-foreground">
                      Due {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">{goal.progress}%</span>
                <button onClick={() => { goalsStore.delete(goal.id); reload() }}
                  className="text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <input type="range" min={0} max={100} value={goal.progress}
                onChange={e => updateProgress(goal.id, parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: 'oklch(0.705 0.213 47.604)' }} />
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
              </div>
            </div>
            {goal.notes && <p className="text-xs text-muted-foreground mt-2 italic">&ldquo;{goal.notes}&rdquo;</p>}

            {/* Milestones */}
            <div className="mt-3 border-t border-border pt-3">
              <button onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <ChevronRight className={`w-3 h-3 transition-transform ${expandedGoal === goal.id ? 'rotate-90' : ''}`} />
                Milestones {goal.milestones.length > 0 && `(${goal.milestones.filter(m => m.completed).length}/${goal.milestones.length})`}
              </button>

              {expandedGoal === goal.id && (
                <div className="mt-2 space-y-1.5">
                  {goal.milestones.map(m => (
                    <button key={m.id} onClick={() => toggleMilestone(goal.id, m.id)}
                      className="w-full flex items-center gap-2 text-left group">
                      {m.completed
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        : <Circle className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />}
                      <span className={`text-xs ${m.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{m.title}</span>
                    </button>
                  ))}
                  <div className="flex gap-1.5 mt-2">
                    <input
                      value={newMilestone[goal.id] ?? ''}
                      onChange={e => setNewMilestone(m => ({ ...m, [goal.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addMilestone(goal.id)}
                      placeholder="Add milestone…"
                      className="flex-1 bg-secondary border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground"
                    />
                    <button onClick={() => addMilestone(goal.id)}
                      className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ----- Achievements ----- */
function AchievementsPanel() {
  const [unlocked, setUnlocked] = useState<Achievement[]>([])
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null)

  useEffect(() => {
    checkAndUnlockAchievements()
    const u = achievementsStore.getUnlocked()
    setUnlocked(u)
    if (u.length > 0) {
      const latest = u.sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())[0]
      const age = Date.now() - new Date(latest.unlockedAt!).getTime()
      if (age < 30000) setNewlyUnlocked(latest.id)
    }
  }, [])

  const unlockedIds = new Set(unlocked.map(a => a.id))
  const unlockedList = ALL_ACHIEVEMENTS.filter(a => unlockedIds.has(a.id))
  const lockedList = ALL_ACHIEVEMENTS.filter(a => !unlockedIds.has(a.id))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="forge-label flex items-center gap-2"><Trophy className="w-3.5 h-3.5 text-yellow-400" />Achievements</span>
        <span className="text-sm font-semibold text-primary">{unlocked.length}/{ALL_ACHIEVEMENTS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="forge-card py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Overall progress</span>
          <span className="text-xs font-semibold text-primary">{Math.round((unlocked.length / ALL_ACHIEVEMENTS.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-1000"
            style={{ width: `${(unlocked.length / ALL_ACHIEVEMENTS.length) * 100}%` }} />
        </div>
      </div>

      {unlockedList.length > 0 && (
        <div>
          <p className="forge-label mb-3">Unlocked ({unlockedList.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {unlockedList.map(a => (
              <div key={a.id}
                className={`forge-card text-center py-4 border-yellow-500/20 bg-yellow-500/5 ${newlyUnlocked === a.id ? 'animate-unlock' : ''}`}>
                <div className="text-3xl mb-2">{a.emoji}</div>
                <div className="text-xs font-semibold text-yellow-400">{a.title}</div>
                <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{a.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lockedList.length > 0 && (
        <div>
          <p className="forge-label mb-3">Locked ({lockedList.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {lockedList.map(a => (
              <div key={a.id} className="forge-card text-center py-4 opacity-40 relative">
                <div className="text-3xl mb-2 grayscale">{a.emoji}</div>
                <div className="text-xs font-semibold">{a.title}</div>
                <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{a.description}</div>
                <Lock className="w-3 h-3 text-muted-foreground absolute top-2 right-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {unlocked.length === 0 && (
        <div className="forge-card text-center py-10">
          <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">No achievements yet</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">Log your vitals, complete habits, hit your goals. Achievements unlock automatically.</p>
        </div>
      )}
    </div>
  )
}

/* ----- Pomodoro Focus Timer ----- */
function FocusTimer() {
  const WORK_SEC = 25 * 60
  const BREAK_SEC = 5 * 60
  const [phase, setPhase] = useState<'idle' | 'work' | 'break'>('idle')
  const [secondsLeft, setSecondsLeft] = useState(WORK_SEC)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [taskLabel, setTaskLabel] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            if (phase === 'work') {
              setSessions(n => n + 1)
              try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA==').play().catch(() => {}) } catch {}
              setPhase('break')
              setSecondsLeft(BREAK_SEC)
            } else {
              setPhase('work')
              setSecondsLeft(WORK_SEC)
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, phase])

  function start() {
    if (phase === 'idle') setPhase('work')
    setRunning(true)
  }

  function reset() {
    setRunning(false)
    setPhase('idle')
    setSecondsLeft(WORK_SEC)
  }

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const secs = (secondsLeft % 60).toString().padStart(2, '0')
  const pct = phase === 'work' ? (1 - secondsLeft / WORK_SEC) : (1 - secondsLeft / BREAK_SEC)
  const r = 48
  const circ = 2 * Math.PI * r
  const isWork = phase === 'work' || phase === 'idle'
  const color = isWork ? 'oklch(0.705 0.213 47.604)' : '#22c55e'

  return (
    <div className="forge-card space-y-4">
      <div className="flex items-center justify-between">
        <span className="forge-label flex items-center gap-2"><Timer className="w-3.5 h-3.5" />Focus Timer</span>
        {sessions > 0 && (
          <span className="text-xs text-primary font-medium">{sessions} session{sessions !== 1 ? 's' : ''} today</span>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Ring */}
        <div className="relative flex items-center justify-center w-28 h-28 flex-shrink-0">
          <svg width="112" height="112" className="-rotate-90">
            <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
            <circle cx="56" cy="56" r={r} fill="none" stroke={color} strokeWidth="7"
              strokeDasharray={circ} strokeDashoffset={circ - pct * circ} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }} />
          </svg>
          <div className="absolute text-center">
            <div className="text-2xl font-bold tabular-nums font-mono">{mins}:{secs}</div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">
              {phase === 'idle' ? 'Ready' : phase === 'work' ? 'Focus' : 'Break'}
            </div>
          </div>
        </div>

        {/* Controls + task */}
        <div className="flex-1 space-y-3">
          {phase === 'idle' && (
            <input value={taskLabel} onChange={e => setTaskLabel(e.target.value)}
              placeholder="What are you working on?"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
          )}
          {taskLabel && phase !== 'idle' && (
            <p className="text-sm text-muted-foreground truncate">
              {phase === 'break' ? <><Coffee className="w-3.5 h-3.5 inline mr-1" />Break time</> : <><Flag className="w-3.5 h-3.5 inline mr-1 text-primary" />{taskLabel}</>}
            </p>
          )}
          <div className="flex gap-2">
            {running ? (
              <Button onClick={() => setRunning(false)} size="sm" variant="outline" className="gap-1.5">
                <Pause className="w-3.5 h-3.5" />Pause
              </Button>
            ) : (
              <Button onClick={start} size="sm" className="bg-primary text-primary-foreground gap-1.5">
                <Play className="w-3.5 h-3.5" />{phase === 'idle' ? 'Start' : 'Resume'}
              </Button>
            )}
            {phase !== 'idle' && (
              <Button onClick={reset} size="sm" variant="outline" className="gap-1.5 text-muted-foreground">
                <RotateCcw className="w-3.5 h-3.5" />Reset
              </Button>
            )}
          </div>
          <div className="flex gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: 'oklch(0.705 0.213 47.604)' }}/>25 min focus</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />5 min break</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----- Weekly Intentions ----- */
function getWeekKey() {
  const d = new Date()
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${week}`
}

function WeeklyIntentions() {
  const key = `forge_intentions_${getWeekKey()}`
  const [top, setTop] = useState('')
  const [avoid, setAvoid] = useState('')
  const [metric, setMetric] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const { top, avoid, metric } = JSON.parse(stored)
        setTop(top ?? ''); setAvoid(avoid ?? ''); setMetric(metric ?? '')
      }
    } catch {}
  }, [key])

  function save() {
    localStorage.setItem(key, JSON.stringify({ top, avoid, metric }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="forge-card space-y-4">
      <div className="flex items-center justify-between">
        <span className="forge-label flex items-center gap-2"><Flag className="w-3.5 h-3.5" />This Week&apos;s Intentions</span>
        <button onClick={save} className={`text-xs font-medium transition-colors ${saved ? 'text-green-400' : 'text-primary hover:text-primary/80'}`}>
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="forge-label mb-1.5 block">Top priority this week</label>
          <input value={top} onChange={e => setTop(e.target.value)}
            placeholder="What single thing matters most this week?"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
        <div>
          <label className="forge-label mb-1.5 block">What I&apos;m avoiding</label>
          <input value={avoid} onChange={e => setAvoid(e.target.value)}
            placeholder="A distraction, habit, or pattern to skip this week"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
        <div>
          <label className="forge-label mb-1.5 block">One metric I&apos;m watching</label>
          <input value={metric} onChange={e => setMetric(e.target.value)}
            placeholder="e.g. HRV above 60ms, savings rate 20%, 5 habits/day"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

export default function MindPage() {
  const [tab, setTab] = useState<'habits' | 'tasks' | 'goals' | 'achievements' | 'focus'>('habits')
  const tabs = [
    { id: 'habits',       label: 'Habits',       icon: Zap },
    { id: 'tasks',        label: 'Commitments',  icon: ListTodo },
    { id: 'goals',        label: 'Goals',        icon: Target },
    { id: 'focus',        label: 'Focus',        icon: Timer },
    { id: 'achievements', label: 'Wins',         icon: Trophy },
  ] as const

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <p className="forge-label mb-1">Mental OS</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gradient">Mind</h1>
      </div>

      <div className="forge-tabs w-full md:w-fit mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`forge-tab ${tab === id ? 'forge-tab-active' : ''}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {tab === 'habits'       && <HabitsPanel />}
      {tab === 'tasks'        && <TasksPanel />}
      {tab === 'goals'        && <GoalsPanel />}
      {tab === 'focus'        && (
        <div className="space-y-4">
          <FocusTimer />
          <WeeklyIntentions />
        </div>
      )}
      {tab === 'achievements' && <AchievementsPanel />}
    </div>
  )
}
