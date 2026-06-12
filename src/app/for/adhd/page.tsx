import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE for ADHD — Structure Without Shame | Life OS',
  description: 'Traditional productivity apps punish ADHD brains with streaks and missed reminders. FORGE gives you daily direction without judgment — free, local-first.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/adhd' },
  openGraph: {
    title: 'FORGE for ADHD — Structure Without Shame',
    description: 'A life OS built for brains that work differently. Daily direction, not daily judgment.',
    type: 'website',
  },
}

export default function ForADHD() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-12">
        <p className="text-sm text-orange-400 font-medium mb-3 uppercase tracking-wide">FORGE for</p>
        <h1 className="text-4xl font-bold text-white leading-tight mb-5">
          A productivity system that does not punish you for being human
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-6">
          Most apps are built for neurotypical consistency. Streak systems, daily reminders, and rigid schedules work until they do not — and then they work against you. FORGE is different: it gives you a daily directive based on where you actually are, not where you were supposed to be.
        </p>
        <Link href="/setup" className="inline-block bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors">
          Start Free — No Account Required
        </Link>
      </header>

      <section className="space-y-10">
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">The streak problem</h2>
          <p>
            ADHD brains are highly reward-sensitive. Streak systems exploit this until they do not — and when the streak breaks, the shame spiral that follows makes the next day harder, not easier. FORGE does not use streaks. It measures consistency over weeks and months, so one hard day does not erase what you built.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">One question: what do I do today?</h2>
          <p>
            Executive function is limited. Deciding what to do — from a list of infinite options — consumes the capacity you need to actually do it. Oracle AI reads your health, habits, goals, and recent patterns, then answers the question for you: here is what matters most right now. Stop deciding. Just do.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Recovery data changes the daily plan</h2>
          <p>
            ADHD symptoms are significantly worse when you are under-recovered. FORGE tracks your sleep, energy, and HRV alongside your goals. When your recovery is low, Oracle adjusts its recommendations — it does not ask you to sprint when you are running on empty.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Alignment Score: progress without perfectionism</h2>
          <p>
            The Alignment Score measures how well your week matched your intentions — across all six life domains. It gives you an honest read without punishing imperfection. An 80% alignment week is excellent. A 60% week still shows you where you showed up. The score is a tool, not a judgment.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Local-first means no friction</h2>
          <p>
            No account required. No onboarding survey. No subscription gate on day one. You open the app, enter what happened today, and get direction. FORGE runs entirely on your device — data stays local unless you choose to sync. Less friction means more days where you actually use it.
          </p>
        </div>
      </section>

      <div className="mt-14 p-6 bg-zinc-900 border border-zinc-700 rounded-2xl">
        <p className="text-white font-semibold text-lg mb-2">Built for humans who are not machines.</p>
        <p className="text-zinc-400 text-sm mb-5">FORGE adapts to where you are, not where the app expects you to be. Free, no account required.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/setup" className="inline-block bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors text-center">
            Start Free Now
          </Link>
          <Link href="/pricing" className="inline-block bg-zinc-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-zinc-700 transition-colors text-center">
            See Pricing
          </Link>
        </div>
      </div>
    </main>
  )
}
