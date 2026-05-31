import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Personal Finance Tracker That Connects to Your Health | FORGE',
  description: 'Why track money in isolation? FORGE connects your cash flow to your sleep, HRV, and stress levels — and shows you the patterns that cost you most.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/blog/personal-finance-tracker' },
  openGraph: {
    title: 'The Personal Finance Tracker That Connects to Your Health',
    description: 'Your worst spending weeks follow your lowest sleep weeks. Not because you\'re undisciplined — because no app was showing you the connection.',
    type: 'article',
  },
}

export default function PersonalFinanceTrackerPage() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-10">
        <p className="text-sm text-orange-400 font-medium mb-3">Wealth · Behaviour</p>
        <h1 className="text-3xl font-bold text-white leading-tight mb-4">
          The Personal Finance Tracker That Connects to Your Health
        </h1>
        <p className="text-zinc-400 text-lg">
          Your worst spending weeks follow your lowest sleep weeks. Not because you&apos;re
          undisciplined — because no app was showing you the connection.
        </p>
      </header>

      <section className="space-y-6 leading-relaxed">
        <p>
          Every serious personal finance app — YNAB, Copilot, Monarch Money — operates on
          the same assumption: your spending behaviour is primarily a financial problem.
          Track your transactions, set budgets, review categories, adjust behaviour.
        </p>

        <p>
          This is partially true and mostly insufficient.
        </p>

        <p>
          After tracking both health metrics and financial data simultaneously for months,
          a pattern emerged that no financial app could have shown: low HRV weeks and
          high discretionary spending weeks overlapped with unusual consistency. Not
          occasionally. Reliably, within 24-48 hours.
        </p>

        <h2 className="text-xl font-semibold text-white mt-10 mb-4">Why Sleep Drives Spending</h2>

        <p>
          Sleep deprivation and stress elevate cortisol. Elevated cortisol drives
          reward-seeking behaviour — impulsive purchases, comfort eating, subscription
          upgrades you don&apos;t need. This isn&apos;t a willpower problem. It&apos;s a physiological
          response that your budget app is completely blind to.
        </p>

        <p>
          HRV (Heart Rate Variability) is the clearest signal of this state. When your
          HRV drops, your nervous system is in recovery mode. Your brain is doing whatever
          it can to reduce stress — including short-term reward behaviours that cost you money.
        </p>

        <p>
          The practical result: if you&apos;re trying to improve your financial behaviour
          through budgeting alone, you&apos;re treating the symptom. The cause is upstream.
        </p>

        <h2 className="text-xl font-semibold text-white mt-10 mb-4">What Cross-Domain Finance Tracking Looks Like</h2>

        <p>
          FORGE tracks four domains simultaneously: Health (sleep, HRV, energy), Body
          (workouts, nutrition), Wealth (transactions, cash flow, net balance), and Mind
          (goals, habits, tasks).
        </p>

        <p>
          The Oracle AI layer cross-references all four. When your HRV drops while your
          training load is high and your cash flow goes negative, Oracle doesn&apos;t just
          flag the budget — it tells you: &quot;Stress spending risk is elevated this week.
          Your HRV is at 42ms (down 19% from your baseline) and training load peaked
          Tuesday. Consider these the same problem.&quot;
        </p>

        <p>That&apos;s a different kind of financial insight.</p>

        <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Wealth Domain in FORGE</h2>

        <p>FORGE&apos;s Wealth module tracks:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Income transactions (one-time and recurring)</li>
          <li>Expenses by category</li>
          <li>Net cash flow (weekly and monthly)</li>
          <li>Net balance over time</li>
        </ul>

        <p>
          The Wealth score is calculated from your cash flow trend. Positive cash flow
          and growing net balance = higher score. The score is one input into the Life Score,
          alongside Health, Body, and Mind — so you can see immediately when one domain
          is pulling everything else down.
        </p>

        <p>
          More importantly, Oracle can see when your financial state affects your other
          domains. High financial stress correlates with lower sleep quality, lower workout
          consistency, and higher task abandonment rates. These aren&apos;t coincidences —
          they&apos;re system patterns.
        </p>

        <h2 className="text-xl font-semibold text-white mt-10 mb-4">Why Isolation Is Costing You</h2>

        <p>
          YNAB is excellent at what it does. So is Copilot. The problem isn&apos;t the tool —
          it&apos;s that financial behaviour doesn&apos;t happen in a financial vacuum.
        </p>

        <p>
          Your spending decisions are made by a version of you that is tired or rested,
          stressed or calm, in recovery or at peak performance. Budget categories can&apos;t
          capture this. Transaction histories can&apos;t diagnose it. You need a system
          that sees both your biology and your finances at the same time.
        </p>

        <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Data That Changes Behaviour</h2>

        <p>
          The most behaviour-changing financial insight isn&apos;t &quot;you spent £340 on
          restaurants last month.&quot; It&apos;s &quot;you spent £340 on restaurants last month,
          and your HRV averaged 38ms in the weeks you overspent — versus 55ms in
          the weeks you stayed on track.&quot;
        </p>

        <p>
          That&apos;s a pattern you can actually do something about. Protect your sleep,
          manage your training load, and your spending improves automatically.
          The cause changes the effect.
        </p>

        <div className="border border-zinc-700 rounded-lg p-6 mt-10 bg-zinc-900/50">
          <p className="text-white font-medium mb-2">Track money alongside everything else</p>
          <p className="text-zinc-400 text-sm mb-4">
            FORGE is free. No account needed. Your financial data never leaves your device.
            The AI finds the patterns your financial app can&apos;t.
          </p>
          <a
            href="https://forge-five-flax.vercel.app"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Open FORGE →
          </a>
        </div>
      </section>

      <footer className="mt-12 pt-8 border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">More from the FORGE blog:</p>
        <div className="flex gap-4 mt-3 flex-wrap">
          <Link href="/blog/hrv-tracking" className="text-orange-400 hover:text-orange-300 text-sm">HRV Tracking</Link>
          <Link href="/blog/decision-fatigue" className="text-orange-400 hover:text-orange-300 text-sm">Decision Fatigue</Link>
          <Link href="/blog/alignment-score" className="text-orange-400 hover:text-orange-300 text-sm">Alignment Score</Link>
          <Link href="/blog/morning-routine-system" className="text-orange-400 hover:text-orange-300 text-sm">Morning Routine System</Link>
        </div>
      </footer>
    </article>
  )
}
