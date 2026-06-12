import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'FORGE vs Strong App — Workout Tracker vs Life OS | FORGE',
  description: 'Strong App tracks your sets and reps perfectly. FORGE connects your training to your sleep, HRV, finances, and goals — and uses AI to tell you what actually drives performance.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/vs/strong-app' },
  openGraph: {
    title: 'FORGE vs Strong App — Workout Tracker vs Life OS',
    description: 'Strong is the best gym log. FORGE is what you need when the gym is just one part of the system.',
    type: 'article',
  },
}

const rows = [
  { feature: 'Exercise logging (sets/reps/weight)', strong: '✓ (best-in-class)', forge: '✓' },
  { feature: 'Workout volume tracking', strong: '✓', forge: '✓' },
  { feature: 'PR tracking + history', strong: '✓', forge: '✓' },
  { feature: 'Exercise library + custom exercises', strong: '✓ (1400+)', forge: '✓ custom' },
  { feature: 'Rest timer', strong: '✓', forge: '—' },
  { feature: 'Workout templates / programs', strong: '✓', forge: '—' },
  { feature: 'Apple Watch / Wear OS', strong: '✓', forge: '—' },
  { feature: 'Sleep + HRV tracking', strong: '—', forge: '✓' },
  { feature: 'Recovery readiness score', strong: '—', forge: '✓' },
  { feature: 'Nutrition tracking', strong: '—', forge: '✓' },
  { feature: 'Finance tracking', strong: '—', forge: '✓' },
  { feature: 'Habit + goal tracking', strong: '—', forge: '✓' },
  { feature: 'Cross-domain AI (training + sleep)', strong: '—', forge: '✓ Oracle AI' },
  { feature: 'Daily performance directive', strong: '—', forge: '✓ Oracle AI' },
  { feature: 'Data stays on device', strong: '—', forge: '✓ local-first' },
  { feature: 'Free tier', strong: '✓ (limited)', forge: '✓ full access' },
  { feature: 'Price', strong: '$14.99/mo or $149.99 lifetime', forge: 'Free / €9.99/mo' },
]

export default function ForgeVsStrongApp() {
  return (
    <>
      <ArticleJsonLd
        title="FORGE vs Strong App — Workout Tracker vs Life OS"
        description="Strong App tracks your sets and reps perfectly. FORGE connects your training to your sleep, HRV, finances, and goals — and uses AI to tell you what actually drives performance."
        url="https://forge-five-flax.vercel.app/vs/strong-app"
        datePublished="2026-01-01"
      />
      <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
        <header className="mb-10">
          <nav className="text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300">FORGE</Link>
            <span className="mx-2">›</span>
            <span>vs Strong App</span>
          </nav>
          <p className="text-sm text-orange-400 font-medium mb-3">Comparison · Fitness</p>
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            FORGE vs Strong App
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Strong is the best gym logger ever built. It also only knows you exist when you
            are in the gym. FORGE tracks what happens the other 23 hours — and connects it
            to your performance.
          </p>
        </header>

        <section className="space-y-6 leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Strong Is Genuinely Best-in-Class at What It Does</h2>
          <p>
            Strong App is the reference standard for gym logging. The exercise library, plate
            calculator, rest timers, PR tracking, and volume analysis are all excellent.
            If you are in the gym and you want to log a set, Strong is the fastest and cleanest
            tool for that specific job.
          </p>
          <p>
            There is a reason it has held the top position in gym tracking for years.
            It does one thing, and it does it better than anyone.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Problem Strong Cannot See</h2>
          <p>
            Performance in the gym is not determined in the gym. It is determined the night before —
            by sleep quality, HRV, recovery status, and the cumulative training load from the
            previous week. Strong has none of this data. It sees the numbers you lift.
            It cannot see why those numbers are what they are today.
          </p>
          <p>
            The result: Strong users have detailed workout logs and no way to connect them
            to recovery. When performance drops, they increase training volume — which is
            often the opposite of what the data would recommend.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">What Cross-Domain Training Intelligence Looks Like</h2>
          <p>
            FORGE tracks workout volume alongside HRV and sleep quality. Within weeks, a
            pattern emerges: there is a predictable HRV threshold below which strength
            performance degrades by 8-15%. Training above it produces adaptation.
            Training below it produces fatigue accumulation.
          </p>
          <p>
            Oracle in FORGE surfaces this as a specific observation: "Your HRV is at 52ms
            — 11% below your 30-day average. Your last two sessions at this level
            produced below-target volume. Today is a recovery or technique day."
          </p>
          <p>
            Strong cannot tell you this. It does not have the HRV data. It does not have
            the recovery context. It has your sets and reps.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Feature Comparison</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 pr-4 text-zinc-400 font-medium">Feature</th>
                  <th className="text-center py-3 px-3 text-orange-400 font-medium">FORGE</th>
                  <th className="text-center py-3 px-3 text-zinc-400 font-medium">Strong App</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {rows.map(({ feature, forge, strong }) => (
                  <tr key={feature}>
                    <td className="py-2.5 pr-4 text-zinc-400 text-xs">{feature}</td>
                    <td className="py-2.5 px-3 text-center text-orange-400 text-xs font-medium">{forge}</td>
                    <td className="py-2.5 px-3 text-center text-zinc-500 text-xs">{strong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">When Strong Is Still the Right Answer</h2>
          <p>
            If you are a serious lifter who needs the best possible interface for tracking
            complex programs — periodized strength work, powerlifting cycles, bodybuilding splits —
            Strong's dedicated gym features are superior to FORGE's workout logging.
            The rest timer, plate calculator, and exercise history are optimized for exactly that use case.
          </p>
          <p>
            FORGE is the right choice when the gym is one part of a broader performance system —
            when you want your training data connected to your recovery, sleep, habits, and goals
            in a way that produces a daily recommendation, not just a PR log.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Case for Using Both</h2>
          <p>
            Some athletes log workouts in Strong for its superior gym interface, then record
            the key metrics (volume, intensity, session RPE) in FORGE for cross-domain analysis.
            If you already have a Strong habit, this dual-logging workflow is worth the 2 minutes.
          </p>

          <div className="border border-zinc-700 rounded-lg p-6 mt-10 bg-zinc-900/50">
            <p className="text-white font-medium mb-2">Connect your training to everything else — free</p>
            <p className="text-zinc-400 text-sm mb-4">
              FORGE tracks workouts alongside sleep, HRV, nutrition, finances, and goals.
              Oracle tells you what your training data means today.
            </p>
            <Link
              href="/setup"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              Try FORGE Free →
            </Link>
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm mb-3">Related comparisons:</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/vs/apple-health" className="text-orange-400 hover:text-orange-300 text-sm">FORGE vs Apple Health</Link>
            <Link href="/vs/myfitnesspal" className="text-orange-400 hover:text-orange-300 text-sm">FORGE vs MyFitnessPal</Link>
            <Link href="/blog/whoop-alternative" className="text-orange-400 hover:text-orange-300 text-sm">Whoop Alternatives</Link>
            <Link href="/blog/oura-alternative" className="text-orange-400 hover:text-orange-300 text-sm">Oura Ring Alternatives</Link>
            <Link href="/for/athletes" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for Athletes</Link>
          </div>
        </footer>
      </main>
    </>
  )
}
