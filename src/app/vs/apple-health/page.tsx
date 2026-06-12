import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE vs Apple Health — Beyond Data Collection | FORGE',
  description: "Apple Health is the best health data aggregator available. FORGE is what you use when you want the data to actually change your behaviour. Here's how they differ.",
  alternates: { canonical: 'https://forge-five-flax.vercel.app/vs/apple-health' },
  openGraph: {
    title: 'FORGE vs Apple Health — Beyond Data Collection',
    description: 'Apple Health collects everything. FORGE tells you what to do with it. Very different jobs.',
    type: 'article',
  },
}

export default function ForgeVsAppleHealth() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-10">
        <p className="text-sm text-orange-400 font-medium mb-3">Comparison</p>
        <h1 className="text-3xl font-bold text-white leading-tight mb-4">
          FORGE vs Apple Health: Data Collection vs Directed Intelligence
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Apple Health is excellent at what it does: collecting health data from every possible source — Apple Watch, third-party apps, manual entry — and storing it in one place. What it does not do is tell you what the data means for how you should live today.
        </p>
      </header>

      <section className="space-y-6 leading-relaxed">
        <h2 className="text-xl font-semibold text-white">What Apple Health is built for</h2>
        <p>
          Apple Health is a data aggregator and health record repository. It connects to your Apple Watch, integrates with hundreds of third-party health apps, stores step counts, heart rate, blood oxygen, ECG data, sleep stages, and much more. It is the most comprehensive passive health data collector available for iPhone users.
        </p>
        <p>
          Its design philosophy is archival: store everything, let the user (or other apps) interpret it. The Health app itself provides some charts and weekly summaries, but it does not have an intelligence layer that synthesises your data into daily direction. It gives you the raw material. The decisions remain yours.
        </p>

        <h2 className="text-xl font-semibold text-white">The interpretation gap</h2>
        <p>
          Most Apple Health users have a large quantity of health data they rarely look at. The step count is there. The resting heart rate history is there. The sleep data is there. But none of it answers the question that actually matters on a given morning: given everything this data shows, what should I do differently today?
        </p>
        <p>
          That interpretation gap is where FORGE operates. Oracle AI reads your health data alongside your habits, financial state, and goals — and produces specific, contextual guidance based on the full picture. Not &quot;your sleep was 6.1 hours.&quot; But &quot;your sleep dropped to 6.1 hours for the third consecutive day while your workout volume peaked — this is an overreaching pattern that will compound unless you take a rest day today.&quot;
        </p>

        <h2 className="text-xl font-semibold text-white">Cross-domain context that Apple Health cannot provide</h2>
        <p>
          Apple Health knows your body. It does not know your financial stress, your goal commitments, your habit consistency, or how those factors interact with your physical state. FORGE tracks all of them in one system. Oracle AI can surface connections like: your spending spikes in weeks where your sleep score drops below 70. Your habit completion rate is lowest in weeks following high-stress financial events. These are the insights that change behaviour — and they require a system that sees the whole life, not just the physical dimension.
        </p>

        <h2 className="text-xl font-semibold text-white">Manual vs passive tracking</h2>
        <p>
          Apple Health shines with passive tracking — data collected automatically by your Apple Watch without any intentional action. FORGE is primarily manual: you log your sleep duration, energy, mood, and workouts intentionally. This is a genuine trade-off.
        </p>
        <p>
          The case for manual logging: the act of reflection that comes with intentional data entry builds self-awareness that passive tracking cannot. Many Oura Ring and Apple Watch users stop checking their health data within weeks of acquiring the hardware. The ritual of manual entry keeps you engaged with your data. Two minutes each morning — and you are paying attention to your body in a way passive tracking never requires.
        </p>
        <p>
          FORGE can also accept manual entry of Apple Health metrics (HRV, RHR, sleep) if you use a wearable. You get the best of both: Apple Watch for passive collection, FORGE for intelligent synthesis.
        </p>

        <h2 className="text-xl font-semibold text-white">Platform and privacy</h2>
        <p>
          Apple Health data stays on your device and in iCloud (if enabled), protected by Apple&apos;s encryption. This is genuinely excellent for privacy. FORGE is also local-first: all data stays in your browser by default, with optional cloud sync to your personal FORGE account. Neither product has a business model based on selling your health data.
        </p>
        <p>
          FORGE is cross-platform (any browser, including iPhone via PWA or Safari), while Apple Health is iOS/macOS only.
        </p>

        <h2 className="text-xl font-semibold text-white">Who should use what</h2>
        <p>
          Apple Health is not a competitor to FORGE — it is a data source. If you use an Apple Watch, keep using Apple Health. The data it collects is valuable.
        </p>
        <p>
          Use FORGE as the intelligence layer on top: log your key metrics manually each morning (or transfer them from Apple Health), and use Oracle AI to turn that data into directed daily action. The combination gives you Apple&apos;s collection breadth with FORGE&apos;s cross-domain intelligence.
        </p>
        <p>
          If you do not have an Apple Watch or prefer not to use health tracking hardware, FORGE&apos;s manual logging approach covers the key metrics that matter: sleep hours, energy level, HRV (from a free app and 60-second reading), and mood. Two minutes. All the signal that matters.
        </p>
      </section>

      <div className="mt-12 p-6 bg-zinc-900 border border-zinc-700 rounded-2xl text-center">
        <p className="text-white font-semibold text-lg mb-2">Turn your health data into daily direction.</p>
        <p className="text-zinc-400 text-sm mb-4">FORGE adds the intelligence layer that Apple Health is missing. Free — no account required.</p>
        <Link href="/setup" className="inline-block bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors">
          Start Free — No Account Required
        </Link>
      </div>
    </main>
  )
}
