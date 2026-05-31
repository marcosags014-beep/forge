import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HRV Tracking: The One Metric That Connects Sleep, Money, and Performance | FORGE',
  description: 'Heart rate variability (HRV) is not just a fitness metric. It is the single number that predicts cognitive performance, spending behaviour, workout capacity, and decision quality — all at once.',
  openGraph: {
    title: 'HRV: The Metric That Connects Everything',
    description: 'Your HRV predicts not just your workout performance — but your spending, your mood, and your decision quality.',
    type: 'article',
  },
}

export default function HRVPost() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="px-6 md:px-16 py-5 border-b border-border">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to FORGE</Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <span className="text-xs text-primary font-semibold uppercase tracking-widest">Health</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-4 leading-tight">
            HRV: The One Metric That Connects Sleep, Money, and Performance
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Heart rate variability is not just a recovery score. It is a window into your nervous system — and what it predicts goes far beyond your next workout.
          </p>
        </div>

        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <p>
            Heart rate variability (HRV) measures the variation in time between each heartbeat. A high HRV indicates your nervous system is balanced and adaptable. A low HRV signals stress, inflammation, insufficient recovery, or accumulated fatigue.
          </p>
          <p>
            Most people track HRV to optimise training. That is useful — but it is a fraction of what HRV actually predicts.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">HRV and Cognitive Performance</h2>
          <p>
            Your prefrontal cortex — the part of the brain responsible for planning, decision-making, impulse control, and creative thinking — is highly sensitive to autonomic nervous system state. When HRV is suppressed, prefrontal function is reduced.
          </p>
          <p>
            In practice: on low-HRV days, your best cognitive work will feel harder, take longer, and produce lower quality output. Deep work sessions scheduled on suppressed-HRV days are often better rescheduled.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">HRV and Spending Behaviour</h2>
          <p>
            This is the connection that surprises people most. Stress-driven spending — comfort purchases, impulse buys, food delivery when you should be cooking — correlates strongly with low HRV days.
          </p>
          <p>
            The mechanism is straightforward: low HRV indicates elevated sympathetic nervous system activity (the stress response). The same stress response that suppresses prefrontal function also increases susceptibility to impulsive reward-seeking behaviour. Spending is a fast, accessible dopamine hit.
          </p>
          <p>
            Users who track both HRV and finances in FORGE frequently discover their highest spending days cluster around their lowest HRV readings.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">HRV and Training Decisions</h2>
          <p>
            This is the classic use case — and it remains valuable. HRV-guided training prevents overtraining, reduces injury risk, and improves long-term performance trajectory.
          </p>
          <p>
            The thresholds that matter:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>HRV at or above your 7-day baseline:</strong> Go hard. Your body is ready.</li>
            <li><strong>HRV 5–10% below baseline:</strong> Train at moderate intensity. Monitor.</li>
            <li><strong>HRV &gt;10% below baseline:</strong> Recovery day. Mobility, walking, sleep focus.</li>
          </ul>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">Why Tracking HRV In Isolation Misses the Point</h2>
          <p>
            An HRV number without context is limited. What you need is HRV in the context of:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Your sleep quality from the previous night</li>
            <li>Your training load over the past week</li>
            <li>Your financial stress level this month</li>
            <li>Your goal progress and outstanding commitments</li>
          </ul>
          <p>
            FORGE ingests all four domains and uses AI to surface the connections. Not &ldquo;your HRV is 52ms.&rdquo; But: &ldquo;Your HRV has been declining for four days while your training load is at its weekly peak and your cash flow is negative this month. Today is a recovery day — both physically and mentally.&rdquo;
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">How to Track HRV Without a Wearable</h2>
          <p>
            You do not need an Oura ring or Whoop strap to track HRV in FORGE. The built-in vitals log accepts manual HRV entry — compatible with the free version of the HRV4Training app, or any wearable that exports a daily HRV reading.
          </p>
          <p>
            If you have no HRV data, start with resting heart rate and sleep quality — both strongly correlate with HRV and give Oracle enough signal to make cross-domain connections.
          </p>

          <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
            <p className="text-sm font-semibold mb-2">Track HRV alongside your finances, workouts, and goals</p>
            <p className="text-sm text-muted-foreground mb-4">FORGE connects the dots automatically. Free to start.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary-foreground bg-primary px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
              Open FORGE →
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
