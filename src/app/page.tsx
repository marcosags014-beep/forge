'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Circle, ArrowUp, ArrowDown, Minus, Plus, RefreshCw, Zap, Heart, Dumbbell, TrendingUp, Brain, Share2, Sparkles, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  vitalsStore, habitsStore, tasksStore, financeStore, workoutsStore, journalStore,
  calculateLifeScores, generateInsights, getDailyCall, today, getHabitStreak,
  checkAndUnlockAchievements, getProjections, profileStore, getAllDataForAI, isProUser,
  getAlignmentScore,
} from '@/lib/store'
import type { VitalEntry, LifeScores, Task, Habit, Projection } from '@/lib/types'
import DailyQuoteModal from '@/components/DailyQuoteModal'

/* ── Life Score Ring ───────────────────────────────────── */
function LifeScoreRing({ score, call }: { score: number; call: 'GREEN' | 'YELLOW' | 'RED' }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  const glowHex = score >= 75 ? '34,197,94' : score >= 50 ? '245,158,11' : '239,68,68'

  return (
    <div className="relative flex items-center justify-center w-32 h-32 flex-shrink-0">
      <svg width="128" height="128" className="-rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px rgba(${glowHex},0.5))`, transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1), stroke 0.5s' }} />
      </svg>
      <div className="absolute text-center select-none">
        <div className="text-3xl font-bold tabular-nums leading-none" style={{ color }}>{score}</div>
        <div className={`text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-full inline-block ${
          call === 'GREEN' ? 'bg-green-500/15 text-green-400' :
          call === 'YELLOW' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'
        }`}>{call}</div>
      </div>
    </div>
  )
}

/* ── Domain score row ──────────────────────────────────── */
function DomainRow({ label, score, trend, icon: Icon, color, noData, href }: {
  label: string; score: number; trend: 'up' | 'down' | 'flat'
  icon: React.ElementType; color: string; noData?: boolean; href: string
}) {
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus
  const displayColor = noData ? '#52525b' : color
  return (
    <Link href={href} className="flex items-center gap-3 py-2 group hover:opacity-80 transition-opacity">
      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: displayColor }} />
      <span className="text-xs text-muted-foreground w-12 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${noData ? 0 : score}%`, backgroundColor: displayColor, boxShadow: noData ? 'none' : `0 0 4px ${displayColor}55` }} />
      </div>
      <span className="text-xs font-bold tabular-nums w-7 text-right" style={{ color: displayColor }}>{noData ? '—' : score}</span>
      {!noData && <TrendIcon className={`w-2.5 h-2.5 flex-shrink-0 ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground'}`} />}
      {noData && <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />}
    </Link>
  )
}

/* ── Projection pill ───────────────────────────────────── */
function ProjectionCard({ p }: { p: Projection }) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
      p.type === 'positive' ? 'bg-green-500/6 border-green-500/15' :
      p.type === 'warning'  ? 'bg-yellow-500/6 border-yellow-500/15' :
                              'bg-secondary/40 border-border'
    }`}>
      <span className="text-base flex-shrink-0 leading-snug">{p.icon}</span>
      <span className={`text-xs leading-relaxed ${
        p.type === 'positive' ? 'text-green-300' :
        p.type === 'warning'  ? 'text-yellow-300' : 'text-muted-foreground'
      }`}>{p.text}</span>
    </div>
  )
}

/* ── Today's focus action ──────────────────────────────── */
type FocusAction = { label: string; reason: string; href: string; color: string }

function getDailyFocus(scores: LifeScores, vital: VitalEntry | null, habitPct: number): FocusAction[] {
  const actions: Array<FocusAction & { priority: number }> = []

  if (!vital || vital.date !== today()) {
    actions.push({ label: 'Log today\'s vitals', reason: 'Your score needs today\'s data to be accurate', href: '/vitals', color: 'text-green-400', priority: 10 })
  }
  if (vital && vital.hrv !== undefined && vital.hrv > 0 && vital.hrv < 50) {
    actions.push({ label: 'Prioritise recovery today', reason: `HRV at ${Math.round(vital.hrv)}ms — train light, sleep early`, href: '/vitals', color: 'text-red-400', priority: 9 })
  }
  if (vital && vital.sleepHours < 6.5) {
    actions.push({ label: 'Fix tonight\'s sleep', reason: `Only ${vital.sleepHours}h last night — debt is compounding`, href: '/vitals', color: 'text-yellow-400', priority: 8 })
  }
  if (scores.wealth.score === 0 || financeStore.getAll().length === 0) {
    actions.push({ label: 'Log a transaction', reason: 'Wealth score needs data — 30 seconds to start', href: '/wealth', color: 'text-yellow-400', priority: 7 })
  }
  if (scores.body.score < 25) {
    actions.push({ label: 'Get a workout done', reason: `Body score at ${scores.body.score} — movement changes everything`, href: '/body', color: 'text-orange-400', priority: 6 })
  }
  if (habitPct < 50 && habitPct > 0) {
    actions.push({ label: 'Complete your commitments', reason: `${habitPct}% done today — finish what you promised yourself`, href: '/mind', color: 'text-purple-400', priority: 5 })
  }
  if (scores.mind.score < 30) {
    actions.push({ label: 'Write a journal entry', reason: 'Reflection is the fastest way to raise your Mind score', href: '/journal', color: 'text-blue-400', priority: 4 })
  }
  if (actions.length < 3) {
    actions.push({ label: 'Ask Oracle what to focus on', reason: 'Get a personalised recommendation based on your data', href: '/oracle', color: 'text-primary', priority: 3 })
  }

  return actions.sort((a, b) => b.priority - a.priority).slice(0, 3).map(({ priority: _p, ...rest }) => rest)
}

/* ── Page ──────────────────────────────────────────────── */
export default function CommandCenter() {
  const [scores, setScores] = useState<LifeScores>({
    overall: 0,
    health: { score: 0, trend: 'flat', label: 'Health' },
    body:   { score: 0, trend: 'flat', label: 'Body' },
    wealth: { score: 0, trend: 'flat', label: 'Wealth' },
    mind:   { score: 0, trend: 'flat', label: 'Mind' },
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [vital, setVital] = useState<VitalEntry | null>(null)
  const [projections, setProjections] = useState<Projection[]>([])
  const [oracleBrief, setOracleBrief] = useState<string | null>(null)
  const [loadingBrief, setLoadingBrief] = useState(false)
  const [profile, setProfile] = useState<{ name?: string; identity?: string; joinedAt?: string } | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [showProNudge, setShowProNudge] = useState(false)
  const [alignment, setAlignment] = useState<{ score: number; habitRate: number; keptRate: number; overdueCount: number }>({ score: 0, habitRate: 0, keptRate: 100, overdueCount: 0 })
  const todayStr = today()
  const briefFetchedRef = useRef(false)

  const reload = useCallback(() => {
    setScores(calculateLifeScores())
    setTasks(tasksStore.getAll().filter(t => !t.completed).slice(0, 5))
    setHabits(habitsStore.getAll())
    setVital(vitalsStore.getLast())
    setProjections(getProjections())
    const p = profileStore.get()
    setProfile(p)
    setAlignment(getAlignmentScore())
    checkAndUnlockAchievements()
    const pro = isProUser()
    setIsPro(pro)
    if (!pro && p?.joinedAt) {
      const daysSinceJoin = Math.floor((Date.now() - new Date(p.joinedAt).getTime()) / 86400000)
      if (daysSinceJoin >= 7) {
        try {
          const dismissed = localStorage.getItem('forge_nudge_dismiss')
          const dismissedDaysAgo = dismissed ? Math.floor((Date.now() - new Date(dismissed).getTime()) / 86400000) : 999
          setShowProNudge(dismissedDaysAgo >= 3)
        } catch { setShowProNudge(true) }
      }
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  // Auto-fetch Oracle brief once per day
  useEffect(() => {
    if (briefFetchedRef.current) return
    briefFetchedRef.current = true
    try {
      const cached = localStorage.getItem('forge_oracle_brief')
      if (cached) {
        const { date, content } = JSON.parse(cached)
        if (date === todayStr) { setOracleBrief(content); return }
      }
    } catch {}
    fetchOracleBrief()
  }, [todayStr])

  async function fetchOracleBrief() {
    setLoadingBrief(true)
    try {
      const userData = getAllDataForAI()
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'brief',
          message: 'You are reviewing this person\'s data right now. Give ONE specific, direct observation and ONE concrete action they should take today. 2 sentences maximum. No greetings. Start immediately with the insight.',
          userData,
        }),
      })
      const data = await res.json()
      if (data.content && !data.content.includes('unavailable')) {
        localStorage.setItem('forge_oracle_brief', JSON.stringify({ date: todayStr, content: data.content }))
        setOracleBrief(data.content)
      }
    } catch {}
    finally { setLoadingBrief(false) }
  }

  const call = getDailyCall(scores.health.score)
  const todayHabits = useMemo(() => habits.filter(h => h.completions.includes(todayStr)), [habits, todayStr])
  const habitPct = useMemo(() => habits.length ? Math.round((todayHabits.length / habits.length) * 100) : 0, [habits, todayHabits])

  const bodyHasData   = useMemo(() => workoutsStore.getAll().length > 0, [])
  const wealthHasData = useMemo(() => financeStore.getAll().length > 0, [])
  const mindHasData   = useMemo(() => habitsStore.getAll().length > 0 || journalStore.getAll().length > 0, [])

  const loginStreak = useMemo(() => {
    const vitalDates = new Set(vitalsStore.getAll().map(v => v.date))
    let streak = 0
    const d = new Date()
    while (true) {
      if (!vitalDates.has(d.toISOString().split('T')[0])) break
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  }, [])

  const focusActions = getDailyFocus(scores, vital, habitPct)

  return (
    <>
    <DailyQuoteModal />
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
          <h1 className="text-2xl font-bold text-gradient leading-tight">
            {profile?.name ? `Good day, ${profile.name.split(' ')[0]}` : 'Command Center'}
          </h1>
          {loginStreak > 1 && (
            <p className="text-xs text-primary font-medium mt-0.5">{loginStreak} day streak 🔥</p>
          )}
        </div>
        <button
          onClick={() => {
            const text = `FORGE Life Score: ${scores.overall}/100\n❤️ ${scores.health.score}  💪 ${scores.body.score}  💰 ${scores.wealth.score}  🧠 ${scores.mind.score}`
            if (navigator.share) navigator.share({ text }).catch(() => {})
            else navigator.clipboard.writeText(text).catch(() => {})
          }}
          className="p-2 rounded-xl text-muted-foreground hover:text-primary transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Identity reminder */}
      {profile?.identity && (
        <div className="px-4 py-3 rounded-xl border border-primary/15 bg-primary/5 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          <p className="text-[10px] text-primary uppercase tracking-widest font-semibold mb-0.5">Your vision</p>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{profile.identity}</p>
        </div>
      )}

      {/* Day 7+ Pro nudge */}
      {showProNudge && !isPro && (
        <div className="relative px-4 py-3.5 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/8 to-primary/4 overflow-hidden">
          <div className="absolute right-3 top-3">
            <button onClick={() => {
              try { localStorage.setItem('forge_nudge_dismiss', new Date().toISOString()) } catch {}
              setShowProNudge(false)
            }} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
          </div>
          <p className="text-[10px] text-primary uppercase tracking-widest font-semibold mb-1">You&apos;ve been building for 7+ days</p>
          <p className="text-sm font-semibold mb-2 pr-6">Unlock the full accountability system</p>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Unlimited Oracle queries, AI Weekly Review, and cross-domain insights — everything you need to keep the momentum going.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-foreground bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
            <Sparkles className="w-3 h-3" />
            Start 7-Day Free Trial — €0 today
          </Link>
        </div>
      )}

      {/* Oracle proactive brief */}
      <div className="forge-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="forge-label">Oracle&apos;s take for today</span>
          </div>
          <button onClick={fetchOracleBrief} disabled={loadingBrief}
            className="text-muted-foreground hover:text-primary transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${loadingBrief ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {loadingBrief ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex gap-1">
              {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
            Analysing your data…
          </div>
        ) : oracleBrief ? (
          <p className="text-sm text-foreground leading-relaxed">{oracleBrief}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {process.env.NEXT_PUBLIC_HAS_ORACLE !== 'false'
              ? 'Set ANTHROPIC_API_KEY to activate Oracle intelligence.'
              : 'Oracle needs your data — log vitals today to get your first insight.'}
          </p>
        )}
        <Link href="/oracle" className="flex items-center gap-1 text-xs text-primary hover:underline mt-3 pt-3 border-t border-border">
          <Sparkles className="w-3 h-3" />Talk to Oracle →
        </Link>
      </div>

      {/* Today's Focus — HERO */}
      <div>
        <p className="forge-label mb-3">
          <Zap className="w-3.5 h-3.5 text-primary" />
          What to do now
        </p>
        <div className="grid grid-cols-1 gap-2.5">
          {focusActions.map((action, i) => (
            <Link key={i} href={action.href}
              className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/25 transition-all group relative overflow-hidden"
              style={{ boxShadow: '0 1px 3px oklch(0 0 0 / 40%), inset 0 1px 0 oklch(1 0 0 / 5%)' }}>
              <span className={`text-2xl font-black tabular-nums ${action.color} opacity-20 group-hover:opacity-60 transition-opacity leading-none flex-shrink-0 select-none`}>{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${action.color} leading-snug`}>{action.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{action.reason}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Life Score + Alignment + Domain scores */}
      <div className="forge-card">
        <div className="flex gap-5 items-start">
          <div className="flex flex-col items-center gap-1.5">
            <LifeScoreRing score={scores.overall} call={call} />
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Life Score</span>
          </div>
          <div className="flex-1 min-w-0 divide-y divide-border">
            <DomainRow label="Health"  score={scores.health.score}  trend={scores.health.trend}  icon={Heart}      color="#22c55e" noData={!vital}         href="/vitals" />
            <DomainRow label="Body"    score={scores.body.score}    trend={scores.body.trend}    icon={Dumbbell}   color="#f97316" noData={!bodyHasData}   href="/body" />
            <DomainRow label="Wealth"  score={scores.wealth.score}  trend={scores.wealth.trend}  icon={TrendingUp} color="#f59e0b" noData={!wealthHasData} href="/wealth" />
            <DomainRow label="Mind"    score={scores.mind.score}    trend={scores.mind.trend}    icon={Brain}      color="#a78bfa" noData={!mindHasData}   href="/mind" />
          </div>
        </div>

        {/* Alignment / Word Kept — FORGE's core metric */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Alignment · Word Kept</span>
            <span className={`text-xs font-bold tabular-nums ${
              alignment.score >= 80 ? 'text-green-400' :
              alignment.score >= 60 ? 'text-yellow-400' : 'text-red-400'
            }`}>{alignment.score}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${alignment.score}%`,
                backgroundColor: alignment.score >= 80 ? '#22c55e' : alignment.score >= 60 ? '#f59e0b' : '#ef4444',
                boxShadow: `0 0 6px ${alignment.score >= 80 ? '#22c55e' : alignment.score >= 60 ? '#f59e0b' : '#ef4444'}66`,
              }} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">
              Habits {alignment.habitRate}% · Commitments {alignment.keptRate}%
            </span>
            {alignment.overdueCount > 0 && (
              <Link href="/mind" className="text-[10px] font-semibold text-red-400 hover:underline">
                {alignment.overdueCount} overdue →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Future projections */}
      {projections.length > 0 && (
        <div>
          <p className="forge-label mb-3">Where you&apos;re heading</p>
          <div className="space-y-2">
            {projections.map((p, i) => <ProjectionCard key={i} p={p} />)}
          </div>
        </div>
      )}

      {/* Habits + Commitments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Habits */}
        <div className="forge-card">
          <div className="flex items-center justify-between mb-3">
            <span className="forge-label">
              Habits
              {habits.length > 0 && (
                <span className={`ml-2 font-bold ${habitPct >= 80 ? 'text-green-400' : habitPct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{habitPct}%</span>
              )}
            </span>
            <Link href="/mind" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              <Plus className="w-3 h-3" />Add
            </Link>
          </div>
          {habits.length === 0 ? (
            <p className="text-sm text-muted-foreground">No habits yet — <Link href="/mind" className="text-primary hover:underline">start building your stack</Link></p>
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
                    <span className={`text-sm flex-1 leading-snug ${done ? 'text-muted-foreground line-through' : ''}`}>{habit.name}</span>
                    {streak > 2 && <span className="text-[10px] text-primary font-medium">{streak}🔥</span>}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Commitments */}
        <div className="forge-card">
          <div className="flex items-center justify-between mb-3">
            <span className="forge-label">Commitments</span>
            <Link href="/mind" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              <Plus className="w-3 h-3" />Add
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No commitments — <Link href="/mind" className="text-primary hover:underline">add what you promised yourself</Link></p>
          ) : (
            <ul className="space-y-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => { tasksStore.toggle(task.id); reload() }}>
                  <Circle className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                  <span className="text-sm flex-1 leading-snug">{task.title}</span>
                  {task.priority === 'high' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex-shrink-0">HIGH</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
    </>
  )
}
