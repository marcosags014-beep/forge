import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'FORGE vs MyFitnessPal — Which Tracks More Than Calories? | FORGE',
  description: 'MyFitnessPal tracks what you eat. FORGE connects your nutrition to your sleep, HRV, finances, and habits — and tells you what it all means with AI.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/vs/myfitnesspal' },
  openGraph: {
    title: 'FORGE vs MyFitnessPal — Which Tracks More Than Calories?',
    description: 'Calorie counting is a solved problem. Cross-domain nutrition intelligence is not. Here\'s the difference.',
    type: 'article',
  },
}

const rows = [
  { feature: 'Calorie tracking', mfp: '✓ (with barcode scan)', forge: 'Manual macro logging' },
  { feature: 'Macro tracking (P/C/F)', mfp: '✓', forge: '✓' },
  { feature: 'Food database', mfp: '14M+ foods', forge: 'Manual entry (no database)' },
  { feature: 'Recipe builder', mfp: '✓', forge: '—' },
  { feature: 'Restaurant foods', mfp: '✓', forge: '—' },
  { feature: 'Sleep + HRV tracking', mfp: '—', forge: '✓' },
  { feature: 'Workout + fitness tracking', mfp: 'Basic logging', forge: '✓ full workout logging' },
  { feature: 'Finance tracking', mfp: '—', forge: '✓' },
  { feature: 'Habit + goal tracking', mfp: '—', forge: '✓' },
  { feature: 'Nutrition ↔ sleep AI patterns', mfp: '—', forge: '✓ Oracle AI' },
  { feature: 'Nutrition ↔ performance correlation', mfp: '—', forge: '✓ Oracle AI' },
  { feature: 'Cross-domain daily directive', mfp: '—', forge: '✓ Oracle AI' },
  { feature: 'Data stays on device', mfp: '—', forge: '✓ local-first' },
  { feature: 'Free tier', mfp: '✓ (limited macros)', forge: '✓ full access' },
  { feature: 'Price', mfp: '$19.99/mo or $79.99/yr', forge: 'Free / €9.99/mo' },
]

export default function ForgeVsMyFitnessPal() {
  return (
    <>
      <ArticleJsonLd
        title="FORGE vs MyFitnessPal — Which Tracks More Than Calories?"
        description="MyFitnessPal tracks what you eat. FORGE connects your nutrition to your sleep, HRV, finances, and habits — and tells you what it all means with AI."
        url="https://forge-five-flax.vercel.app/vs/myfitnesspal"
        datePublished="2026-01-01"
      />
      <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
        <header className="mb-10">
          <nav className="text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300">FORGE</Link>
            <span className="mx-2">›</span>
            <span>vs MyFitnessPal</span>
          </nav>
          <p className="text-sm text-orange-400 font-medium mb-3">Comparison · Nutrition</p>
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            FORGE vs MyFitnessPal
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            MyFitnessPal built the best calorie counter on the planet. It cannot tell you why your
            protein intake collapses every time your sleep quality drops. FORGE can.
          </p>
        </header>

        <section className="space-y-6 leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">What MyFitnessPal Does Exceptionally Well</h2>
          <p>
            MyFitnessPal has a 14-million-item food database, barcode scanning, restaurant menus,
            and a community of millions. If your goal is calorie accuracy and macro precision,
            nothing beats it on those specific metrics.
          </p>
          <p>
            It also has a 20-year head start. The database and community moat is real.
            For strict calorie counting, MyFitnessPal remains the reference tool.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Nutrition Problem MFP Cannot Solve</h2>
          <p>
            Nutrition behaviour is not a knowledge problem. Most people who use MyFitnessPal for
            more than a few months already know what they should eat. They still have months where
            the tracking falls apart, protein goals are missed, and eating drifts toward comfort food.
          </p>
          <p>
            The reason is predictable: sleep quality. When HRV drops and sleep is fragmented,
            appetite hormones shift — ghrelin rises, leptin falls, and impulse control degrades.
            The result is consistent: high-fatigue weeks produce low-protein, high-carbohydrate eating.
          </p>
          <p>
            MyFitnessPal shows you the calories. It cannot show you the driver.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">What FORGE Does Instead</h2>
          <p>
            FORGE tracks nutrition as one of six modules — alongside health (sleep, HRV), body
            (workouts), wealth (finances), mind (habits, journal), and goals. Oracle AI reads all
            six simultaneously and surfaces the correlations.
          </p>
          <p>
            When your protein intake is low, Oracle can tell you whether it's coinciding with
            low energy days, poor sleep weeks, or financial stress. That changes the intervention.
            "Hit your macros" is not useful advice when the root cause is a recovery deficit.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Feature Comparison</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 pr-4 text-zinc-400 font-medium">Feature</th>
                  <th className="text-center py-3 px-3 text-orange-400 font-medium">FORGE</th>
                  <th className="text-center py-3 px-3 text-zinc-400 font-medium">MyFitnessPal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {rows.map(({ feature, forge, mfp }) => (
                  <tr key={feature}>
                    <td className="py-2.5 pr-4 text-zinc-400 text-xs">{feature}</td>
                    <td className="py-2.5 px-3 text-center text-orange-400 text-xs font-medium">{forge}</td>
                    <td className="py-2.5 px-3 text-center text-zinc-500 text-xs">{mfp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">When MyFitnessPal Is the Right Choice</h2>
          <p>
            If your priority is calorie precision — meal prep planning, eating disorder recovery
            support, competition prep, or clinical nutrition tracking — MyFitnessPal's database
            depth is unmatched. For detailed nutritional analysis, it wins.
          </p>
          <p>
            FORGE is the right choice when you want to understand how your nutrition fits into
            the bigger picture: whether your eating patterns are affected by sleep, stress, or
            training load — and what to do about it today.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Case for Using Both</h2>
          <p>
            FORGE and MyFitnessPal are not direct competitors. MyFitnessPal is a food database
            and calorie counter. FORGE is a life intelligence system that happens to include
            nutrition logging.
          </p>
          <p>
            Some users track in MyFitnessPal for accuracy, then log the macro totals in FORGE
            so Oracle can see the connection to their other data. If you already have a MFP
            habit, that workflow costs you 30 seconds per day.
          </p>

          <div className="border border-zinc-700 rounded-lg p-6 mt-10 bg-zinc-900/50">
            <p className="text-white font-medium mb-2">See nutrition in context — free</p>
            <p className="text-zinc-400 text-sm mb-4">
              FORGE connects your macros to your sleep, HRV, workouts, habits, and finances.
              Oracle tells you what it all means. No barcode scanner required.
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
            <Link href="/vs/notion" className="text-orange-400 hover:text-orange-300 text-sm">FORGE vs Notion</Link>
            <Link href="/vs/ynab" className="text-orange-400 hover:text-orange-300 text-sm">FORGE vs YNAB</Link>
            <Link href="/blog/myfitnesspal-alternative" className="text-orange-400 hover:text-orange-300 text-sm">MyFitnessPal Alternatives</Link>
            <Link href="/blog/biohacker-app" className="text-orange-400 hover:text-orange-300 text-sm">Best Biohacker App</Link>
          </div>
        </footer>
      </main>
    </>
  )
}
