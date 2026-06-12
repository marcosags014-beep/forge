import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'FORGE vs Google Fit — Beyond Step Counting | FORGE',
  description: 'Google Fit tracks steps and heart rate. FORGE connects your health data to your habits, finances, and goals — with AI that finds the patterns and tells you what to do.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/vs/google-fit' },
  openGraph: {
    title: 'FORGE vs Google Fit — Beyond Step Counting',
    description: 'Google Fit counts steps. FORGE counts whether you are becoming who you intend to be.',
    type: 'article',
  },
}

const rows = [
  { feature: 'Step tracking (automatic)', gfit: '✓ (auto via phone/watch)', forge: '—' },
  { feature: 'Heart rate monitoring', gfit: '✓ (auto via wearable)', forge: 'Manual entry' },
  { feature: 'Sleep tracking', gfit: '✓ (via Wear OS)', forge: '✓ manual logging' },
  { feature: 'Activity recognition', gfit: '✓', forge: '—' },
  { feature: 'Google ecosystem integration', gfit: '✓', forge: '—' },
  { feature: 'HRV tracking', gfit: 'Limited', forge: '✓' },
  { feature: 'Energy + mood tracking', gfit: '—', forge: '✓' },
  { feature: 'Workout logging (detailed)', gfit: 'Basic', forge: '✓ full sets/reps' },
  { feature: 'Finance tracking', gfit: '—', forge: '✓' },
  { feature: 'Habit + goal tracking', gfit: '—', forge: '✓' },
  { feature: 'Cross-domain AI insights', gfit: '—', forge: '✓ Oracle AI' },
  { feature: 'Daily AI directive', gfit: '—', forge: '✓' },
  { feature: 'Alignment Score', gfit: '—', forge: '✓' },
  { feature: 'Data stays on device', gfit: '—', forge: '✓ local-first' },
  { feature: 'Free tier', gfit: '✓', forge: '✓ full access' },
]

export default function ForgeVsGoogleFit() {
  return (
    <>
      <ArticleJsonLd
        title="FORGE vs Google Fit — Beyond Step Counting"
        description="Google Fit tracks steps and heart rate. FORGE connects your health data to your habits, finances, and goals — with AI that finds the patterns and tells you what to do."
        url="https://forge-five-flax.vercel.app/vs/google-fit"
        datePublished="2026-01-01"
      />
      <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
        <header className="mb-10">
          <nav className="text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300">FORGE</Link>
            <span className="mx-2">›</span>
            <span>vs Google Fit</span>
          </nav>
          <p className="text-sm text-orange-400 font-medium mb-3">Comparison · Health</p>
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            FORGE vs Google Fit
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Google Fit is a health data aggregator — excellent at collecting metrics from
            your phone and wearables automatically. It cannot tell you what those metrics mean
            in the context of your habits, finances, and life goals.
          </p>
        </header>

        <section className="space-y-6 leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">What Google Fit Does Well</h2>
          <p>
            Google Fit is genuinely useful for passive health data collection. It tracks steps,
            heart points, and activity automatically via Android phones and Wear OS devices.
            The integration with the Google ecosystem (Calendar, Maps, etc.) makes it seamless
            for Android users who want baseline fitness metrics without manual logging.
          </p>
          <p>
            For people who want automatic tracking with zero effort, Google Fit is the
            obvious default for Android users — the same role Apple Health plays for iOS users.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Intelligence Gap</h2>
          <p>
            Google Fit shows you metrics in silos: steps, heart rate, sleep (if connected).
            It has no concept of how these interact with your financial behaviour, your habit
            completion rate, or your progress toward long-term goals.
          </p>
          <p>
            The data is there. The synthesis is not. You are still the intelligence layer —
            which means the data mostly goes unacted upon.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Feature Comparison</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 pr-4 text-zinc-400 font-medium">Feature</th>
                  <th className="text-center py-3 px-3 text-orange-400 font-medium">FORGE</th>
                  <th className="text-center py-3 px-3 text-zinc-400 font-medium">Google Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {rows.map(({ feature, forge, gfit }) => (
                  <tr key={feature}>
                    <td className="py-2.5 pr-4 text-zinc-400 text-xs">{feature}</td>
                    <td className="py-2.5 px-3 text-center text-orange-400 text-xs font-medium">{forge}</td>
                    <td className="py-2.5 px-3 text-center text-zinc-500 text-xs">{gfit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">When Google Fit Is Enough</h2>
          <p>
            If you want passive activity tracking integrated with your Android device and
            Google account — and you do not need cross-domain intelligence — Google Fit
            is a sensible free default. It is particularly useful as a data source
            for other apps.
          </p>
          <p>
            FORGE is the right choice when you want to understand what your health data
            means in context — when sleep and HRV are connected to your habit rate,
            your spending, and your goals, and you want an AI to surface those connections daily.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Running Both</h2>
          <p>
            Many Android users keep Google Fit for passive tracking (steps, activity recognition)
            and use FORGE for intentional daily logging (sleep quality, HRV, energy) and
            cross-domain intelligence. The manual logging in FORGE takes 60 seconds per day
            and provides the context that Google Fit cannot — because FORGE knows your habits,
            goals, and finances, not just your heart rate.
          </p>

          <div className="border border-zinc-700 rounded-lg p-6 mt-10 bg-zinc-900/50">
            <p className="text-white font-medium mb-2">Add the intelligence layer — free</p>
            <p className="text-zinc-400 text-sm mb-4">
              FORGE works alongside any health tracker. Log what matters in 60 seconds.
              Oracle AI connects your health data to everything else.
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
            <Link href="/blog/google-fit-alternative" className="text-orange-400 hover:text-orange-300 text-sm">Google Fit Alternatives</Link>
            <Link href="/blog/health-tracking-app" className="text-orange-400 hover:text-orange-300 text-sm">Best Health Tracking App</Link>
            <Link href="/blog/fitness-tracker-app" className="text-orange-400 hover:text-orange-300 text-sm">Best Fitness Tracker App</Link>
          </div>
        </footer>
      </main>
    </>
  )
}
