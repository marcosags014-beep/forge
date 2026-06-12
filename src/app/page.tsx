'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Circle, ArrowUp, ArrowDown, Minus, Plus, RefreshCw, Zap, Heart, Dumbbell, TrendingUp, Brain, Share2, Sparkles, ChevronRight, Activity, BookOpen } from 'lucide-react'
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

/* ── Marketing Life Score Ring (static, animated) ──────── */
function MarketingScoreRing({ score = 78 }: { score?: number }) {
  const r = 64
  const circ = 2 * Math.PI * r
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 400)
    return () => clearTimeout(t)
  }, [score])

  const offset = circ - (animated / 100) * circ
  const color = '#22c55e'

  return (
    <div className="relative flex items-center justify-center w-40 h-40 flex-shrink-0">
      <svg width="160" height="160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.6))', transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="absolute text-center select-none">
        <div className="text-4xl font-black tabular-nums leading-none" style={{ color }}>{score}</div>
        <div className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full inline-block bg-green-500/15 text-green-400">LIFE SCORE</div>
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

/* ── Marketing Landing Page ────────────────────────────── */
const MODULES = [
  { icon: Heart,      color: '#22c55e', label: 'Health & Vitals',  desc: 'HRV, sleep, energy, readiness — your body in numbers.' },
  { icon: Dumbbell,   color: '#f97316', label: 'Body',             desc: 'Workouts, nutrition, and body composition tracking.' },
  { icon: TrendingUp, color: '#f59e0b', label: 'Wealth',           desc: 'Income, expenses, and savings rate in one view.' },
  { icon: Brain,      color: '#a78bfa', label: 'Mind & Goals',     desc: 'Habits, commitments, and goal progress tracking.' },
  { icon: BookOpen,   color: '#38bdf8', label: 'Journal',          desc: 'Reflect daily. Find patterns. Build self-awareness.' },
  { icon: Sparkles,   color: '#fb923c', label: 'Oracle AI',        desc: 'One AI coach that reads all your data and tells you what to do.' },
]

function MarketingLanding() {
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setEmailStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing' }),
      })
      const data = await res.json()
      setEmailStatus(data.ok ? 'success' : 'error')
    } catch {
      setEmailStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.705 0.213 47.604)' }}>
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight">FORGE</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/blog" className="text-sm text-zinc-400 hover:text-white transition-colors">Blog</Link>
          <Link href="/setup" className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors" style={{ background: 'oklch(0.705 0.213 47.604)' }}>
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-900 text-xs text-zinc-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Join 1,200+ high performers tracking their whole life
        </div>

        <div className="flex justify-center mb-8">
          <MarketingScoreRing score={78} />
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-4">
          Stop deciding.<br />
          <span style={{ color: 'oklch(0.705 0.213 47.604)' }}>Just do.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          One AI-powered dashboard for health, body, money, and goals.<br />
          Free to start. No account required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/setup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white shadow-lg transition-all hover:scale-105"
            style={{ background: 'oklch(0.705 0.213 47.604)', boxShadow: '0 0 24px oklch(0.705 0.213 47.604 / 0.35)' }}>
            Start for free
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="/pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 transition-colors">
            See pricing
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-zinc-800 bg-zinc-900/60 py-4">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-500 font-medium uppercase tracking-widest">
          <span>Built for high performers</span>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <span>Free forever</span>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <span>Data stays on your device</span>
        </div>
      </div>

      {/* 6 Module cards */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <p className="text-xs text-zinc-500 uppercase tracking-widest text-center mb-3">Six domains. One system.</p>
        <h2 className="text-2xl md:text-3xl font-black text-center mb-12">Every part of your life, connected.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MODULES.map(({ icon: Icon, color, label, desc }) => (
            <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
                <Icon className="w-4.5 h-4.5" style={{ color }} />
              </div>
              <div className="text-sm font-bold mb-1">{label}</div>
              <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Oracle demo */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.705 0.213 47.604 / 0.15)' }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'oklch(0.705 0.213 47.604)' }} />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Oracle AI · Today</span>
          </div>
          <p className="text-sm md:text-base text-zinc-200 leading-relaxed">
            &ldquo;Your HRV is down 18% while training load peaked — sleep debt is compounding. Cut volume by 30% today and prioritize 8h tonight.&rdquo;
          </p>
          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-600">Based on your vitals, workouts, and sleep data</span>
            <Link href="/setup" className="text-xs font-semibold" style={{ color: 'oklch(0.705 0.213 47.604)' }}>
              Get your insight →
            </Link>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 md:p-12 text-center max-w-xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black mb-2">Get early access updates</h2>
          <p className="text-sm text-zinc-500 mb-6">Be first to hear about new features and launch news.</p>

          {emailStatus === 'success' ? (
            <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              You&apos;re on the list. We&apos;ll be in touch.
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
              />
              <button
                type="submit"
                disabled={emailStatus === 'loading'}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex-shrink-0"
                style={{ background: 'oklch(0.705 0.213 47.604)' }}>
                {emailStatus === 'loading' ? '...' : 'Notify me'}
              </button>
            </form>
          )}
          {emailStatus === 'error' && (
            <p className="text-xs text-red-400 mt-2">Something went wrong. Try again.</p>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-24 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-black mb-4">
          Start building your life OS
        </h2>
        <p className="text-zinc-500 text-sm mb-8">Free. No account required. Your data stays local.</p>
        <Link href="/setup"
          className="inline-flex items-center gap-2 px-10 py-5 rounded-xl text-lg font-black text-white shadow-2xl transition-all hover:scale-105"
          style={{ background: 'oklch(0.705 0.213 47.604)', boxShadow: '0 0 40px oklch(0.705 0.213 47.604 / 0.4)' }}>
          Start building your life OS →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6 text-center">
        <div className="flex justify-center gap-6 text-xs text-zinc-600">
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
          <Link href="/blog" className="hover:text-zinc-400 transition-colors">Blog</Link>
          <Link href="/pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
        </div>
        <p className="text-xs text-zinc-800 mt-4">FORGE Life OS · Built for ambitious people</p>
      </footer>
    </div>
  )
}

/* ── Dashboard (existing code) ─────────────────────────── */
function Dashboard() {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          stream: true,
        }),
      })

      if (!res.ok || !res.body) return

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let firstChunk = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        if (firstChunk) { firstChunk = false; setLoadingBrief(false) }
        setOracleBrief(accumulated)
      }

      if (accumulated && !accumulated.toLowerCase().includes('unavailable')) {
        try {
          localStorage.setItem('forge_oracle_brief', JSON.stringify({ date: todayStr, content: accumulated }))
        } catch {}
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
            Oracle needs your data — log vitals today to get your first insight.
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
            <div className="text-center py-4">
              <p className="text-sm font-medium text-foreground mb-1">No habits yet</p>
              <p className="text-xs text-muted-foreground mb-3">Identity is built through daily reps. Start with one.</p>
              <Link href="/mind" className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">+ Add your first habit</Link>
            </div>
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
            <div className="text-center py-4">
              <p className="text-sm font-medium text-foreground mb-1">No commitments</p>
              <p className="text-xs text-muted-foreground mb-3">What did you promise yourself this week?</p>
              <Link href="/mind" className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">+ Add a commitment</Link>
            </div>
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

/* ── Page entry point ──────────────────────────────────── */
export default function CommandCenter() {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)

  useEffect(() => {
    const profile = profileStore.get()
    setHasProfile(!!(profile?.setupComplete))
  }, [])

  // Still checking localStorage — render nothing to avoid flash
  if (hasProfile === null) return null

  return hasProfile ? <Dashboard /> : <MarketingLanding />
}
