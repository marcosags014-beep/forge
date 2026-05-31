import type { Metadata } from 'next'
import Link from 'next/link'
import { Flame, Heart, Zap, TrendingDown, Brain, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FORGE for Athletes — HRV, Sleep, Training & Finance in One AI System',
  description: 'Stop managing four apps. FORGE connects your HRV, sleep, workouts, and finances — then tells you exactly when to push and when to recover. Free. No account.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/athletes' },
  openGraph: {
    title: 'FORGE for Athletes — One AI that sees your whole performance picture',
    description: 'Your HRV app doesn\'t know about your sleep debt. Your sleep app doesn\'t know about your training load. FORGE connects it all.',
    type: 'website',
  },
}

const PATTERNS = [
  {
    signal: 'HRV drops below your 7-day baseline',
    insight: 'Oracle flags overreaching risk 24-48h before injury symptoms appear',
    icon: Heart,
    color: 'text-red-400',
    bg: 'bg-red-500/8 border-red-500/15',
  },
  {
    signal: 'Sleep debt accumulates 3+ nights',
    insight: 'Workout output degrades significantly by day 3 — Oracle tells you before you feel it',
    icon: TrendingDown,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/8 border-yellow-500/15',
  },
  {
    signal: 'Financial stress spikes',
    insight: 'Cortisol disrupts recovery — Oracle sees the correlation between your cash flow and your HRV',
    icon: Brain,
    color: 'text-purple-400',
    bg: 'bg-purple-500/8 border-purple-500/15',
  },
  {
    signal: 'Training consistency increases',
    insight: 'Goal adherence improves within the same week — Oracle shows you the identity shift happening',
    icon: Zap,
    color: 'text-green-400',
    bg: 'bg-green-500/8 border-green-500/15',
  },
]

const APPS_REPLACED = [
  { name: 'HRV app', pain: 'Shows your HRV. Doesn\'t know your sleep was 5h.' },
  { name: 'Sleep tracker', pain: 'Shows your sleep. Doesn\'t know your training load.' },
  { name: 'Training log', pain: 'Shows your workouts. Doesn\'t know your recovery budget.' },
  { name: 'Finance app', pain: 'Shows your spending. Doesn\'t know your cortisol is high.' },
]

export default function ForAthletesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      {/* Nav */}
      <nav className="px-6 md:px-16 py-5 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-950/90 backdrop-blur-xl z-40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">FORGE</span>
        </Link>
        <Link href="/setup"
          className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-orange-500/20">
          Start Free →
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-16 pt-20 pb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-400 font-semibold mb-8">
          Built for serious athletes and performance-focused people
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.06] tracking-tight mb-6">
          Your HRV app doesn&apos;t know<br />
          you slept 5 hours.<br />
          <span className="text-orange-400">FORGE does.</span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-6">
          You&apos;re already tracking HRV, sleep, and workouts — in three separate apps that don&apos;t talk to each other. FORGE connects everything and uses AI to tell you exactly when to push and when to recover.
        </p>

        <p className="text-sm text-zinc-500 mb-10">
          Free forever · No account required · Your data never leaves your device
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/setup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors shadow-xl shadow-orange-500/25">
            <Flame className="w-5 h-5" />
            Build Your Performance OS — Free
          </Link>
          <Link href="/pricing"
            className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-8 py-4 rounded-xl font-semibold text-base transition-colors">
            See all features <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* The problem */}
      <section className="px-6 md:px-16 py-16 border-t border-zinc-800/60">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">The fragmentation problem</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
            Four apps. Four blind spots. No full picture.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {APPS_REPLACED.map(({ name, pain }) => (
              <div key={name} className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-2" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{name}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{pain}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-zinc-400 mt-8 leading-relaxed max-w-2xl">
            You are the integration layer between four apps that were never designed to work together. You do the synthesis. That synthesis tax costs you your best morning cognitive hours every single day.
          </p>
        </div>
      </section>

      {/* Cross-domain patterns */}
      <section className="px-6 md:px-16 py-16 border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">What FORGE + Oracle sees</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Cross-domain signals your apps can&apos;t detect.
          </h2>
          <p className="text-zinc-400 mb-10 max-w-2xl leading-relaxed">
            Oracle, the AI inside FORGE, watches all four domains simultaneously. When one changes, it looks for ripple effects in the others — and tells you what it means before you feel it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PATTERNS.map(({ signal, insight, icon: Icon, color, bg }) => (
              <div key={signal} className={`p-5 rounded-2xl border ${bg}`}>
                <Icon className={`w-5 h-5 ${color} mb-3`} />
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Signal</p>
                <p className="text-sm font-semibold text-white mb-3">{signal}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Oracle&apos;s insight</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oracle example */}
      <section className="px-6 md:px-16 py-16 border-t border-zinc-800/60">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Example morning brief</p>
          <h2 className="text-2xl font-bold text-white mb-10">What Oracle tells you before you open any other app.</h2>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-900 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-3 h-3 text-orange-400" />
              </div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Oracle · Sunday 06:42</span>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                HRV at 34ms — down 29% from your 7-day baseline of 48ms. You peaked training Thursday. Sleep has been 5.4h, 5.8h, 6.1h — compounding debt. Your cash flow went negative €180 this week in the same window.
              </p>
              <div className="border border-orange-500/20 bg-orange-500/5 rounded-xl px-4 py-3">
                <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">Today&apos;s single priority</p>
                <p className="text-sm text-white font-medium">
                  Recovery only. No training. Sleep target: 8h minimum. No financial decisions today — cortisol is high and your spending historically spikes 35% in these windows. Protect recovery budget first.
                </p>
              </div>
              <p className="text-[10px] text-zinc-600 mt-4 italic">Generated from your actual FORGE data. This is a realistic example.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What FORGE tracks */}
      <section className="px-6 md:px-16 py-16 border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-10 text-center">Everything an athlete needs. One dashboard.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { domain: 'Health', items: ['Sleep hours + quality', 'HRV (ms)', 'Resting HR', 'Energy 1-10', 'Mood 1-10'], color: 'text-green-400', dot: 'bg-green-400' },
              { domain: 'Body', items: ['Workout log', 'Exercise + sets + weight', 'Nutrition macros', 'Body weight trend', 'Training load'], color: 'text-orange-400', dot: 'bg-orange-400' },
              { domain: 'Wealth', items: ['Income tracking', 'Expense categories', 'Monthly cash flow', 'Net balance trend', 'Stress spending flags'], color: 'text-yellow-400', dot: 'bg-yellow-400' },
              { domain: 'Mind', items: ['Goals + progress %', 'Daily habits (streak)', 'Commitments + deadlines', 'Alignment Score', 'Evening reflection'], color: 'text-purple-400', dot: 'bg-purple-400' },
            ].map(({ domain, items, color, dot }) => (
              <div key={domain} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <div className={`flex items-center gap-2 mb-4`}>
                  <div className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>{domain}</span>
                </div>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="text-xs text-zinc-500 leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-16 py-24 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stop being the integration layer<br />between your apps.
          </h2>
          <p className="text-zinc-400 mb-10 leading-relaxed">
            FORGE is free. No account. Your data never leaves your device. 90 seconds to set up. Oracle starts giving you cross-domain insights after 7 days of data.
          </p>
          <Link href="/setup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-xl font-bold text-base transition-colors shadow-xl shadow-orange-500/25">
            <Flame className="w-5 h-5" />
            Build Your Performance OS — Free
          </Link>
          <p className="text-xs text-zinc-600 mt-5">
            Free forever tier. Pro from €8.25/month. No credit card for free tier.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-8 border-t border-zinc-800 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-600 mb-4">
          <Link href="/blog/hrv-tracking" className="hover:text-zinc-400 transition-colors">HRV Tracking Guide</Link>
          <Link href="/blog/morning-routine-system" className="hover:text-zinc-400 transition-colors">Morning Routine System</Link>
          <Link href="/blog/alignment-score" className="hover:text-zinc-400 transition-colors">Alignment Score</Link>
          <Link href="/pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
        </div>
        <p className="text-xs text-zinc-700">© 2026 FORGE. Local-first · No account required.</p>
      </footer>
    </div>
  )
}
