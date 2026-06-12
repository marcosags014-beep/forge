import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE vs YNAB — Beyond Budgeting to Whole-Life Finance | FORGE',
  description: "YNAB is the best budgeting app. But if money is just one piece of a larger problem — energy, habits, goals — here's what you get when you zoom out.",
  alternates: { canonical: 'https://forge-five-flax.vercel.app/vs/ynab' },
  openGraph: {
    title: 'FORGE vs YNAB — Beyond Budgeting to Whole-Life Finance',
    description: 'YNAB masters money. FORGE connects money to everything else. Different tools, different jobs.',
    type: 'article',
  },
}

export default function ForgeVsYNAB() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-10">
        <p className="text-sm text-orange-400 font-medium mb-3">Comparison</p>
        <h1 className="text-3xl font-bold text-white leading-tight mb-4">
          FORGE vs YNAB: Budgeting vs Whole-Life Finance
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          YNAB (You Need A Budget) is widely regarded as the best personal budgeting app available. It is opinionated, effective, and backed by a strong methodology. So why do some YNAB users eventually want more?
        </p>
      </header>

      <section className="space-y-6 leading-relaxed">
        <h2 className="text-xl font-semibold text-white">What YNAB does exceptionally well</h2>
        <p>
          YNAB&apos;s four rules — give every dollar a job, embrace your true expenses, roll with the punches, and age your money — are among the most practically effective personal finance principles ever packaged into software. The zero-based budgeting methodology is proven. The interface is excellent. The community is active and genuinely helpful. For pure budgeting and envelope-based cash management, YNAB is one of the best tools ever built.
        </p>
        <p>
          At €99 per year, it is also expensive for a budgeting app. But for users who engage seriously with the methodology, the ROI is typically positive within months.
        </p>

        <h2 className="text-xl font-semibold text-white">The isolated finance problem</h2>
        <p>
          YNAB sees your money. It does not see your energy levels, your sleep, your workout consistency, or your long-term goals. This means it cannot answer the question that increasingly matters to people managing their finances and their lives simultaneously: why does my spending go up in weeks when my sleep is poor? Why does my savings rate drop when I miss workouts? What financial behaviour corresponds to the periods where I feel most in control?
        </p>
        <p>
          These are not hypothetical correlations. Research consistently shows that financial decision-making is directly impaired by sleep deprivation, chronic stress, and poor physical health. If your finance system has no visibility into those domains, it cannot help you address the root cause of financial inconsistency.
        </p>

        <h2 className="text-xl font-semibold text-white">What FORGE adds to the finance picture</h2>
        <p>
          FORGE includes a finance module that tracks income, expenses, savings rate, emergency fund status, and investment activity. It is not as feature-rich as YNAB for pure budgeting — it does not do zero-based envelope allocation, and it does not connect to bank accounts.
        </p>
        <p>
          What FORGE does is position your finances inside the context of your whole life. Oracle AI can see that your food spending spikes in weeks where your meal prep habit drops. It can see that months with high financial anxiety correlate with lower HRV and worse workout consistency. It can tell you that fixing your evening routine would likely reduce your impulsive spending by giving you a specific behaviour change with a specific mechanism behind it.
        </p>
        <p>
          That is a fundamentally different kind of financial insight — and it is only possible because the finance data sits alongside health, habit, and goal data in the same system.
        </p>

        <h2 className="text-xl font-semibold text-white">Which to use</h2>
        <p>
          YNAB is the right choice if your primary goal is detailed budgeting, cash flow management, and debt paydown using proven envelope methodology. It is especially good for households managing complex finances with a partner.
        </p>
        <p>
          FORGE is the right choice if you want to understand the relationship between your finances and your overall life quality, if you want one dashboard that shows whether your whole life is aligned — not just your budget — or if the cost of YNAB feels high given that you only want basic financial visibility alongside your health and habits tracking.
        </p>
        <p>
          Many serious YNAB users use FORGE for the cross-domain picture while keeping YNAB for detailed budget management. The two tools answer different questions and do not compete on the dimensions that matter most to each.
        </p>
      </section>

      <div className="mt-12 p-6 bg-zinc-900 border border-zinc-700 rounded-2xl text-center">
        <p className="text-white font-semibold text-lg mb-2">See your finances inside the context of your whole life.</p>
        <p className="text-zinc-400 text-sm mb-4">FORGE tracks money alongside health, habits, and goals. Free — no account required.</p>
        <Link href="/setup" className="inline-block bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors">
          Start Free — No Account Required
        </Link>
      </div>
    </main>
  )
}
