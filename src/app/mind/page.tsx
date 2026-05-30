'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Plus, Trash2, Target, Zap, ListTodo, ChevronRight, Trophy, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { goalsStore, habitsStore, tasksStore, generateId, today, getHabitStreak, ALL_ACHIEVEMENTS, achievementsStore, checkAndUnlockAchievements, getAlignmentScore } from '@/lib/store'
import type { Goal, Habit, Task, Achievement } from '@/lib/types'
import { format, subDays } from 'date-fns'

/* ----- Habits ----- */
function HabitsPanel() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('Health')
  const todayStr = today()

  const reload = () => setHabits(habitsStore.getAll())
  useEffect(reload, [])

  function addHabit() {
    if (!newName.trim()) return
    habitsStore.save({ id: generateId(), name: newName.trim(), category: newCat, completions: [] })
    setNewName('')
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
        <span className="forge-label flex items-center gap-2"><Zap className="w-3.5 h-3.5" />Add Habit</span>
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
      </div>

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

  const allActive = tasks.filter(t => !t.completed)
  // Overdue = created before today, still open
  const overdue = allActive.filter(t => t.createdAt && t.createdAt < todayStr)
  // Today's = created today or no createdAt
  const todayTasks = allActive.filter(t => !t.createdAt || t.createdAt >= todayStr)
  const done = tasks.filter(t => t.completed)

  const priorityBg = { high: 'bg-red-500/10 border-red-500/20 text-red-400', medium: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', low: 'bg-secondary text-muted-foreground' }

  return (
    <div className="space-y-4">
      {/* Alignment score */}
      {tasks.length > 0 && (
        <div className="forge-card py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">Word Kept Rate</span>
            <span className={`text-sm font-bold tabular-nums ${alignment.keptRate >= 80 ? 'text-green-400' : alignment.keptRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              {alignment.keptRate}%
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${alignment.keptRate}%`,
                backgroundColor: alignment.keptRate >= 80 ? '#22c55e' : alignment.keptRate >= 60 ? '#f59e0b' : '#ef4444',
              }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {done.length} kept · {overdue.length} overdue · {todayTasks.length} active today
          </p>
        </div>
      )}

      {/* Overdue commitments — broken promises */}
      {overdue.length > 0 && (
        <div className="forge-card border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Overdue — {overdue.length} broken commitment{overdue.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-2">
            {overdue.map(task => (
              <div key={task.id} className="flex items-start gap-3 group">
                <button onClick={() => { tasksStore.toggle(task.id); reload() }} className="mt-0.5 flex-shrink-0">
                  <Circle className="w-4 h-4 text-red-400 group-hover:text-green-400 transition-colors" />
                </button>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-red-300">{task.title}</span>
                  {task.createdAt && (
                    <div className="text-[10px] text-red-500/70 mt-0.5">
                      Committed {format(new Date(task.createdAt), 'MMM d')} — {Math.floor((Date.now() - new Date(task.createdAt).getTime()) / 86400000)}d ago
                    </div>
                  )}
                </div>
                <button onClick={() => { tasksStore.delete(task.id); reload() }}
                  className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {todayTasks.length > 0 && (
        <div className="forge-card">
          <span className="forge-label mb-3 block">Today&apos;s commitments ({todayTasks.length})</span>
          <div className="space-y-2">
            {todayTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 group">
                <button onClick={() => { tasksStore.toggle(task.id); reload() }} className="mt-0.5 flex-shrink-0">
                  <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">{task.title}</span>
                    <Badge className={`text-[10px] py-0 ${priorityBg[task.priority]}`}>{task.priority}</Badge>
                  </div>
                  {task.dueDate && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Due {format(new Date(task.dueDate), 'MMM d')}
                    </div>
                  )}
                </div>
                <button onClick={() => { tasksStore.delete(task.id); reload() }}
                  className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {allActive.length === 0 && done.length === 0 && (
        <div className="forge-card text-center py-8">
          <ListTodo className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No commitments yet.</p>
          <p className="text-xs text-muted-foreground mt-1">A commitment is a promise to yourself — add one above.</p>
        </div>
      )}

      {done.length > 0 && (
        <div className="forge-card">
          <span className="forge-label mb-3 block">Kept ({done.length})</span>
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
            {done.slice(0, 10).map(task => (
              <div key={task.id} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-muted-foreground line-through flex-1">{task.title}</span>
                <button onClick={() => { tasksStore.delete(task.id); reload() }}
                  className="text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ----- Goals ----- */
function GoalsPanel() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'personal' as Goal['category'], targetDate: '', notes: '' })

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

export default function MindPage() {
  const [tab, setTab] = useState<'habits' | 'tasks' | 'goals' | 'achievements'>('habits')
  const tabs = [
    { id: 'habits',       label: 'Habits',       icon: Zap },
    { id: 'tasks',        label: 'Commitments',  icon: ListTodo },
    { id: 'goals',        label: 'Goals',        icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
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
      {tab === 'achievements' && <AchievementsPanel />}
    </div>
  )
}
