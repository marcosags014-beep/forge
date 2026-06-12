import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'FORGE vs Strava — Beyond the Athletic Performance Tracker | FORGE',
  description: 'Strava tracks your runs and rides. FORGE connects your training to your sleep, recovery, finances, and goals — with AI that tells you what your data actually means.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/vs/strava' },
  openGraph: {
    title: 'FORGE vs Strava — Beyond the Athletic Performance Tracker',
    description: 'Strava shows what you did. FORGE tells you what you should do — and why.',
    type: 'article',
  },
}

const rows = [
  { feature: 'GPS route tracking', strava: '✓ (best-in-class)', forge: '—' },
  { feature: 'Activity segments / KOMs', strava: '✓', forge: '—' },
  { feature: 'Social feed + Kudos', strava: '✓', forge: '—' },
  { feature: 'Training load analysis', strava: '✓ (Premium)', forge: 'Manual RPE' },
  { feature: 'Fitness + Freshness graph', strava: '✓ (Premium)', forge: '—' },
  { feature: 'Workout logging (strength)', strava: 'Limited', forge: '✓' },
  { feature: 'HRV tracking', strava: 'Via wearable import only', forge: '✓ manual + wearable' },
  { feature: 'Sleep quality tracking', strava: '—', forge: '✓' },
  { feature: 'Recovery readiness score', strava: 'Via Whoop/Garmin only', forge: '✓ built-in' },
  { feature: 'Nutrition tracking', strava: '—', forge: '✓' },
  { feature: 'Finance tracking', strava: '—', forge: '✓' },
  { feature: 'Habit + goal tracking', strava: '—', forge: '✓' },
  { feature: 'Cross-domain AI insights', strava: '—', forge: '✓ Oracle AI' },
  { feature: 'Daily directive', strava: '—', forge: '✓ Oracle AI' },
  { feature: 'Data stays on device', strava: '—', forge: '✓ local-first' },
  { feature: 'Free tier', strava: '✓ (limited)', forge: '✓ full access' },
  { feature: 'Price', strava: '$7.99/mo or $59.99/yr', forge: 'Free / €9.99/mo' },
]

export default function ForgeVsStrava() {
  return (
    <>
      <ArticleJsonLd
        title="FORGE vs Strava — Beyond the Athletic Performance Tracker"
        description="Strava tracks your runs and rides. FORGE connects your training to your sleep, recovery, finances, and goals — with AI that tells you what your data actually means."
        url="https://forge-five-flax.vercel.app/vs/strava"
        datePublished="2026-01-01"
      />
      <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
        <header className="mb-10">
          <nav className="text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300">FORGE</Link>
            <span className="mx-2">›</span>
            <span>vs Strava</span>
          </nav>
          <p className="text-sm text-orange-400 font-medium mb-3">Comparison · Athletics</p>
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            FORGE vs Strava
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Strava built the best athletic tracking community on the planet. It still cannot tell you
            that your performance drop this week correlates with your sleep degradation — or that
            both correlate with your financial stress. That requires different data.
          </p>
        </header>

        <section className="space-y-6 leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">What Strava Gets Right</h2>
          <p>
            Strava's core strength is GPS-based activity tracking with social accountability.
            The segments feature, KOM/QOM system, and community feed create genuine motivation
            for outdoor athletes. For runners and cyclists specifically, Strava's route tracking
            and performance analysis are the best available.
          </p>
          <p>
            Premium's Fitness and Freshness graph — which models acute training load against
            chronic training load — is genuinely useful for periodisation planning.
            If you are training for a race, that tool alone is worth the subscription.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Performance Gap Strava Cannot Fill</h2>
          <p>
            Strava sees your activities. It cannot see what happens between them — the sleep
            that determines whether adaptation occurs, the stress that determines whether
            you recover, or the nutrition that determines whether you have energy to train.
          </p>
          <p>
            The result is that Strava users have detailed training logs and no way to diagnose
            why their performance varies. They push harder when they should rest.
            They rest when their data would suggest they are ready to push.
            The missing context is always the same: recovery state.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">What Cross-Domain Athletic Intelligence Looks Like</h2>
          <p>
            FORGE tracks HRV, sleep quality, and training volume simultaneously. The pattern
            that emerges across athletes: there is a predictable HRV threshold below which
            training produces fatigue accumulation rather than adaptation.
          </p>
          <p>
            Oracle in FORGE reads this pattern and surfaces it specifically: "HRV at 48ms —
            below your 30-day average of 58ms. Your last three sessions at this level
            produced below-average performance. Today: active recovery or rest."
          </p>
          <p>
            Strava cannot make this call. It has the activity data. It does not have the
            recovery data — and the two must be read together.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Feature Comparison</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 pr-4 text-zinc-400 font-medium">Feature</th>
                  <th className="text-center py-3 px-3 text-orange-400 font-medium">FORGE</th>
                  <th className="text-center py-3 px-3 text-zinc-400 font-medium">Strava</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {rows.map(({ feature, forge, strava }) => (
                  <tr key={feature}>
                    <td className="py-2.5 pr-4 text-zinc-400 text-xs">{feature}</td>
                    <td className="py-2.5 px-3 text-center text-orange-400 text-xs font-medium">{forge}</td>
                    <td className="py-2.5 px-3 text-center text-zinc-500 text-xs">{strava}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">When Strava Is the Right Answer</h2>
          <p>
            Strava is the right tool when social accountability, GPS route tracking, and segment
            competition are your primary motivators. For outdoor endurance athletes — runners,
            cyclists, triathletes — Strava's community and tracking are unmatched.
          </p>
          <p>
            FORGE is the right tool when you want to understand your performance in context —
            when the training log is one piece of a larger system that includes recovery,
            nutrition, habits, and goals.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Case for Running Both</h2>
          <p>
            Many athletes track GPS activities in Strava (for route analysis and community),
            then log the key recovery metrics in FORGE — HRV, sleep, energy. This dual-logging
            approach costs about 60 seconds per day and gives you the best of both:
            Strava's training history and FORGE's recovery intelligence.
          </p>

          <div className="border border-zinc-700 rounded-lg p-6 mt-10 bg-zinc-900/50">
            <p className="text-white font-medium mb-2">Train smarter — not just harder</p>
            <p className="text-zinc-400 text-sm mb-4">
              Free. No wearable required. FORGE connects your training to your recovery,
              nutrition, and goals — Oracle tells you what it all means today.
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
            <Link href="/vs/strong-app" className="text-orange-400 hover:text-orange-300 text-sm">FORGE vs Strong App</Link>
            <Link href="/blog/whoop-alternative" className="text-orange-400 hover:text-orange-300 text-sm">Whoop Alternatives</Link>
            <Link href="/blog/oura-alternative" className="text-orange-400 hover:text-orange-300 text-sm">Oura Alternatives</Link>
            <Link href="/for/athletes" className="text-orange-400 hover:text-orange-300 text-sm">FORGE for Athletes</Link>
          </div>
        </footer>
      </main>
    </>
  )
}
