'use client'

import { useEffect, useState } from 'react'
import { format, startOfWeek, addWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight, RefreshCw, Trophy, TrendingUp, TrendingDown, Minus, Sparkles, Lock, Share2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { calculateLifeScores, vitalsStore, workoutsStore, habitsStore, financeStore, goalsStore, getAllDataForAI, isProUser, profileStore, getAlignmentScore, alignmentHistoryStore } from '@/lib/store'
import type { LifeScores } from '@/lib/types'
import Link from 'next/link'

function scoreColor(s: number) {
  return s >= 75 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444'
}

function DomainRing({ label, score, prev }: { label: string; score: number; prev?: number }) {
  const r = 32
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = scoreColor(score)
  const delta = prev !== undefined ? score - prev : 0

  return (
    <div className="forge-card flex flex-col items-center gap-2 py-4">
      <div className="relative flex items-center justify-center w-20 h-20">
        <svg width="80" height="80" className="-rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute text-center">
          <div className="text-lg font-bold" style={{ color }}>{score}</div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      {prev !== undefined && (
        <div className={`flex items-center gap-0.5 text-xs font-medium ${delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
          {delta > 0 ? <TrendingUp className="w-3 h-3" /> : delta < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          {delta > 0 ? '+' : ''}{delta !== 0 ? delta : 'flat'}
        </div>
      )}
    </div>
  )
}

export default function ReviewPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [scores, setScores] = useState<LifeScores | null>(null)
  const [narrative, setNarrative] = useState('')
  const [wins, setWins] = useState<string[]>([])
  const [improvements, setImprovements] = useState<string[]>([])
  const [nextWeek, setNextWeek] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [shared, setShared] = useState(false)
  const [alignment, setAlignment] = useState({ score: 0, habitRate: 0, keptRate: 0, overdueCount: 0 })
  const [prevAlignment, setPrevAlignment] = useState<number | null>(null)
  const [identity, setIdentity] = useState<string | null>(null)

  const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 })
  const weekLabel = `Week of ${format(weekStart, 'MMM d, yyyy')}`
  const isCurrent = weekOffset === 0

  useEffect(() => {
    setIsPro(isProUser())
    setScores(calculateLifeScores())
    const currentAlignment = getAlignmentScore()
    setAlignment(currentAlignment)
    const profile = profileStore.get()
    setIdentity(profile?.identity ?? null)
    // Grab last week's alignment snapshot for comparison
    const history = alignmentHistoryStore.getAll()
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const weekAgoStr = sevenDaysAgo.toISOString().split('T')[0]
    const weekAgoSnap = history.find(s => s.date <= weekAgoStr)
    setPrevAlignment(weekAgoSnap?.score ?? null)
    // Compute quick local wins/improvements
    const habits = habitsStore.getAll()
    const localWins: string[] = []
    const localImprove: string[] = []

    const todayVitals = vitalsStore.getRecent(7)
    const avgSleep = todayVitals.length
      ? todayVitals.reduce((s, v) => s + v.sleepHours, 0) / todayVitals.length
      : 0

    if (avgSleep >= 7.5) localWins.push(`Averaged ${avgSleep.toFixed(1)}h sleep this week — excellent recovery`)
    else if (avgSleep > 0 && avgSleep < 6.5) localImprove.push(`Sleep averaged only ${avgSleep.toFixed(1)}h — target 7.5h+`)

    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    const workoutsThisWeek = workoutsStore.getAll().filter(w => w.date >= weekAgo.toISOString().split('T')[0]).length
    if (workoutsThisWeek >= 4) localWins.push(`${workoutsThisWeek} workouts completed — top-tier consistency`)
    else if (workoutsThisWeek < 2) localImprove.push(`Only ${workoutsThisWeek} workout${workoutsThisWeek !== 1 ? 's' : ''} this week — aim for 3-4`)

    const habitRate = habitsStore.completionRateFor(7)
    if (habitRate >= 80) localWins.push(`${habitRate}% habit completion — near-perfect consistency`)
    else if (habitRate < 50) localImprove.push(`${habitRate}% habit completion — focus on your top 3 habits`)

    const balance = financeStore.getBalance()
    if (balance > 0) localWins.push(`Positive balance of €${balance.toFixed(0)} — building financial foundation`)

    const activeGoals = goalsStore.getAll().filter(g => g.status === 'active')
    activeGoals.filter(g => g.progress >= 75).forEach(g =>
      localWins.push(`Goal "${g.title}" at ${g.progress}% — final stretch`)
    )

    setWins(localWins)
    setImprovements(localImprove)
  }, [weekOffset])

  async function shareWeek() {
    if (!scores) return
    const alignmentDelta = prevAlignment !== null ? alignment.score - prevAlignment : null
    const deltaStr = alignmentDelta !== null
      ? ` (${alignmentDelta >= 0 ? '+' : ''}${alignmentDelta}% vs last week)`
      : ''
    const lines = [
      `FORGE Weekly Transformation Report — ${weekLabel}`,
      ``,
      `Alignment Score: ${alignment.score}%${deltaStr}`,
      `Habits: ${alignment.habitRate}% · Commitments: ${alignment.keptRate}%`,
      ``,
      `Life Score breakdown:`,
      `  ❤️ Health  ${scores.health.score}  💪 Body  ${scores.body.score}  💰 Wealth  ${scores.wealth.score}  🧠 Mind  ${scores.mind.score}`,
      ``,
      ...(wins.length ? [`Wins this week:`, ...wins.map(w => `✓ ${w}`), ``] : []),
      ...(nextWeek.length ? [`Next week focus:`, ...nextWeek.map((f, i) => `${i + 1}. ${f}`), ``] : []),
      `Becoming the person I know I could be — one week at a time.`,
      `forge-five-flax.vercel.app`,
    ]
    const text = lines.join('\n')
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My FORGE Weekly Transformation Report', text })
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text)
    }
    setShared(true)
    setTimeout(() => setShared(false), 2500)
  }

  async function generateReview() {
    setGenerating(true)
    setNarrative('')
    setNextWeek([])
    try {
      const userData = getAllDataForAI()
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'review',
          message: `Generate a weekly transformation review for ${weekLabel}. The user's identity: "${identity ?? 'becoming their best self'}". Alignment this week: ${alignment.score}% (habits: ${alignment.habitRate}%, commitments: ${alignment.keptRate}%). Return a JSON object with keys: "narrative" (150-200 words — direct coach assessment, reference the alignment score and their identity, name specific gaps), "wins" (array of 2-4 strings — what aligned with their identity), "improvements" (array of 2-3 strings — what was most misaligned), "nextWeek" (array of 3 focus areas that will raise alignment most). Return ONLY the JSON.`,
          userData,
          agentPrompt: 'You are a direct identity coach. Your job is not to praise — it is to show the gap between who this person says they\'re becoming and what their data shows. Be specific. Name numbers. Be kind but honest.',
        }),
      })
      const data = await res.json()
      try {
        const parsed = JSON.parse(data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
        setNarrative(parsed.narrative ?? '')
        if (parsed.wins?.length) setWins(parsed.wins)
        if (parsed.improvements?.length) setImprovements(parsed.improvements)
        if (parsed.nextWeek?.length) setNextWeek(parsed.nextWeek)
      } catch {
        setNarrative(data.content)
      }
    } catch {
      setNarrative('Could not generate review. Check your Oracle connection.')
    } finally {
      setGenerating(false)
    }
  }

  const radarData = scores ? [
    { domain: 'Health', score: scores.health.score },
    { domain: 'Body', score: scores.body.score },
    { domain: 'Wealth', score: scores.wealth.score },
    { domain: 'Mind', score: scores.mind.score },
  ] : []

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="forge-label mb-1">Identity Progress</p>
          <h1 className="text-3xl font-bold text-gradient">Transformation Report</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 rounded-lg bg-secondary hover:bg-card border border-border transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-2">{weekLabel}</span>
          <button onClick={() => setWeekOffset(w => Math.min(0, w + 1))} disabled={isCurrent}
            className="p-2 rounded-lg bg-secondary hover:bg-card border border-border transition-colors disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
          {scores && (
            <button onClick={shareWeek}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
              {shared ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {shared ? 'Copied!' : 'Share'}
            </button>
          )}
        </div>
      </div>

      {/* Identity reminder */}
      {identity && (
        <div className="px-4 py-3 rounded-xl border border-primary/15 bg-primary/5 mb-6">
          <p className="text-[10px] text-primary uppercase tracking-widest font-semibold mb-0.5">You&apos;re becoming</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{identity}</p>
        </div>
      )}

      {/* Alignment Score hero */}
      <div className="forge-card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="forge-label mb-1">Alignment Score</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black tabular-nums ${alignment.score >= 80 ? 'text-green-400' : alignment.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {alignment.score}%
              </span>
              {prevAlignment !== null && (() => {
                const delta = alignment.score - prevAlignment
                return (
                  <span className={`text-sm font-semibold flex items-center gap-0.5 ${delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {delta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : delta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    {delta > 0 ? '+' : ''}{delta}% vs last week
                  </span>
                )
              })()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Habits {alignment.habitRate}% · Commitments {alignment.keptRate}%</p>
          </div>
          <div className="text-right">
            <div className="h-16 w-16 relative flex items-center justify-center">
              <svg width="64" height="64" className="-rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="32" cy="32" r="28" fill="none"
                  stroke={alignment.score >= 80 ? '#22c55e' : alignment.score >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 - (alignment.score / 100) * 2 * Math.PI * 28}
                  style={{ transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${alignment.score}%`,
              backgroundColor: alignment.score >= 80 ? '#22c55e' : alignment.score >= 60 ? '#f59e0b' : '#ef4444',
              boxShadow: `0 0 6px ${alignment.score >= 80 ? '#22c55e55' : alignment.score >= 60 ? '#f59e0b55' : '#ef444455'}`,
            }} />
        </div>
      </div>

      {/* Domain scores */}
      {scores && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <DomainRing label="Health" score={scores.health.score} />
          <DomainRing label="Body" score={scores.body.score} />
          <DomainRing label="Wealth" score={scores.wealth.score} />
          <DomainRing label="Mind" score={scores.mind.score} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Radar */}
        {radarData.length > 0 && (
          <div className="forge-card">
            <div className="forge-label mb-3">Performance Radar</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: '#71717a' }} />
                <Radar dataKey="score" stroke="#f97316" fill="#f97316" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Wins + Improvements */}
        <div className="space-y-4">
          {wins.length > 0 && (
            <div className="forge-card">
              <div className="forge-label flex items-center gap-2 mb-3">
                <Trophy className="w-3.5 h-3.5 text-green-400" />Wins
              </div>
              <ul className="space-y-2">
                {wins.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {improvements.length > 0 && (
            <div className="forge-card">
              <div className="forge-label flex items-center gap-2 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />Areas to Improve
              </div>
              <ul className="space-y-2">
                {improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* AI Narrative */}
      <div className="forge-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="forge-label flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI Coach Assessment
            {!isPro && <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full">PRO</span>}
          </div>
          {isPro && (
            <Button onClick={generateReview} disabled={generating} variant="outline" size="sm" className="gap-2">
              <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Generating…' : 'Generate Review'}
            </Button>
          )}
        </div>

        {!isPro ? (
          <div className="relative">
            {/* Blurred preview */}
            <div className="space-y-2 mb-4 select-none pointer-events-none" aria-hidden>
              {[
                "Sleep debt is compounding. Three nights under 6.5h has your HRV trending down 12% — your body is running on borrowed time.",
                "Habit completion jumped to 78%, up from 61% last week. This is the consistency that compounds.",
                "Financial discipline is strong — on track for your savings target. Watch discretionary spend on Fridays.",
              ].map((line, i) => (
                <p key={i} className={`text-sm leading-relaxed ${i === 0 ? '' : 'blur-sm'}`}>{line}</p>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background flex items-end justify-center pb-2">
            </div>
            <div className="relative flex flex-col items-center gap-3 pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lock className="w-4 h-4 text-primary" />
                Unlock your AI coach analysis
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Get a frank, data-driven assessment of your week — specific numbers, real patterns, no fluff.
              </p>
              <Link href="/pricing">
                <Button size="sm" className="bg-primary text-primary-foreground gap-2 shadow-md shadow-primary/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        ) : generating ? (
          <div className="space-y-2">
            {[80, 90, 60].map((w, i) => (
              <div key={i} className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : narrative ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-foreground">{narrative}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Click &ldquo;Generate Review&rdquo; to get your AI coach assessment — a direct, data-driven analysis of your week.</p>
        )}
      </div>

      {/* Next week focus */}
      {nextWeek.length > 0 && (
        <div className="forge-card">
          <div className="forge-label mb-3">Focus Areas Next Week</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {nextWeek.map((focus, i) => (
              <div key={i} className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
                <div className="text-xs font-bold text-primary mb-1">{i + 1}</div>
                <p className="text-sm">{focus}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
