import type { Metadata } from 'next'
import Link from 'next/link'
import { Flame, ArrowRight, Brain, Zap, Heart, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FORGE for Founders — The AI That Connects Your Health, Energy, and Performance',
  description: 'Founders burn out because they optimise the business while destroying the operator. FORGE tracks your HRV, sleep, finances, and goals — Oracle tells you when the founder is the bottleneck.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/founders' },
  openGraph: {
    title: 'FORGE for Founders — One AI for the operator behind the company',
    description: 'Your best decisions come from your best days. FORGE helps you know the difference — and protect your highest-value time.',
    type: 'website',
  },
}

const FOUNDER_PATTERNS = [
  {
    situation: 'Your most important decisions get made on your worst days',
    insight: 'Low HRV + poor sleep = degraded prefrontal function. Oracle flags when you\'re in deficit before you make the call you\'ll regret.',
    icon: Brain,
    color: 'text-purple-400',
    bg: 'bg-purple-500/8 border-purple-500/15',
  },
  {
    situation: 'Financial stress tanks your execution capacity',
    insight: 'Elevated financial stress correlates with lower HRV, reduced sleep quality, and higher task abandonment rates. Oracle surfaces this before it compounds.',
    icon: TrendingUp,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/8 border-yellow-500/15',
  },
  {
    situation: 'You commit to more than you execute',
    insight: 'The Alignment Score tracks every commitment you make and every one you break. Most founders score below 40% for the first time. That\'s the number that changes everything.',
    icon: Zap,
    color: 'text-orange-400',
    bg: 'bg-orange-500/8 border-orange-500/15',
  },
  {
    situation: 'Your energy determines your company\'s performance ceiling',
    insight: 'Training consistency, sleep, and recovery aren\'t self-care — they\'re leverage. Oracle quantifies the ROI of protecting your biological assets.',
    icon: Heart,
    color: 'text-green-400',
    bg: 'bg-green-500/8 border-green-500/15',
  },
]

export default function ForFoundersPage() {
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
          Built for founders, operators, and high-performance individuals
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.06] tracking-tight mb-6">
          You optimise the company.<br />
          Who optimises you?
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-6">
          Most founders destroy the operator to build the business. FORGE is the system that treats you as the highest-leverage asset in your company — and uses AI to keep you at peak capacity.
        </p>

        <p className="text-sm text-zinc-500 mb-10">
          Free forever · 90 seconds to set up · No account · Data stays on your device
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/setup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors shadow-xl shadow-orange-500/25">
            <Flame className="w-5 h-5" />
            Build Your Founder OS — Free
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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Founders have more data than ever. And less visibility than ever.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-zinc-400 leading-relaxed mb-4">
                You have Oura telling you your HRV. A fitness app logging your workouts. YNAB tracking your finances. Notion holding your goals. None of these talk to each other.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                You&apos;re making board-level decisions on days when your HRV is 34ms and you slept 5 hours. You don&apos;t know that&apos;s happening. No app is connecting those dots.
              </p>
            </div>
            <div>
              <p className="text-zinc-400 leading-relaxed mb-4">
                The standard advice is &quot;take care of yourself.&quot; That&apos;s not data. That&apos;s not useful. FORGE gives you something better: a quantified view of your performance capacity, updated daily, with AI telling you what to do about it.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Not a generic recommendation. Your specific numbers. Your specific patterns. Your specific decision for today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Patterns */}
      <section className="px-6 md:px-16 py-16 border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">What Oracle surfaces for founders</p>
          <h2 className="text-2xl font-bold text-white mb-10">The patterns that determine your company&apos;s ceiling.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FOUNDER_PATTERNS.map(({ situation, insight, icon: Icon, color, bg }) => (
              <div key={situation} className={`p-5 rounded-2xl border ${bg}`}>
                <Icon className={`w-5 h-5 ${color} mb-3`} />
                <p className="text-sm font-semibold text-white mb-3">{situation}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alignment Score */}
      <section className="px-6 md:px-16 py-16 border-t border-zinc-800/60">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">The metric founders need most</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Your Alignment Score.<br />
            <span className="text-zinc-500 font-normal">How often do you keep your word to yourself?</span>
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-8">
            Founders create commitments constantly — to themselves, to their teams, to the company. FORGE tracks every commitment you make (tasks, habits, goals) and calculates the percentage you actually complete on time. Most people are below 40% when they see it for the first time.
          </p>
          <p className="text-zinc-400 leading-relaxed mb-8">
            This isn&apos;t a judgement. It&apos;s a starting point. Once you have the number, you have the problem correctly defined. That&apos;s when execution changes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Habit completion rate', weight: '60%', desc: 'Daily habits kept as promised' },
              { label: 'Commitment kept rate', weight: '40%', desc: 'Tasks closed before deadline' },
              { label: 'Life Score multiplier', weight: '×0.2', desc: 'Alignment boosts your overall score' },
            ].map(({ label, weight, desc }) => (
              <div key={label} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <div className="text-orange-400 font-bold text-xl mb-1">{weight}</div>
                <div className="text-sm font-medium text-white mb-1">{label}</div>
                <div className="text-xs text-zinc-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oracle example */}
      <section className="px-6 md:px-16 py-16 border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">What Oracle tells a founder</p>
          <h2 className="text-2xl font-bold text-white mb-8">One brief. Every morning. Before you open email.</h2>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-900 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
              <Brain className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Oracle · Monday 06:15</span>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                Your HRV this morning is 41ms — down from your 7-day baseline of 58ms. You have a board call at 14:00 and two high-stakes hiring decisions this week. Your financial runway calculation from Thursday is showing reduced cushion. You have 7 overdue commitments with an Alignment Score of 38%.
              </p>
              <div className="border border-orange-500/20 bg-orange-500/5 rounded-xl px-4 py-3 mb-4">
                <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">Today&apos;s priority</p>
                <p className="text-sm text-white font-medium">
                  Defer the hiring decisions until Wednesday — your decision quality is measurably compromised today. Prep the board call with 20 minutes protected focus this morning. Clear 3 of the 7 overdue items before the call. Do not schedule any new commitments today.
                </p>
              </div>
              <p className="text-[10px] text-zinc-600 italic">This is a realistic example. Your Oracle brief uses your actual FORGE data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-16 py-24 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            The best founders know<br />themselves better than their competitors.
          </h2>
          <p className="text-zinc-400 mb-10 leading-relaxed">
            FORGE is free. No account. No hardware. 90 seconds to set up. Oracle starts giving you cross-domain insights after 7 days of data. Pro adds unlimited AI and weekly automated analysis.
          </p>
          <Link href="/setup"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-xl font-bold text-base transition-colors shadow-xl shadow-orange-500/25">
            <Flame className="w-5 h-5" />
            Build Your Founder OS — Free
          </Link>
          <p className="text-xs text-zinc-600 mt-5">
            Free forever tier. Pro from €8.25/month. Cancel anytime.
          </p>
        </div>
      </section>

      <footer className="px-6 md:px-16 py-8 border-t border-zinc-800 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-600 mb-4">
          <Link href="/blog/alignment-score" className="hover:text-zinc-400 transition-colors">Alignment Score</Link>
          <Link href="/blog/decision-fatigue" className="hover:text-zinc-400 transition-colors">Decision Fatigue</Link>
          <Link href="/blog/morning-routine-system" className="hover:text-zinc-400 transition-colors">Morning System</Link>
          <Link href="/for/athletes" className="hover:text-zinc-400 transition-colors">For Athletes</Link>
          <Link href="/pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
        </div>
        <p className="text-xs text-zinc-700">© 2026 FORGE. Local-first · No account required.</p>
      </footer>
    </div>
  )
}
