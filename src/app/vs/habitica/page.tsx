import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE vs Habitica — Which Habit Tracker Actually Works? | FORGE',
  description: "Habitica turns habits into a game. FORGE turns habits into identity. If external rewards haven't worked, here's what the difference looks like in practice.",
  alternates: { canonical: 'https://forge-five-flax.vercel.app/vs/habitica' },
  openGraph: {
    title: 'FORGE vs Habitica — Which Habit Tracker Actually Works?',
    description: 'Gamification builds streaks. Identity builds lasting change. Very different outcomes.',
    type: 'article',
  },
}

export default function ForgeVsHabitica() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-10">
        <p className="text-sm text-orange-400 font-medium mb-3">Comparison</p>
        <h1 className="text-3xl font-bold text-white leading-tight mb-4">
          FORGE vs Habitica: Gamification vs Identity
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Habitica is genuinely fun for the first two weeks. Then the character levels up and the XP keeps coming and something important does not change: the behaviour. Here is why — and what a different design approach looks like.
        </p>
      </header>

      <section className="space-y-6 leading-relaxed">
        <h2 className="text-xl font-semibold text-white">How Habitica works (and why it works temporarily)</h2>
        <p>
          Habitica gamifies habit formation through an RPG mechanics layer: your character gains HP, XP, and gold when you complete habits and loses health when you miss them. You can join parties, complete quests, and earn equipment. The social layer adds peer accountability. The visual progression creates dopamine hits.
        </p>
        <p>
          This mechanism works, up to a point, for two specific reasons: novelty creates engagement, and the social layer creates real stakes. For users who respond to game mechanics and have the right peer group, Habitica produces genuine consistency improvement in the short to medium term.
        </p>
        <p>
          The long-term problem is that all of these mechanisms are external. The reward for doing the habit is the XP, not the benefit of the habit itself. When the novelty fades and the XP becomes routine, the motivation fades with it. You are left with the same behaviour problem you started with, just with a levelled-up character you no longer care about.
        </p>

        <h2 className="text-xl font-semibold text-white">The identity-based alternative</h2>
        <p>
          FORGE is built on a different premise: the goal is not to build streaks, but to close the gap between who you say you want to be and how you are actually living. This is measured by the Alignment Score — a daily, weekly, and monthly read of whether your behaviour matched your stated intentions across all six life domains.
        </p>
        <p>
          The difference sounds subtle. It has completely different outcomes. A streak breaks when you miss a day and the mechanism works against you. Alignment Score is a weekly average — one hard day does not erase your week, but the gap stays visible and honest. You are not fighting a game mechanic. You are confronting a true reflection.
        </p>

        <h2 className="text-xl font-semibold text-white">Context that Habitica cannot provide</h2>
        <p>
          Habitica tracks habits in isolation. It does not know whether you slept poorly, whether you are under financial stress, whether your workout skips correlate with your energy levels, or whether your overall life direction is aligned with what you actually care about. It sees the checkbox. It cannot see what is behind the missed checkbox.
        </p>
        <p>
          FORGE tracks six domains simultaneously — health vitals, training, nutrition, finances, habits, and goals. Oracle AI reads across all of them and produces cross-domain insight: why your habit compliance drops in certain weeks, what lifestyle factors explain your consistency patterns, and what single change would have the highest impact on your overall alignment right now.
        </p>
        <p>
          That level of insight is structurally impossible in a single-domain habit tracker, regardless of how well-designed it is.
        </p>

        <h2 className="text-xl font-semibold text-white">Social accountability vs self-accountability</h2>
        <p>
          Habitica&apos;s social layer is its strongest feature. Party accountability creates real consequences for missing habits. If this mechanism works for you, it is worth keeping. The limitation is that it works only as long as your party is active, your relationships are good, and the social stakes feel meaningful.
        </p>
        <p>
          FORGE is built around self-accountability: the discipline of keeping commitments to yourself, without external witnesses. This is harder to bootstrap, but significantly more durable. The Alignment Score is the mechanism — it is a mirror, not an audience. You are accountable to your own data, your own stated goals, and your own honest read of the gap.
        </p>

        <h2 className="text-xl font-semibold text-white">Which should you use?</h2>
        <p>
          Use Habitica if you respond well to gamification, enjoy the social mechanics, and are building simple daily habits without complex cross-domain context. It is free and has an active community.
        </p>
        <p>
          Use FORGE if you have tried gamified habit apps and found the motivation fades, if you want cross-domain insight rather than habit isolation, if you want to measure your overall life alignment rather than individual streaks, or if you prefer self-accountability to social accountability.
        </p>
        <p>
          Both are free. The question is which model of behaviour change fits your psychology.
        </p>
      </section>

      <div className="mt-12 p-6 bg-zinc-900 border border-zinc-700 rounded-2xl text-center">
        <p className="text-white font-semibold text-lg mb-2">Try a different kind of accountability.</p>
        <p className="text-zinc-400 text-sm mb-4">FORGE measures whether your life is aligned — not whether you earned XP. Free — no account required.</p>
        <Link href="/setup" className="inline-block bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors">
          Start Free — No Account Required
        </Link>
      </div>
    </main>
  )
}
