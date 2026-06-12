import type { Metadata } from 'next'
import Link from 'next/link'
import { Flame, BookOpen, Zap, TrendingUp, Clock, ArrowRight, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FORGE for Students — Stop Procrastinating, Start Executing | 2026',
  description: 'Turn your academic goals into daily study commitments. FORGE tracks whether you actually follow through — and Oracle tells you when you\'re drifting before it\'s too late.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/students' },
  openGraph: {
    title: 'FORGE for Students — Stop Procrastinating, Start Executing',
    description: 'You don\'t have a motivation problem. You have a structure problem. FORGE turns your goals into daily study commitments and tracks whether you keep your word to yourself.',
    type: 'website',
  },
}

const PATTERNS = [
  {
    signal: 'Exam in 18 days + Study sessions this week: 1 of 5 planned',
    insight: 'Oracle: at your current pace you\'ll cover 22% of the material. You don\'t need more motivation — you need today\'s session blocked and non-negotiable.',
    icon: BookOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-500/8 border-blue-500/15',
  },
  {
    signal: 'Goal: "read 30 min daily" — Alignment Score: 18% (week 3)',
    insight: 'Oracle: you\'ve set this goal three times without a fixed time slot. Ambition without a schedule is just anxiety. Pick a time. Protect it.',
    icon: Clock,
    color: 'text-orange-400',
    bg: 'bg-orange-500/8 border-orange-500/15',
  },
  {
    signal: 'Project deadline in 6 days + No daily sub-tasks defined',
    insight: 'Oracle: large deadlines feel distant until they\'re tomorrow. Break this into 6 daily actions. The project isn\'t the problem — the plan is.',
    icon: Target,
    color: 'text-purple-400',
    bg: 'bg-purple-500/8 border-purple-500/15',
  },
  {
    signal: 'Weekly commitments: 12 / Daily completion rate: 31%',
    insight: 'Oracle: you\'re not lazy. You\'re over-committed. Cut to 5 commitments this week and actually do them. Identity is built by following through, not by planning.',
    icon: TrendingUp,
    color: 'text-green-400',
    bg: 'bg-green-500/8 border-green-500/15',
  },
]

const TOOLS_REPLACED = [
  'Notion study dashboards',
  'Google Calendar color coding',
  'Pomodoro apps (no follow-up)',
  'Sticky notes and to-do lists',
  'Habit trackers that reset forever',
  'ChatGPT for vague motivation',
]

export default function StudentsPage() {
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
        <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-4">For Students</p>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          You know what you should be doing.<br />
          <span className="text-primary">You&#39;re just not doing it.</span>
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed mb-12">
          Procrastination isn&#39;t a character flaw — it&#39;s a structure failure. You have ambition, but no system that converts it into
          today&#39;s actions. FORGE turns your goals into daily study commitments and tracks whether you actually follow through.
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
          <h2 className="text-xl font-bold mb-2">Why your current system keeps failing you</h2>
          <p className="text-muted-foreground mb-6">
            You build study schedules in Notion. You color-code calendars. You download habit trackers. Then life happens and none of it
            holds. The problem isn&#39;t the tool — it&#39;s that nothing tells you when you&#39;re drifting, and nothing holds you accountable
            to your past self. FORGE does both.
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
            FORGE replaces scattered systems with one structure that tracks follow-through and adapts when you drift.
          </p>
        </div>

        <div className="bg-card/30 border border-border rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">ORACLE — YOUR EXECUTION AI</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-4">
            &ldquo;Your Alignment Score dropped to 24% this week — you committed to 8 study sessions and completed 2. That&#39;s not a willpower
            problem: Tuesday you had no session scheduled until 9pm, and Wednesday you had three things marked high priority. Today: one
            session, 14:00–15:30, on Chapter 4 only. That&#39;s it. Do that and your streak resets.&rdquo;
          </p>
          <p className="text-xs text-muted-foreground">Oracle doesn&#39;t motivate you. It diagnoses the structure failure and gives you one clear action.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-2">Built for ambitious students who are tired of planning and not executing</h2>
          <div className="space-y-3 mt-4">
            {[
              ['Daily commitment structure', 'Your goals automatically break into daily study actions. No more vague intentions — just today\'s session.'],
              ['The Alignment Score', 'Shows the gap between what you commit to and what you actually do. Most students are below 35%.'],
              ['Oracle AI', 'Detects when you\'re drifting before an exam sneaks up on you. Gives one focused recommendation, not a lecture.'],
              ['Local-first', 'Your study data and goal progress never leave your device. No accounts, no cloud sync.'],
              ['Free forever tier', 'Core goal tracking and daily Oracle insights — no trial period, no credit card required.'],
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
            Build your study structure
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-muted-foreground mt-3">Takes 90 seconds to set up</p>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm mb-4">Related:</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/blog/alignment-score" className="text-primary hover:text-primary/80 text-sm">Alignment Score</Link>
            <Link href="/blog/habit-tracker-alternatives" className="text-primary hover:text-primary/80 text-sm">Habit Tracker Alternatives</Link>
            <Link href="/blog/life-os" className="text-primary hover:text-primary/80 text-sm">Life OS</Link>
            <Link href="/blog/morning-routine-system" className="text-primary hover:text-primary/80 text-sm">Morning Routine System</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
