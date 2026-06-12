import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE for Executives — Command Your Life, Not Just Your Calendar | FORGE',
  description: 'Senior leaders track their companies obsessively. Few track themselves with the same rigour. FORGE gives executives the same data-driven command over their personal performance.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/executives' },
  openGraph: {
    title: 'FORGE for Executives — Command Your Life, Not Just Your Calendar',
    description: 'You measure every KPI that matters for your business. Are you measuring the ones that drive your performance?',
    type: 'website',
  },
}

export default function ForExecutivesPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-10">
        <nav className="text-sm text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-300">FORGE</Link>
          <span className="mx-2">›</span>
          <span>For Executives</span>
        </nav>
        <p className="text-sm text-orange-400 font-medium mb-3">Leadership · Performance</p>
        <h1 className="text-3xl font-bold text-white leading-tight mb-4">
          FORGE for Executives
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          You review dashboards, track KPIs, and make data-driven decisions daily.
          Most executives apply zero of this rigour to their own performance.
          FORGE is the dashboard for the asset that drives every other outcome: you.
        </p>
      </header>

      <section className="space-y-8 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">The Executive Performance Problem</h2>
          <p>
            Senior leaders operate in conditions that systematically degrade performance:
            high cognitive load, chronic time pressure, fragmented sleep, irregular nutrition,
            and elevated cortisol. These are not complaints — they are measurable variables
            that predict decision quality.
          </p>
          <p>
            The irony: executives who would never make a major business decision without data
            routinely make decisions about their health, sleep, and energy based on feel.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">What FORGE Tracks for Executives</h2>
          <div className="space-y-4">
            {[
              {
                icon: '❤️',
                title: 'Recovery State',
                body: 'HRV, sleep quality, resting heart rate, energy. These predict cognitive performance better than caffeine intake or sleep hours alone. Know your actual readiness before critical meetings or decisions.',
              },
              {
                icon: '💰',
                title: 'Wealth Trajectory',
                body: 'Monthly cash flow, savings rate, net wealth projection. You track revenue and EBITDA — track your personal financial momentum with the same discipline.',
              },
              {
                icon: '🎯',
                title: 'Alignment Score',
                body: 'The gap between what you commit to and what you actually do. For executives, this is not just a personal metric — it is the foundation of your leadership credibility. Alignment score below 70% is a leadership problem, not a time management problem.',
              },
              {
                icon: '🧠',
                title: 'Cognitive Load Indicators',
                body: 'Mood, stress, journaling patterns. Oracle identifies when your cognitive state is in decline before it shows up in your work. The insight: when to delegate, when to push decisions, when to protect recovery time.',
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-semibold text-white mb-1">{title}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Oracle: Your Private Performance Advisor</h2>
          <p>
            Oracle AI reads your data across all six modules simultaneously and gives you
            one clear, data-specific insight every day. Not generic executive wellness advice —
            specific observations about your specific numbers:
          </p>
          <div className="my-6 p-5 rounded-xl border border-orange-500/20 bg-orange-500/5">
            <p className="text-zinc-300 text-sm leading-relaxed italic">
              &ldquo;Your HRV has dropped 18% over 9 days — concurrent with your Q4 planning cycle.
              Your decision quality typically degrades 24 hours after HRV falls below 52ms.
              You have three high-stakes calls this week. Protect tonight's sleep window.
              Single action: block 60 minutes this evening for your recovery protocol
              before the Thursday board session.&rdquo;
            </p>
          </div>
          <p>
            This is what your Chief of Staff cannot do for you — because this data is not in any
            calendar or report. It lives in your body. FORGE makes it visible.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Built for High-Complexity, Low-Time Environments</h2>
          <p>
            FORGE requires 60-90 seconds per day. No journaling rituals, no 30-minute morning reviews.
            Log your data, read Oracle's insight, execute. The system does the synthesis.
          </p>
          <p>
            All data is stored locally on your device — not on our servers. No vendor lock-in,
            no data sharing, no subscriptions required for core functionality.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">What Executives Track in FORGE</h2>
          <ul className="space-y-2">
            {[
              'Sleep quality and hours (connection to decision quality is direct and measurable)',
              'HRV — the most reliable leading indicator of cognitive and physical readiness',
              'Daily energy and mood (tracked over weeks, the patterns are unmistakable)',
              'Monthly cash flow and net worth trajectory',
              'Strategic goals with progress percentages and key results',
              'Daily commitments and Alignment Score (intention vs execution)',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-zinc-700 rounded-lg p-6 bg-zinc-900/50">
          <p className="text-white font-medium mb-2">Your performance dashboard — starting today</p>
          <p className="text-zinc-400 text-sm mb-4">
            Free. No account required. Set up in under 3 minutes.
            Your data stays on your device. Oracle gives you one insight per day —
            specific, actionable, and based on your actual numbers.
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
          <Link href="/for/founders" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for Founders</Link>
          <Link href="/for/entrepreneurs" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for Entrepreneurs</Link>
          <Link href="/blog/decision-fatigue" className="text-orange-400 hover:text-orange-300 text-sm">Decision Fatigue</Link>
          <Link href="/blog/alignment-score" className="text-orange-400 hover:text-orange-300 text-sm">Alignment Score</Link>
          <Link href="/blog/hrv-tracking" className="text-orange-400 hover:text-orange-300 text-sm">HRV Tracking</Link>
        </div>
      </footer>
    </main>
  )
}
