import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE for Creatives — Protect Your Creative Energy | Life OS',
  description: 'Creative work demands consistency and recovery in equal measure. FORGE tracks both and tells you when to push and when to protect your most valuable asset.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/creatives' },
  openGraph: {
    title: 'FORGE for Creatives — Protect Your Creative Energy',
    description: 'Your output depends on your input. FORGE tracks both and tells you what to prioritise today.',
    type: 'website',
  },
}

export default function ForCreatives() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-12">
        <p className="text-sm text-orange-400 font-medium mb-3 uppercase tracking-wide">FORGE for</p>
        <h1 className="text-4xl font-bold text-white leading-tight mb-5">
          Your creative output depends on your daily inputs
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-6">
          Writers, designers, builders, musicians — the people who create for a living know that output is not just about skill or time. It is about showing up in the right state. FORGE is the system that tracks the inputs so you can protect the output.
        </p>
        <Link href="/setup" className="inline-block bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors">
          Start Free — No Account Required
        </Link>
      </header>

      <section className="space-y-10">
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Deep work requires recovery</h2>
          <p>
            The most common mistake creative professionals make is treating creative energy like a renewable resource that just needs effort to activate. It is not. It is a function of sleep quality, physical state, nutritional consistency, and mental bandwidth. FORGE tracks all of these and surfaces the patterns — so you know what your best days look like, and how to produce them more often.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Oracle AI: your daily creative brief</h2>
          <p>
            Each day, Oracle AI reads your health data, recovery metrics, recent habits, and project commitments and produces a clear answer to the question every creative faces: should I push into deep work today, or is this a day for lower-stakes tasks? That single piece of direction saves the decision-making energy for the work itself.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Consistency is the real creative practice</h2>
          <p>
            Inspiration is unreliable. Habits are not. The creatives who produce great work over years and decades are not more inspired — they show up more consistently. FORGE measures your consistency rate across every commitment you make, and your Alignment Score gives you an honest weekly read on whether you are building the creative practice you said you wanted.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Finance without anxiety</h2>
          <p>
            Financial instability is one of the biggest threats to creative output. The mental bandwidth consumed by money stress directly reduces the cognitive resources available for creative work. FORGE includes a finance module that tracks income, expenses, and savings rate — not to restrict, but to give you visibility that reduces anxiety and protects creative focus.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">The whole life view</h2>
          <p>
            Creative blocks rarely come from one source. They come from the combination of poor sleep, financial stress, neglected relationships, and the low-grade anxiety of goals that have been deferred too long. FORGE tracks all six life domains simultaneously, so Oracle AI can surface the actual root cause — not just the symptom — and tell you where to focus to unlock output.
          </p>
        </div>
      </section>

      <div className="mt-14 p-6 bg-zinc-900 border border-zinc-700 rounded-2xl">
        <p className="text-white font-semibold text-lg mb-2">Protect your energy. Compound your output.</p>
        <p className="text-zinc-400 text-sm mb-5">FORGE tracks the inputs so you can focus on what you create. Free, no account required.</p>
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
