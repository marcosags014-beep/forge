import type { Metadata } from 'next'
import Link from 'next/link'
import { Flame, Heart, Zap, TrendingUp, Brain, ArrowRight, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FORGE for Biohackers — Cross-Domain AI That Connects Your Stack | 2026',
  description: 'Finally: one system that connects your HRV, sleep, training, finances, and habits — with AI that finds the patterns across all of them. Local-first. No account required.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/biohackers' },
  openGraph: {
    title: 'FORGE for Biohackers — The Missing Cross-Domain Layer',
    description: 'You have more data than ever and less synthesis than ever. FORGE is the AI layer that connects your metrics and tells you what they mean together.',
    type: 'website',
  },
}

const PATTERNS = [
  {
    signal: 'HRV 38ms (baseline: 55ms) + Cash flow: -€340 this week',
    insight: 'Oracle: physiological stress and financial stress are compounding. Your body is treating debt like a predator. Address both or neither will improve.',
    icon: Heart,
    color: 'text-red-400',
    bg: 'bg-red-500/8 border-red-500/15',
  },
  {
    signal: 'Sleep 5.6h avg + Habit completion: 28%',
    insight: 'Oracle: your habits didn\'t fail. Your sleep did. Restore 7.5h for 5 days and completion rate will recover without willpower changes.',
    icon: Brain,
    color: 'text-purple-400',
    bg: 'bg-purple-500/8 border-purple-500/15',
  },
  {
    signal: 'Training volume up 40% + Mood trending down',
    insight: 'Oracle: overreaching signature. You\'re adding training stress faster than your recovery markers can absorb it. Back off before symptoms appear.',
    icon: Activity,
    color: 'text-orange-400',
    bg: 'bg-orange-500/8 border-orange-500/15',
  },
  {
    signal: 'Alignment Score: 34% (3-week low)',
    insight: 'Oracle: you\'re committing to more than you can execute. Reduce commitments or improve sleep — you can\'t willpower your way past a 34%.',
    icon: TrendingUp,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/8 border-yellow-500/15',
  },
]

const STACK_REPLACED = [
  'Oura / Whoop (HRV + sleep)',
  'MyFitnessPal (nutrition)',
  'Notion life OS (goals + habits)',
  'YNAB or spreadsheet (finance)',
  'Habitica or Streaks (habit tracker)',
  'ChatGPT for personal analysis',
]

export default function BiohackersPage() {
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
        <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-4">For Biohackers</p>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Your data stack is fragmented.<br />
          <span className="text-primary">Your insights should not be.</span>
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed mb-12">
          You track HRV, sleep, glucose, training load, body composition, finances, and habits.
          But none of your apps talk to each other. FORGE is the cross-domain AI layer that finally connects them.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {PATTERNS.map(p => {
            const Icon = p.icon
            return (
              <div key={p.signal} className={`p-5 rounded-2xl border ${p.bg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${p.color}`} />
                  <span className={`text-xs font-semibold ${p.color}`}>SIGNAL DETECTED</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 font-mono">{p.signal}</p>
                <p className="text-sm text-foreground leading-relaxed">{p.insight}</p>
              </div>
            )
          })}
        </div>

        <div className="bg-card/40 border border-border rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-2">The problem with your current stack</h2>
          <p className="text-muted-foreground mb-6">
            You already know that sleep affects training. That stress affects recovery. That financial anxiety affects sleep.
            But your apps can only see one domain at a time. The insight that connects them never arrives — because no single tool can see all the data.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {STACK_REPLACED.map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-red-400 text-xs">—</span>
                {item}
              </div>
            ))}
          </div>
          <p className="text-sm text-primary font-semibold mt-6">
            FORGE replaces these with one connected system + AI that synthesises across all domains.
          </p>
        </div>

        <div className="bg-card/30 border border-border rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">ORACLE — YOUR CROSS-DOMAIN AI</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-4">
            &ldquo;Three correlations this week worth your attention:
            Your HRV dropped 18% on the two nights you had financial admin tasks in the evening — late-stage cortisol response.
            Your workout volume peaked Wednesday but your sleep quality was lowest that night — training timing mismatch.
            Your Alignment Score is highest on mornings after 7.5+ hour sleep, regardless of caffeine intake.
            Recommendation: move financial reviews to morning, shift hard sessions to pre-12pm, protect 22:00 sleep window.&rdquo;
          </p>
          <p className="text-xs text-muted-foreground">This is the output you get when health, finance, habits, and goals share the same AI brain.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-2">Built for data-driven people</h2>
          <div className="space-y-3 mt-4">
            {[
              ['Local-first', 'Your data never leaves your device. No cloud sync. No data broker.'],
              ['No hardware required', 'Enter HRV and sleep manually if you prefer, or log what your wearable tells you.'],
              ['The Alignment Score', 'Measures the gap between what you commit to and what you execute. Most people are below 40%.'],
              ['Oracle AI', 'Sees all your domains simultaneously. Uses your actual data, not generic advice.'],
              ['Free forever tier', 'Core tracking and daily AI insights — no trial, no credit card.'],
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
            Start your cross-domain OS
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-muted-foreground mt-3">Takes 90 seconds to set up</p>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm mb-4">Related:</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/blog/hrv-tracking" className="text-primary hover:text-primary/80 text-sm">HRV Tracking</Link>
            <Link href="/blog/quantified-self-app" className="text-primary hover:text-primary/80 text-sm">Quantified Self App</Link>
            <Link href="/blog/biohacker-app" className="text-primary hover:text-primary/80 text-sm">Best Biohacker App 2026</Link>
            <Link href="/blog/alignment-score" className="text-primary hover:text-primary/80 text-sm">Alignment Score</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
