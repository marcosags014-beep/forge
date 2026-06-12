import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE for High Performers — The Life OS for People Who Demand Results | FORGE',
  description: 'High performers do not leave outcomes to chance. FORGE gives you the data infrastructure to optimise health, wealth, habits, and goals — with AI that connects the dots.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/high-performers' },
  openGraph: {
    title: 'FORGE for High Performers — The Life OS for People Who Demand Results',
    description: 'You optimise everything else. FORGE helps you optimise the system that drives all of it: you.',
    type: 'website',
  },
}

export default function ForHighPerformersPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-10">
        <nav className="text-sm text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-300">FORGE</Link>
          <span className="mx-2">›</span>
          <span>For High Performers</span>
        </nav>
        <p className="text-sm text-orange-400 font-medium mb-3">Performance · Systems</p>
        <h1 className="text-3xl font-bold text-white leading-tight mb-4">
          FORGE for High Performers
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          High performers understand systems, leverage, and measurement. Most apply this
          thinking to their work and almost none of it to themselves. FORGE gives you the
          same rigour for your life that you bring to your highest-stakes work.
        </p>
      </header>

      <section className="space-y-8 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">The Problem With Generic Productivity Advice</h2>
          <p>
            "Wake up at 5am. Journal for 20 minutes. Cold shower. Meditate." This advice
            is not designed for people who are already operating at high output. It is designed
            for people who are not doing anything.
          </p>
          <p>
            High performers need something different: a feedback system that measures the
            gap between their intentions and execution, identifies cross-domain bottlenecks,
            and delivers one clear, data-driven recommendation — not a morning routine template.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">What FORGE Measures for High Performers</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Alignment Score', desc: 'Your word-kept rate — the gap between commitments and execution' },
              { label: 'Life Score', desc: 'Health + Body + Wealth + Mind — one composite daily number' },
              { label: 'HRV Trend', desc: 'Leading indicator of cognitive and physical readiness' },
              { label: 'Goal Progress', desc: 'Long-term goals with % complete and deadline proximity' },
              { label: 'Habit Consistency', desc: 'Which habits are building identity vs which are slipping' },
              { label: 'Wealth Trajectory', desc: 'Monthly cash flow trend and savings rate over time' },
            ].map(({ label, desc }) => (
              <div key={label} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <p className="text-white text-sm font-semibold mb-1">{label}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">The Alignment Score: The Metric That Matters Most</h2>
          <p>
            High performers often discover that their biggest leverage point is not optimising
            performance — it is closing the gap between what they say they will do and what
            they actually do.
          </p>
          <p>
            The Alignment Score in FORGE measures this precisely: every commitment made,
            every habit set, tracked against execution. Most people who measure this for
            the first time are below 60% — not because they are underperforming, but because
            no system was counting before.
          </p>
          <p>
            Moving from 55% to 80% alignment has a more reliable impact on output than
            any productivity hack. It is a fundamentally different lever.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Oracle: The Intelligence Layer</h2>
          <p>
            High performers do not need reminders. They need intelligence — specific,
            data-driven observations about their own patterns that they could not see
            without cross-domain analysis.
          </p>
          <p>
            Oracle AI in FORGE reads all six modules simultaneously. The insight is not
            generic: it is built from your specific numbers, your specific patterns,
            your specific goals. It surfaces the leverage point you are currently missing —
            not a list of productivity tips.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">What High Performers Use FORGE For</h2>
          <ul className="space-y-3">
            {[
              { title: 'Daily performance baseline', body: 'HRV + sleep + energy logged in 60 seconds. Compared against 30-day averages.' },
              { title: 'Weekly system review', body: 'AI Weekly Review synthesises your week across all domains. Identifies what to protect and what to change.' },
              { title: 'Commitment accountability', body: 'Every task is a commitment with a timestamp. Alignment Score makes the execution gap visible and actionable.' },
              { title: 'Goal architecture', body: 'Long-term goals with progress tracking, key results, and deadlines — connected to daily habit completion rates.' },
            ].map(({ title, body }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="text-orange-400 font-bold mt-0.5 flex-shrink-0">→</span>
                <div>
                  <span className="text-white font-medium">{title}:</span>{' '}
                  <span className="text-zinc-400">{body}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Setup: Under 3 Minutes</h2>
          <p>
            FORGE is designed for people who have no time to waste on system design.
            No template to build, no database to configure, no morning routine to redesign.
            Log your data in 60 seconds per day. Oracle does the synthesis. You execute.
          </p>
        </div>

        <div className="border border-zinc-700 rounded-lg p-6 bg-zinc-900/50">
          <p className="text-white font-medium mb-2">The life OS built for people who take performance seriously</p>
          <p className="text-zinc-400 text-sm mb-4">
            Free. No account required. 3 minutes to set up. Your data stays on your device.
            Oracle AI does the cross-domain analysis — you just execute.
          </p>
          <Link
            href="/setup"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            Build Your Performance System →
          </Link>
        </div>
      </section>

      <footer className="mt-12 pt-8 border-t border-zinc-800">
        <p className="text-zinc-500 text-sm mb-3">Related:</p>
        <div className="flex gap-4 flex-wrap">
          <Link href="/for/founders" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for Founders</Link>
          <Link href="/for/athletes" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for Athletes</Link>
          <Link href="/for/executives" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for Executives</Link>
          <Link href="/blog/alignment-score" className="text-orange-400 hover:text-orange-300 text-sm">The Alignment Score</Link>
          <Link href="/blog/decision-fatigue" className="text-orange-400 hover:text-orange-300 text-sm">Decision Fatigue</Link>
        </div>
      </footer>
    </main>
  )
}
