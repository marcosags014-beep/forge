import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE for Parents — Track Your Health While Raising Kids | Life OS',
  description: 'Parents sacrifice their health metrics to raise their families. FORGE gives you a 60-second daily system to maintain your recovery, habits, and goals — even with limited time.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/parents' },
  openGraph: {
    title: 'FORGE for Parents — Track Your Health While Raising Kids',
    description: 'You cannot pour from an empty cup. 60 seconds per day. Here is the system for parents who want to stay on top of their own health and goals.',
    type: 'website',
  },
}

export default function ForParentsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-10">
        <nav className="text-sm text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-300">FORGE</Link>
          <span className="mx-2">›</span>
          <span>For Parents</span>
        </nav>
        <p className="text-sm text-orange-400 font-medium mb-3 uppercase tracking-wide">FORGE for</p>
        <h1 className="text-4xl font-bold text-white leading-tight mb-5">
          You cannot give what you don&apos;t have
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-6">
          Parenting is the highest-stakes performance challenge most people face. It is also the one
          that most consistently erodes the foundation it runs on: your sleep, your energy, your
          health, and your sense of self. FORGE is the 60-second system for parents who want to
          stay on top of all of it.
        </p>
        <Link href="/setup" className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors">
          Start Free — No Account Required
        </Link>
      </header>

      <section className="space-y-8 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">The Parent Health Paradox</h2>
          <p>
            Most parents know their children&apos;s health metrics better than their own.
            They track their kids&apos; sleep schedules, nutrition, screen time, and
            development — while ignoring their own HRV, their own sleep deficit, and
            the slow erosion of their own goals and identity.
          </p>
          <p className="mt-3">
            The irony: better-rested, better-fuelled, lower-stress parents are measurably
            better parents. Self-tracking is not selfish — it is infrastructure.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Why FORGE Works for Busy Parents</h2>
          <div className="space-y-3">
            {[
              {
                title: '60 seconds per day',
                body: 'FORGE is designed for people with no spare time. Log sleep quality, energy, HRV (optional), and one habit completion in under a minute. Oracle AI does the analysis — you just log.',
              },
              {
                title: 'No perfect days required',
                body: 'FORGE does not punish you for broken streaks. The Alignment Score measures your overall word-kept rate, not individual days. A day missed is just a data point — not a failure state.',
              },
              {
                title: 'Recovery-aware recommendations',
                body: 'When your HRV is low and your sleep is fragmented (which is common with young children), Oracle accounts for this. The recommendation changes: protect recovery, reduce commitments, manage expectations.',
              },
              {
                title: 'Goals that survive parenthood',
                body: 'Most goal systems collapse under parental life. FORGE tracks long-term goals with flexible deadlines and progress percentages — allowing goals to slow without disappearing entirely.',
              },
            ].map(({ title, body }) => (
              <div key={title} className="flex gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span>
                <div>
                  <p className="font-semibold text-white mb-1">{title}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">What Parents Track in FORGE</h2>
          <ul className="space-y-2">
            {[
              'Sleep hours and quality — the foundation of everything else',
              'Energy levels — track the pattern of your worst weeks',
              'HRV (optional) — the clearest signal of recovery state',
              'Daily habits — the 2-3 things that maintain your identity',
              'Monthly cash flow — financial stress is a primary parental stressor',
              'Long-term goals — kept alive even when progress slows',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-orange-400 mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">The Alignment Score for Parents</h2>
          <p>
            The most common thing parents discover when they first see their Alignment Score
            is that they have been keeping their commitments to everyone except themselves.
            They show up for their children, their partners, their employers — and consistently
            fail to show up for the habits and goals they set for themselves.
          </p>
          <p className="mt-3">
            The Alignment Score makes this visible without judgment. It is not about
            blame — it is about making the invisible visible so it can be addressed.
          </p>
        </div>

        <div className="border border-zinc-700 rounded-lg p-6 bg-zinc-900/50">
          <p className="text-white font-medium mb-2">Your system, ready in 3 minutes</p>
          <p className="text-zinc-400 text-sm mb-4">
            Free. No account. No complex setup. Log in 60 seconds per day.
            Oracle AI does the analysis — you focus on what matters.
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
          <Link href="/for/remote-workers" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for Remote Workers</Link>
          <Link href="/for/adhd" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for ADHD</Link>
          <Link href="/blog/consistency-system" className="text-orange-400 hover:text-orange-300 text-sm">Consistency System</Link>
          <Link href="/blog/alignment-score" className="text-orange-400 hover:text-orange-300 text-sm">The Alignment Score</Link>
        </div>
      </footer>
    </main>
  )
}
