'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Circle, ArrowUp, ArrowDown, Minus, Lightbulb, Plus, RefreshCw, Zap, Heart, Dumbbell, TrendingUp, Brain, Target, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  vitalsStore, habitsStore, tasksStore, financeStore, workoutsStore, journalStore,
  calculateLifeScores, generateInsights, getDailyCall, today, getHabitStreak,
  checkAndUnlockAchievements
} from '@/lib/store'
import type { VitalEntry, LifeScores, InsightCard, Task, Habit } from '@/lib/types'

/* ── Life Score Ring ───────────────────────────────────── */
function LifeScoreRing({ score, call }: { score: number; call: 'GREEN' | 'YELLOW' | 'RED' }) {
  const r = 72
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  const glowColor = score >= 75 ? 'rgba(34,197,94,0.15)' : score >= 50 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }} />
      <svg width="192" height="192" className="-rotate-90">
        <circle cx="96" cy="96" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="96" cy="96" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1), stroke 0.5s' }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-5xl font-bold tabular-nums" style={{ color }}>{score}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Life Score</div>
        <div className={`text-[10px] font-bold mt-1 ${call === 'GREEN' ? 'text-green-400' : call === 'YELLOW' ? 'text-yellow-400' : 'text-red-400'}`}>
          {call}
        </div>
      </div>
    </div>
  )
}

/* ── Domain score pill ─────────────────────────────────── */
function DomainPill({ label, score, trend, icon: Icon, color, noData, href }: {
  label: string; score: number; trend: 'up' | 'down' | 'flat'
  icon: React.ElementType; color: string; noData?: boolean; href: string
}) {
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus
  const displayColor = noData ? '#52525b' : color
  return (
    <Link href={href} className="forge-card flex flex-col gap-2 py-3 hover:border-primary/30 transition-all relative overflow-hidden group">
      {/* Colored top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-opacity duration-300"
        style={{ backgroundColor: displayColor, opacity: noData ? 0.2 : 0.7 }} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" style={{ color: displayColor }} />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        {noData
          ? <span className="text-[9px] text-primary opacity-60 uppercase tracking-wider font-medium">Start →</span>
          : <TrendIcon className={`w-3 h-3 ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground'}`} />
        }
      </div>
      <div className="font-bold text-2xl tabular-nums" style={{ color: displayColor }}>{noData ? '—' : score}</div>
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${noData ? 0 : score}%`, backgroundColor: displayColor, boxShadow: noData ? 'none' : `0 0 6px ${displayColor}66` }} />
      </div>
    </Link>
  )
}

/* ── Insight flash card ────────────────────────────────── */
const insightColors = {
  alert:   { bg: 'bg-red-500/10 border-red-500/20',    text: 'text-red-400',    dot: 'bg-red-400' },
  warning: { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  win:     { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
  info:    { bg: 'bg-blue-500/10 border-blue-500/20',   text: 'text-blue-400',  dot: 'bg-blue-400' },
}

function InsightFlash({ card }: { card: InsightCard }) {
  const style = insightColors[card.severity]
  return (
    <div className={`p-3 rounded-xl border ${style.bg} flex gap-3`}>
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
      <div className="min-w-0">
        <p className={`text-xs font-semibold ${style.text}`}>{card.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{card.body}</p>
      </div>
    </div>
  )
}

/* ── Daily Focus Actions ───────────────────────────────── */
type FocusAction = { label: string; reason: string; href: string; color: string }

function getDailyFocus(scores: LifeScores, vital: VitalEntry | null, habitPct: number): FocusAction[] {
  const actions: Array<FocusAction & { priority: number }> = []

  if (!vital || vital.date !== today()) {
    actions.push({ label: 'Log today\'s vitals', reason: 'Life Score requires daily data', href: '/vitals', color: 'text-green-400', priority: 10 })
  }
  if (vital && vital.hrv !== undefined && vital.hrv > 0 && vital.hrv < 50) {
    actions.push({ label: 'Prioritise recovery today', reason: `HRV at ${Math.round(vital.hrv)}ms — below baseline`, href: '/vitals', color: 'text-red-400', priority: 9 })
  }
  if (vital && vital.sleepHours < 6.5) {
    actions.push({ label: 'Target sleep before 22:30', reason: `Only ${vital.sleepHours}h last night — sleep debt building`, href: '/vitals', color: 'text-yellow-400', priority: 8 })
  }
  if (scores.wealth.score === 0) {
    actions.push({ label: 'Log a financial transaction', reason: 'Wealth score is 0 — needs data to calculate', href: '/wealth', color: 'text-yellow-400', priority: 7 })
  }
  if (scores.body.score < 25) {
    actions.push({ label: 'Log a workout', reason: `Body score at ${scores.body.score} — no workouts this week`, href: '/body', color: 'text-orange-400', priority: 6 })
  }
  if (habitPct < 50 && habitPct > 0) {
    actions.push({ label: 'Complete your habits', reason: `${habitPct}% done today — finish strong`, href: '/mind', color: 'text-purple-400', priority: 5 })
  }
  if (scores.mind.score < 30) {
    actions.push({ label: 'Write a journal entry', reason: 'Mind score is low — reflection helps', href: '/journal', color: 'text-blue-400', priority: 4 })
  }
  if (actions.length < 3) {
    actions.push({ label: 'Ask Oracle what to focus on', reason: 'Get a personalised recommendation', href: '/oracle', color: 'text-primary', priority: 3 })
  }

  return actions.sort((a, b) => b.priority - a.priority).slice(0, 3).map(({ priority: _p, ...rest }) => rest)
}

/* ── Page ──────────────────────────────────────────────── */
export default function CommandCenter() {
  const [scores, setScores] = useState<LifeScores>({ overall: 0, health: { score: 0, trend: 'flat', label: 'Health' }, body: { score: 0, trend: 'flat', label: 'Body' }, wealth: { score: 0, trend: 'flat', label: 'Wealth' }, mind: { score: 0, trend: 'flat', label: 'Mind' } })
  const [insights, setInsights] = useState<InsightCard[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [vital, setVital] = useState<VitalEntry | null>(null)
  const [briefText, setBriefText] = useState('')
  const [loadingBrief, setLoadingBrief] = useState(false)
  const todayStr = today()

  const reload = useCallback(() => {
    setScores(calculateLifeScores())
    setInsights(generateInsights().slice(0, 3))
    setTasks(tasksStore.getAll().filter(t => !t.completed).slice(0, 4))
    setHabits(habitsStore.getAll())
    setVital(vitalsStore.getLast())
    checkAndUnlockAchievements()
  }, [])

  useEffect(() => { reload() }, [reload])

  const call = getDailyCall(scores.health.score)

  async function generateBrief() {
    setLoadingBrief(true)
    setBriefText('')
    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'brief', message: 'Morning brief — 3 sentences max. Be specific to my numbers. What matters most today?' }),
      })
      const data = await res.json()
      setBriefText(data.content ?? '')
    } catch { setBriefText('') }
    finally { setLoadingBrief(false) }
  }

  const todayHabits = useMemo(() => habits.filter(h => h.completions.includes(todayStr)), [habits, todayStr])
  const habitPct = useMemo(() => habits.length ? Math.round((todayHabits.length / habits.length) * 100) : 0, [habits, todayHabits])
  const alertCount = useMemo(() => insights.filter(i => i.severity === 'alert' || i.severity === 'warning').length, [insights])

  // No-data detection for domain pills
  const bodyHasData = useMemo(() => workoutsStore.getAll().length > 0, [])
  const wealthHasData = useMemo(() => financeStore.getAll().length > 0, [])
  const mindHasData = useMemo(() => habitsStore.getAll().length > 0 || journalStore.getAll().length > 0, [])

  // Login streak: count consecutive days with any entry (vitals, workout, or habit)
  const loginStreak = useMemo(() => {
    const allVitalDates = new Set(vitalsStore.getAll().map(v => v.date))
    let streak = 0
    const d = new Date()
    while (true) {
      const dateStr = d.toISOString().split('T')[0]
      if (!allVitalDates.has(dateStr)) break
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5">
            {format(new Date(), "EEEE, MMMM d · yyyy")}
          </p>
          <h1 className="text-3xl font-bold text-gradient">Command Center</h1>
          {loginStreak > 1 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-sm font-medium text-primary">{loginStreak} day streak</span>
              <span className="text-sm">🔥</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {alertCount > 0 && (
            <Link href="/insights" className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              {alertCount} alert{alertCount > 1 ? 's' : ''}
            </Link>
          )}
        </div>
      </div>

      {/* Hero: Life Score + AI Brief */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="forge-card flex flex-col items-center justify-center gap-4 py-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${scores.overall >= 75 ? 'rgba(34,197,94,0.04)' : scores.overall >= 50 ? 'rgba(245,158,11,0.04)' : 'rgba(239,68,68,0.04)'} 0%, transparent 100%)`
          }} />
          <LifeScoreRing score={scores.overall} call={call} />
          {!vital && (
            <Link href="/vitals" className="text-xs text-primary hover:underline">
              → Log vitals to activate your score
            </Link>
          )}
          <button
            onClick={() => {
              const text = `My FORGE Life Score this week: ${scores.overall}/100\n\n❤️ Health: ${scores.health.score}  💪 Body: ${scores.body.score}\n💰 Wealth: ${scores.wealth.score}  🧠 Mind: ${scores.mind.score}\n\nBuilding my life OS → forge-life.app`
              if (navigator.share) {
                navigator.share({ text }).catch(() => {})
              } else {
                navigator.clipboard.writeText(text)
                  .then(() => alert('Score copied to clipboard!'))
                  .catch(() => {})
              }
            }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share my score
          </button>
        </div>

        <div className="forge-card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="forge-label">AI Morning Brief</span>
            <Button variant="ghost" size="sm" onClick={generateBrief} disabled={loadingBrief} className="h-7 gap-1.5 text-xs">
              <RefreshCw className={`w-3 h-3 ${loadingBrief ? 'animate-spin' : ''}`} />
              {loadingBrief ? 'Thinking…' : 'Generate'}
            </Button>
          </div>

          {briefText ? (
            <p className="text-sm text-foreground leading-relaxed flex-1">{briefText}</p>
          ) : (
            <div className="flex-1 space-y-2">
              {insights.slice(0, 2).map(card => (
                <InsightFlash key={card.id} card={card} />
              ))}
              {insights.length === 0 && (
                <p className="text-sm text-muted-foreground">Log your vitals and habits to see personalised insights here.</p>
              )}
            </div>
          )}

          <Link href="/insights" className="flex items-center gap-2 text-xs text-primary hover:underline pt-1 border-t border-border">
            <Lightbulb className="w-3.5 h-3.5" />
            View all insights →
          </Link>
        </div>
      </div>

      {/* Domain scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <DomainPill label="Health"  score={scores.health.score}  trend={scores.health.trend}  icon={Heart}      color="#22c55e" noData={!vital}          href="/vitals" />
        <DomainPill label="Body"    score={scores.body.score}    trend={scores.body.trend}    icon={Dumbbell}   color="#f97316" noData={!bodyHasData}    href="/body" />
        <DomainPill label="Wealth"  score={scores.wealth.score}  trend={scores.wealth.trend}  icon={TrendingUp} color="#f59e0b" noData={!wealthHasData}  href="/wealth" />
        <DomainPill label="Mind"    score={scores.mind.score}    trend={scores.mind.trend}    icon={Brain}      color="#a78bfa" noData={!mindHasData}    href="/mind" />
      </div>

      {/* Daily Focus */}
      <div className="forge-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-primary" />
          <span className="forge-label">Today&apos;s Focus</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {getDailyFocus(scores, vital, habitPct).map((action, i) => (
            <Link key={i} href={action.href}
              className="flex items-start gap-3 p-3 rounded-xl bg-secondary hover:bg-card border border-transparent hover:border-border transition-all group">
              <span className={`text-lg font-bold tabular-nums ${action.color} opacity-60 group-hover:opacity-100 transition-opacity`}>{i + 1}</span>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${action.color}`}>{action.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{action.reason}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tasks + Habits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="forge-card">
          <div className="flex items-center justify-between mb-4">
            <span className="forge-label">Today&apos;s Tasks</span>
            <Link href="/mind" className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="w-3 h-3" />Add</Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks — <Link href="/mind" className="text-primary hover:underline">add some</Link></p>
          ) : (
            <ul className="space-y-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => { tasksStore.toggle(task.id); reload() }}>
                  <Circle className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                  <span className="text-sm flex-1">{task.title}</span>
                  {task.priority === 'high' && (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] py-0">high</Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="forge-card">
          <div className="flex items-center justify-between mb-4">
            <span className="forge-label flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Habits
              <span className={`font-semibold ${habitPct >= 80 ? 'text-green-400' : habitPct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{habitPct}%</span>
            </span>
            <Link href="/mind" className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="w-3 h-3" />Add</Link>
          </div>
          {habits.length === 0 ? (
            <p className="text-sm text-muted-foreground">No habits — <Link href="/mind" className="text-primary hover:underline">build your stack</Link></p>
          ) : (
            <ul className="space-y-2">
              {habits.slice(0, 6).map(habit => {
                const done = habit.completions.includes(todayStr)
                const streak = getHabitStreak(habit)
                return (
                  <li key={habit.id} className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => { habitsStore.toggle(habit.id, todayStr); reload() }}>
                    {done
                      ? <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      : <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                    }
                    <span className={`text-sm flex-1 ${done ? 'text-muted-foreground line-through' : ''}`}>{habit.name}</span>
                    {streak > 0 && <span className="text-[10px] text-primary font-medium">{streak}🔥</span>}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
