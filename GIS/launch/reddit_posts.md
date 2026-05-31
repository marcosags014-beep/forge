# FORGE Reddit Launch Posts

---

## POST 1 — r/getdisciplined
**Title:** I tracked everything for 6 months and realised the problem wasn't motivation — it was the gap between what I said I'd do and what I actually did

---

For 6 months I tracked sleep, workouts, calories, finances, habits. I had beautiful dashboards. My data was immaculate.

I was still the same person.

The problem wasn't the data. It was that I had zero system to measure the gap between the commitments I made and the ones I kept. I could log a perfect sleep score and still quietly drop a task I'd promised myself on Monday. No accountability. No record of the breach.

So I built something to fix that. It's called FORGE.

The core metric isn't a health score or a productivity score. It's something I call **Word Kept Rate** — a simple calculation: every task you create is a commitment. Every day that passes where it's not done, it becomes a broken promise. Your Word Kept score is what % of your commitments you actually keep.

When I saw mine at 34% I nearly threw up. I thought I was disciplined.

The app tracks 4 domains (Health, Body, Wealth, Mind) and cross-references them. Low HRV days correlate with higher spending. Poor sleep tanks your workout output by the next day. The AI (Oracle) notices these patterns and calls them out directly — not gently.

It's free to use. No account needed — all data stays on your device.

https://forge-five-flax.vercel.app

Not here to sell anything. Built it for myself and figured others might need the mirror too.

---

## POST 2 — r/selfimprovement
**Title:** I built a free app that shows you the gap between who you say you are and who you actually are (and it's uncomfortable)

---

Most self-improvement apps are feel-good tools. You log your habits, see streaks, get a dopamine hit, feel like you're making progress.

Then six months later you're in the same place wondering why nothing changed.

I spent three months building something different. It's called FORGE and the core idea is this: your score isn't based on how much you do, it's based on how much of what you commit to you actually follow through on.

Every task you create is logged with a timestamp. Every day you don't complete it, it registers as a broken commitment. Your "Alignment Score" is what % of your stated intentions you execute on. That number tells you more about yourself than any habit streak ever will.

It also tracks Health (sleep, HRV, energy), Body (workouts, nutrition), Wealth (income, expenses, cash flow), and Mind (goals, habits, tasks) — all in one place. An AI called Oracle analyses all four domains simultaneously and finds connections you'd never notice manually.

The thing that shocked me most when I started using it: my alignment score was 34%. I had habits I'd been "working on" for months. I had tasks from three weeks ago still open. I told myself I was disciplined. The data said otherwise.

Free. No login, no cloud, your data never leaves your device.

https://forge-five-flax.vercel.app

Happy to answer any questions about the build or the methodology.

---

## POST 3 — r/productivity
**Title:** Built a life OS that tracks Health, Body, Wealth, and Mind simultaneously — with an AI that connects the dots between all four

---

I got frustrated with having four separate apps for four separate life domains and none of them talking to each other.

Oura for sleep. MyFitnessPal for food. YNAB for money. Notion for goals. None of them knew about the others.

So I built FORGE — a single dashboard that tracks everything and uses AI to find cross-domain patterns. The insight that changed how I think: domains don't operate independently.

- Your HRV dropping → you overspend that day (stress response)
- Your sleep debt compounding → your workout output collapses by day 3
- Your savings rate going up → your workout frequency goes up (identity shift)

Oracle (the AI layer) sees all four domains at once and names these correlations with your actual numbers, not generic advice. "Your HRV has been below 50ms for 4 days and your spending spiked 40% in that window — these aren't unrelated."

The tracking itself is fast — 60 seconds to log vitals each morning. The system does the analysis.

Free tier: full tracking + 10 Oracle queries/day
Pro: unlimited Oracle + AI weekly review

https://forge-five-flax.vercel.app

---

## POST 4 — r/startups
**Title:** Show r/startups: FORGE — a life OS where the core metric is how often you keep your word to yourself

---

What I built: A personal life operating system that tracks Health, Body, Wealth, and Mind simultaneously, with an AI that specifically measures the gap between your stated intentions and your actual execution.

The problem: Every productivity app rewards logging and consistency streaks. None of them measure whether you did the things you said you'd do. No accountability layer — just a tracker.

The differentiator: Every task created in FORGE is time-stamped as a commitment. Past-due incomplete tasks register as broken commitments. Your "Alignment Score" (Word Kept Rate) is the core metric — not your streak, not your score, but your integrity gap.

Business model: Freemium. Free tier has full tracking + 10 Oracle AI queries/day. Pro (€14.99/mo or €99/yr) unlocks unlimited Oracle + AI Weekly Review.

Live: https://forge-five-flax.vercel.app

Solo build. Built it because I needed it.

---

## POST 5 — r/nocode / r/webdev (Technical)
**Title:** Built a full life OS in Next.js with an AI accountability layer — architecture notes

---

Six months of idea, three months of building. Here's what I shipped:

FORGE — a unified life tracking app with AI (Claude) that analyses Health, Body, Wealth, and Mind simultaneously.

Technical decisions that mattered:

1. localStorage only, no backend — users own their data, zero server costs, instant load
2. Deterministic AI context injection — structured JSON of all user data sent with every Oracle query
3. Alignment score as core metric — tasks have createdAt timestamps; past-due incomplete = broken commitment
4. Stateless Pro token — base64(expiry).HMAC(expiry, TOKEN_SECRET). No database, no auth system
5. Domain composite scoring — overall = (health×0.30 + body×0.20 + wealth×0.25 + mind×0.25) × alignment multiplier

Stack: Next.js 16, TypeScript, Tailwind v4, Claude API, Stripe

Live: https://forge-five-flax.vercel.app

Happy to go deep on any part of the architecture.
