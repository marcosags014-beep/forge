'use client'

import { useEffect, useState } from 'react'
import { Lightbulb, RefreshCw, X, AlertTriangle, Trophy, Info, TrendingDown, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { generateInsights, vitalsStore, calculateLifeScores, getAllDataForAI } from '@/lib/store'
import type { InsightCard, LifeScores, VitalEntry } from '@/lib/types'

/* ── Mental health detection ───────────────────────────── */
function getMentalHealthStatus() {
  const vitals = vitalsStore.getRecent(7)
  if (vitals.length < 3) return { level: 'none' as const }
  const lowMood = vitals.filter(v => v.mood <= 3).length
  const lowSleep = vitals.filter(v => v.sleepHours < 6).length
  const lowEnergy = vitals.filter(v => v.energy <= 3).length
  if (lowMood >= 5 && lowSleep >= 4) return { level: 'crisis' as const }
  if (lowMood >= 3 && (lowSleep >= 3 || lowEnergy >= 3)) return { level: 'concern' as const }
  if (lowMood >= 2) return { level: 'watch' as const }
  return { level: 'none' as const }
}

/* ── Insight card UI ───────────────────────────────────── */
const severityConfig = {
  alert:   { icon: AlertTriangle, border: 'border-l-red-500',    bg: 'bg-red-500/5',    badge: 'bg-red-500/10 text-red-400',    label: 'Critical' },
  warning: { icon: TrendingDown,  border: 'border-l-yellow-500', bg: 'bg-yellow-500/5', badge: 'bg-yellow-500/10 text-yellow-400', label: 'Warning' },
  win:     { icon: Trophy,        border: 'border-l-green-500',  bg: 'bg-green-500/5',  badge: 'bg-green-500/10 text-green-400',  label: 'Win' },
  info:    { icon: Info,          border: 'border-l-blue-500',   bg: 'bg-blue-500/5',   badge: 'bg-blue-500/10 text-blue-400',    label: 'Insight' },
}

function InsightCardUI({ card, onDismiss, index }: { card: InsightCard; onDismiss: (id: string) => void; index: number }) {
  const config = severityConfig[card.severity]
  const Icon = config.icon

  return (
    <div
      className={`${config.bg} ${config.border} border border-border border-l-4 rounded-xl p-4 relative group animate-in fade-in slide-in-from-bottom-4 duration-300`}
      style={{ animationDelay: `${index * 0.07}s`, animationFillMode: 'both' }}
    >
      <button
        onClick={() => onDismiss(card.id)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.badge}`}>{config.label}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{card.domain}</span>
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">{card.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{card.body}</p>
          {card.action && card.actionHref && (
            <a href={card.actionHref} className="inline-block mt-2 text-xs text-primary hover:underline font-medium">
              {card.action} →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Mental health banner ─────────────────────────────── */
function MentalHealthBanner({ level }: { level: 'crisis' | 'concern' | 'watch' }) {
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (dismissed) return null

  const configs = {
    crisis: {
      bg: 'bg-red-500/10 border-red-500/30',
      title: "It looks like you've been having a hard time lately.",
      body: "Your data shows several consecutive days of low mood and poor sleep. This happens — but it's worth paying attention to. You're not alone.",
      showResources: true,
    },
    concern: {
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      title: 'Your mood and energy have been lower than usual.',
      body: "Three or more rough days in a row is a signal worth listening to. Consider what's draining you and what would help.",
      showResources: false,
    },
    watch: {
      bg: 'bg-blue-500/10 border-blue-500/20',
      title: 'Worth checking in with yourself today.',
      body: "Your mood has been a bit lower recently. A quick walk, a conversation with someone you trust, or even just a few minutes outside can shift things.",
      showResources: false,
    },
  }

  const c = configs[level]

  return (
    <div className={`p-4 rounded-xl border ${c.bg} mb-6`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold mb-1">{c.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{c.body}</p>

          {c.showResources && (
            <div className="mt-3">
              <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary hover:underline">
                {expanded ? 'Hide resources ↑' : 'See support resources ↓'}
              </button>
              {expanded && (
                <div className="mt-3 space-y-2 text-xs text-muted-foreground bg-background/50 rounded-lg p-3">
                  <p className="font-semibold text-foreground">If you need to talk to someone:</p>
                  <p>🌍 International crisis centres: <span className="text-foreground">www.iasp.info/resources/Crisis_Centres/</span></p>
                  <p>🇺🇸 Crisis Text Line: <span className="text-foreground">Text HOME to 741741</span></p>
                  <p>🇪🇺 Europe: <span className="text-foreground">116 123 (Samaritans, available in many EU countries)</span></p>
                  <p>🇪🇸 Spain: <span className="text-foreground">024 (Línea de Atención a Conducta Suicida)</span></p>
                  <p className="text-muted-foreground mt-2 italic">Asking for help is not weakness. It&apos;s the strongest thing you can do.</p>
                </div>
              )}
            </div>
          )}
        </div>
        <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ── Correlation scatter ──────────────────────────────── */
function CorrelationChart({ vitals }: { vitals: VitalEntry[] }) {
  if (vitals.length < 5) return null
  const data = vitals.filter(v => v.sleepHours && v.mood).map(v => ({ x: v.sleepHours, y: v.mood, z: 1 }))

  const avgSleep = data.reduce((s, d) => s + d.x, 0) / data.length
  const avgMood = data.reduce((s, d) => s + d.y, 0) / data.length
  const correlation = (() => {
    const n = data.length
    const sumXY = data.reduce((s, d) => s + (d.x - avgSleep) * (d.y - avgMood), 0)
    const sumX2 = data.reduce((s, d) => s + Math.pow(d.x - avgSleep, 2), 0)
    const sumY2 = data.reduce((s, d) => s + Math.pow(d.y - avgMood, 2), 0)
    if (sumX2 === 0 || sumY2 === 0) return 0
    return sumXY / Math.sqrt(sumX2 * sumY2)
  })()

  const corrLabel = correlation > 0.5 ? 'Strong positive' : correlation > 0.2 ? 'Moderate positive' : correlation < -0.5 ? 'Strong negative' : correlation < -0.2 ? 'Moderate negative' : 'Weak'
  const corrColor = correlation > 0.3 ? 'text-green-400' : correlation < -0.3 ? 'text-red-400' : 'text-yellow-400'

  return (
    <div className="forge-card mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-sm">Sleep → Mood Correlation</p>
          <p className="text-xs text-muted-foreground mt-0.5">Does sleep quality predict your mood?</p>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${corrColor}`}>{corrLabel}</div>
          <div className="text-xs text-muted-foreground">r = {correlation.toFixed(2)}</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="x" name="Sleep" type="number" domain={[4, 10]} tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} label={{ value: 'Sleep (hrs)', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#71717a' }} />
          <YAxis dataKey="y" name="Mood" type="number" domain={[1, 10]} tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} label={{ value: 'Mood', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#71717a' }} />
          <ZAxis dataKey="z" range={[30, 30]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'oklch(0.13 0.003 285)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', fontSize: 11 }} formatter={(val, name) => [name === 'Sleep' ? `${val}h` : `${val}/10`, name as string]} />
          <Scatter data={data} fill="#f97316" fillOpacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────── */
export default function InsightsPage() {
  const [cards, setCards] = useState<InsightCard[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [scores, setScores] = useState<LifeScores | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [aiCards, setAiCards] = useState<InsightCard[]>([])
  const [vitals, setVitals] = useState<VitalEntry[]>([])
  const mentalHealth = getMentalHealthStatus()

  useEffect(() => {
    setCards(generateInsights())
    setScores(calculateLifeScores())
    setVitals(vitalsStore.getRecent(30))
  }, [])

  function dismiss(id: string) {
    setDismissed(prev => new Set([...prev, id]))
  }

  async function generateAIInsights() {
    setLoadingAI(true)
    try {
      const userData = getAllDataForAI()
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'insights',
          message: 'Analyze this data and return 3-5 insight cards as a JSON array. Each object must have: title (string), body (string, 1-2 sentences, specific to numbers), severity ("info"|"warning"|"win"|"alert"), domain ("health"|"body"|"wealth"|"mind"|"cross"). Focus on non-obvious patterns and correlations. Return ONLY the JSON array.',
          userData,
        }),
      })
      const data = await res.json()
      try {
        const parsed = JSON.parse(data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
        if (Array.isArray(parsed)) {
          setAiCards(parsed.map((c, i) => ({ ...c, id: `ai_${i}`, actionHref: undefined })))
        }
      } catch {
        setAiCards([{ id: 'ai_raw', title: 'AI Analysis', body: data.content, severity: 'info', domain: 'cross' }])
      }
    } catch {
      setAiCards([{ id: 'ai_err', title: 'Connection Error', body: 'Could not reach Oracle. Check your API key.', severity: 'info', domain: 'cross' }])
    } finally {
      setLoadingAI(false)
    }
  }

  const visibleCards = [...cards, ...aiCards].filter(c => !dismissed.has(c.id))
  const alerts = visibleCards.filter(c => c.severity === 'alert' || c.severity === 'warning').length
  const wins = visibleCards.filter(c => c.severity === 'win').length

  return (
    <div className="p-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <p className="forge-label mb-1">Intelligence Layer</p>
        <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
          <Lightbulb className="w-7 h-7 text-primary" />
          Insights
        </h1>
      </div>

      {/* Mental health banner */}
      {mentalHealth.level !== 'none' && <MentalHealthBanner level={mentalHealth.level} />}

      {/* Summary row */}
      {scores && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Life Score', value: scores.overall, color: scores.overall >= 75 ? 'text-green-400' : scores.overall >= 50 ? 'text-yellow-400' : 'text-red-400' },
            { label: 'Alerts', value: alerts, color: alerts > 0 ? 'text-red-400' : 'text-green-400' },
            { label: 'Wins', value: wins, color: wins > 0 ? 'text-green-400' : 'text-muted-foreground' },
            { label: 'Insights', value: visibleCards.length, color: 'text-primary' },
          ].map(({ label, value, color }) => (
            <div key={label} className="forge-card text-center py-4">
              <div className={`text-3xl font-bold ${color}`}>{value}</div>
              <div className="forge-label mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Correlation chart */}
      <CorrelationChart vitals={vitals} />

      {/* AI insights button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold">Your Insights</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Based on your logged data — updated in real time</p>
        </div>
        <Button onClick={generateAIInsights} disabled={loadingAI} variant="outline" className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loadingAI ? 'animate-spin' : ''}`} />
          {loadingAI ? 'Analysing…' : 'Deep AI Analysis'}
        </Button>
      </div>

      {/* Cards */}
      {visibleCards.length === 0 ? (
        <div className="forge-card text-center py-16">
          <Lightbulb className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">No insights yet</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Log your vitals, workouts, habits, and transactions to start seeing patterns.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleCards.map((card, i) => (
            <InsightCardUI key={card.id} card={card} onDismiss={dismiss} index={i} />
          ))}
        </div>
      )}

      {/* Phone line as always-visible footer */}
      <div className="mt-8 p-3 rounded-lg bg-secondary/50 flex items-start gap-3">
        <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          If you&apos;re ever struggling, reach out. 🇺🇸 741741 · 🇪🇺 116 123 · 🇪🇸 024. You don&apos;t have to be in crisis to talk to someone.
        </p>
      </div>
    </div>
  )
}
