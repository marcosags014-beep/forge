import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE for Coaches — Track Your Performance, Not Just Your Clients | Life OS',
  description: 'Coaches spend their days optimising other people\'s performance. FORGE is the system for optimising your own — health, energy, finances, and goals, connected by AI.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/coaches' },
  openGraph: {
    title: 'FORGE for Coaches — Track Your Performance, Not Just Your Clients',
    description: 'The best coaches practice what they preach. Here is the system for staying at the top of your own performance game.',
    type: 'website',
  },
}

export default function ForCoachesPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-10">
        <nav className="text-sm text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-300">FORGE</Link>
          <span className="mx-2">›</span>
          <span>For Coaches</span>
        </nav>
        <p className="text-sm text-orange-400 font-medium mb-3 uppercase tracking-wide">FORGE for</p>
        <h1 className="text-4xl font-bold text-white leading-tight mb-5">
          Practice what you prescribe
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-6">
          Coaches are in the business of accountability and performance. Most have no system
          for their own. FORGE gives coaches the same rigour they bring to client programming
          — applied to their own health, energy, business, and goals.
        </p>
        <Link href="/setup" className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors">
          Start Free — No Account Required
        </Link>
      </header>

      <section className="space-y-8 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">The Coach Performance Paradox</h2>
          <p>
            Coaches design recovery protocols for clients and skip their own. They track
            their clients&apos; habit completion and ignore their own. They build goal structures
            for others and leave their own goals in a notes app.
          </p>
          <p className="mt-3">
            The result: coaches who are performing at a lower level than their clients —
            and who cannot sustainably model the behaviour they are trying to instil.
            FORGE is the system that closes this gap.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">What FORGE Tracks for Coaches</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Recovery State', desc: 'HRV, sleep quality, energy — the signals that determine coaching output quality' },
              { label: 'Business Health', desc: 'Monthly income/expense tracking, savings rate, and financial goal progress' },
              { label: 'Alignment Score', desc: 'Your word-kept rate — the same metric your clients need, applied to yourself' },
              { label: 'Goal Architecture', desc: 'Your personal and professional goals, with progress tracking and key results' },
              { label: 'Habit Consistency', desc: 'The habits that sustain your performance — tracked honestly, not optimistically' },
              { label: 'Oracle AI Insights', desc: 'Cross-domain patterns: how your recovery state affects your coaching capacity' },
            ].map(({ label, desc }) => (
              <div key={label} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <p className="text-white text-sm font-semibold mb-1">{label}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">The Credibility Layer</h2>
          <p>
            Coaches who track their own Alignment Score and share their system with clients
            report a measurable increase in client accountability. When clients know their coach
            operates on the same framework, the accountability relationship becomes reciprocal.
          </p>
          <p className="mt-3">
            FORGE&apos;s local-first data model means you can share your tracking methodology
            without sharing your specific data. The system is visible; the numbers stay private.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">For Personal Trainers, Life Coaches, and Performance Coaches</h2>
          <ul className="space-y-2">
            {[
              'Track your own training load alongside client programming',
              'Monitor your recovery state — low HRV coaching produces inconsistent quality',
              'Log business financials separate from personal expenses',
              'Track the goals you set for yourself (not just for clients)',
              'Use Oracle\'s cross-domain analysis to understand your own patterns',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-zinc-700 rounded-lg p-6 bg-zinc-900/50">
          <p className="text-white font-medium mb-2">Your performance system — starting today</p>
          <p className="text-zinc-400 text-sm mb-4">
            Free. No account required. 3 minutes to set up.
            The same system you prescribe for others — for yourself.
          </p>
          <Link
            href="/setup"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      <footer className="mt-12 pt-8 border-t border-zinc-800">
        <p className="text-zinc-500 text-sm mb-3">Related:</p>
        <div className="flex gap-4 flex-wrap">
          <Link href="/for/athletes" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for Athletes</Link>
          <Link href="/for/high-performers" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for High Performers</Link>
          <Link href="/blog/hrv-tracking" className="text-orange-400 hover:text-orange-300 text-sm">HRV Tracking Guide</Link>
          <Link href="/blog/alignment-score" className="text-orange-400 hover:text-orange-300 text-sm">The Alignment Score</Link>
        </div>
      </footer>
    </main>
  )
}
