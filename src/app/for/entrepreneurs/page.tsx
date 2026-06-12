import type { Metadata } from 'next'
import Link from 'next/link'
import { Flame, Zap, TrendingUp, Target, BarChart2, ArrowRight, Compass } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FORGE for Entrepreneurs — Turn Vision Into Daily Execution | 2026',
  description: 'You know what matters. The problem is your days don\'t reflect it. FORGE closes the gap between your vision and your daily actions — with an Alignment Score that shows you the truth.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/entrepreneurs' },
  openGraph: {
    title: 'FORGE for Entrepreneurs — Turn Vision Into Daily Execution',
    description: 'You don\'t have a strategy problem. You have an execution gap. FORGE gives you clarity on what matters today, tracks whether you do it, and tells you when you\'re drifting.',
    type: 'website',
  },
}

const PATTERNS = [
  {
    signal: 'Top priority: "close 3 enterprise deals" — Hours spent on it this week: 2.5h of 40h',
    insight: 'Oracle: your stated priority and your actual calendar are contradicting each other. You\'re running a busy company, not the company you want to build. Audit before Friday.',
    icon: Target,
    color: 'text-red-400',
    bg: 'bg-red-500/8 border-red-500/15',
  },
  {
    signal: 'Alignment Score: 29% — Week 4 consecutive below 35%',
    insight: 'Oracle: four consecutive weeks below 35% means your system is broken, not your discipline. You\'re committing to more than your structure can support. Cut scope, not sleep.',
    icon: BarChart2,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/8 border-yellow-500/15',
  },
  {
    signal: 'Daily plan: 9 high-priority items / Completed by EOD: 2',
    insight: 'Oracle: nine "high priority" items is zero high priority items. One focus per morning. Reactive work fills the rest. The bottleneck is the morning ritual, not the afternoon.',
    icon: Compass,
    color: 'text-blue-400',
    bg: 'bg-blue-500/8 border-blue-500/15',
  },
  {
    signal: 'Vision: "launch in Q2" + Zero daily milestones defined',
    insight: 'Oracle: your Q2 launch exists as a wish, not a plan. A goal without daily actions is a dream with a deadline. Break it into this week\'s non-negotiable output now.',
    icon: TrendingUp,
    color: 'text-purple-400',
    bg: 'bg-purple-500/8 border-purple-500/15',
  },
]

const TOOLS_REPLACED = [
  'Notion project dashboards',
  'Linear / Jira (execution gap remains)',
  'Weekly journaling (no accountability)',
  'OKR spreadsheets',
  'Executive coaches (€300/hr)',
  'Monday.com team boards',
]

export default function EntrepreneursPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="px-6 md:px-16 py-5 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          FORGE
        </Link>
        <Link href="/setup" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Try Free
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-4">For Entrepreneurs</p>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          You know what matters.<br />
          <span className="text-primary">Your days don&#39;t reflect it.</span>
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed mb-12">
          The problem isn&#39;t vision. It&#39;s the gap between what you intend and what you actually do each day.
          Reactive meetings, scattered priorities, and no honest feedback loop. FORGE is the daily structure layer
          that closes the gap between your strategy and your execution — and shows you the score.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {PATTERNS.map(p => {
            const Icon = p.icon
            return (
              <div key={p.signal} className={`p-5 rounded-2xl border ${p.bg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${p.color}`} />
                  <span className={`text-xs font-semibold ${p.color}`}>ORACLE INSIGHT</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 font-mono">{p.signal}</p>
                <p className="text-sm text-foreground leading-relaxed">{p.insight}</p>
              </div>
            )
          })}
        </div>

        <div className="bg-card/40 border border-border rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-2">The execution gap no tool has solved</h2>
          <p className="text-muted-foreground mb-6">
            You have project management tools, OKRs, weekly reviews, maybe even a coach. But something is still missing:
            a system that knows what you committed to, tracks whether you did it, and tells you honestly when your
            behavior diverged from your intentions. Every other tool shows you what to do. FORGE shows you whether you did it.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TOOLS_REPLACED.map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-red-400 text-xs">—</span>
                {item}
              </div>
            ))}
          </div>
          <p className="text-sm text-primary font-semibold mt-6">
            FORGE connects your vision to your daily actions and measures the gap — in real time.
          </p>
        </div>

        <div className="bg-card/30 border border-border rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">ORACLE — YOUR MORNING BRIEFING</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-4">
            &ldquo;Good morning. Your Alignment Score this week is 31% — your lowest in 6 weeks. The pattern: you&#39;re completing
            operational tasks at high rates but the three revenue-generating commitments you set Monday have 0% completion.
            Your one focus today is a 45-minute outreach block before 11am. Everything else is noise until that&#39;s done.
            Protect this window or your Q2 target becomes structurally unreachable.&rdquo;
          </p>
          <p className="text-xs text-muted-foreground">Oracle doesn&#39;t tell you what you want to hear. It tells you what your data shows.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-2">Built for founders who are done with systems that don&#39;t hold</h2>
          <div className="space-y-3 mt-4">
            {[
              ['The Alignment Score', 'Your personal KPI: the ratio of commitments made to commitments kept. Most entrepreneurs are below 35%. Now you\'ll know your number.'],
              ['Oracle morning briefing', 'One focused recommendation each morning based on your actual data — not generic productivity advice.'],
              ['Vision-to-daily structure', 'Your quarterly goals automatically translate into weekly priorities and daily non-negotiables.'],
              ['Local-first', 'Your strategy, goals, and execution data never leave your device. No SaaS dependencies, no data exposure.'],
              ['Free forever tier', 'Core tracking and daily Oracle insights — no trial expiry, no credit card.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-4 p-4 bg-card/20 rounded-xl border border-border">
                <span className="text-primary font-bold text-sm mt-0.5">✓</span>
                <div>
                  <span className="font-semibold text-sm">{title}</span>
                  <span className="text-muted-foreground text-sm"> — {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-2">Free. No account required. Data stays on your device.</p>
          <Link href="/setup"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <Flame className="w-5 h-5" />
            Close your execution gap
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-muted-foreground mt-3">Takes 90 seconds to set up</p>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm mb-4">Related:</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/blog/alignment-score" className="text-primary hover:text-primary/80 text-sm">Alignment Score</Link>
            <Link href="/blog/decision-fatigue" className="text-primary hover:text-primary/80 text-sm">Decision Fatigue</Link>
            <Link href="/blog/life-os" className="text-primary hover:text-primary/80 text-sm">Life OS</Link>
            <Link href="/for/founders" className="text-primary hover:text-primary/80 text-sm">FORGE for Founders</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
