# FORGE — Life OS

> Stop deciding what to focus on. FORGE tells you. You just do it.

**Live app:** https://forge-five-flax.vercel.app

FORGE is a personal life operating system that tracks Health, Body, Wealth, and Mind simultaneously — with an AI that connects the dots between all four and tells you exactly what to focus on today.

---

## The Problem

Most people track their life across 4+ separate apps that never talk to each other. Every morning becomes a 30-minute planning session: check sleep, check nutrition, check budget, check tasks, try to synthesise it all into a plan.

By the time you know what to focus on, your best cognitive energy is already spent.

## The Solution

One dashboard. One AI. One clear answer every morning.

FORGE's AI (Oracle) sees all four domains simultaneously:

- **Low HRV + high training load** → "Take a recovery day — your body is overreaching"
- **Sleep debt accumulating + negative cash flow** → "Stress spending risk is high this week"
- **Habit rate dropping + goals behind** → "3 commitments need closing today"

60 seconds to log vitals. The rest is automatic.

## The Core Metric: Alignment Score

Every task you create is timestamped as a **commitment**. Past-due and incomplete = broken promise. Your **Alignment Score** is the percentage of commitments you actually follow through on.

```
Alignment Score = (habitRate × 0.6) + (keptRate × 0.4)
Life Score = domainComposite × (0.80 + alignmentScore/100 × 0.20)
```

The first time most people see their score, it's below 50%.

---

## Features

| Domain | What it tracks |
|--------|---------------|
| **Health** | Sleep, HRV, resting HR, energy, mood |
| **Body** | Workouts, nutrition, body weight |
| **Wealth** | Transactions, cash flow, net balance |
| **Mind** | Goals, habits, tasks, journal |

- **Oracle AI** — cross-domain intelligence. Cites your actual numbers, names patterns, holds you to commitments.
- **Daily Quote** — 200+ curated quotes from Greg Plitt, Marcus Aurelius, Goggins, Seneca, Musashi, and more.
- **Alignment Score** — the gap between who you say you are and what you actually do.
- **Life Score Ring** — unified composite with alignment multiplier.

---

## Stack

- **Next.js 16** — App Router, all client components
- **TypeScript** strict, **Tailwind CSS v4**
- **Anthropic Claude API** — `claude-sonnet-4-6`
- **Stripe** — subscriptions, webhooks, billing portal
- **localStorage only** — no backend, no database, no privacy risk
- **Vercel** — deployment

## Key Architecture Decisions

**localStorage only:** All user data stays on device. No accounts, no database. Trade-off: no cross-device sync.

**Stateless Pro token:** `base64(expiry).HMAC(expiry, TOKEN_SECRET)`. Verifiable server-side in one line. No auth system.

**Deterministic AI context:** Every Oracle query sends a full JSON snapshot of all user data. No memory needed.

**Alignment multiplier:** Good domain scores alone can't inflate the Life Score. Low follow-through suppresses it.

---

## Running Locally

```bash
git clone https://github.com/marcosgil/forge
cd forge
npm install
```

Create `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
TOKEN_SECRET=any-random-string-32-chars
STRIPE_SECRET_KEY=sk_test_...        # optional
STRIPE_PRICE_ID=price_...            # optional
STRIPE_ANNUAL_PRICE_ID=price_...     # optional
STRIPE_WEBHOOK_SECRET=whsec_...      # optional
```

```bash
npm run dev  # → http://localhost:3000
```

Oracle AI works immediately with the Anthropic key. Stripe is optional.

---

## Business Model

**Free:** Full tracking + 10 Oracle queries/day

**Pro — €14.99/mo or €99/yr:** Unlimited Oracle + AI Morning Brief + AI Weekly Review

---

## Blog

- [The Alignment Score: Why Habit Streaks Are Lying to You](https://forge-five-flax.vercel.app/blog/alignment-score)
- [Decision Fatigue Is Killing Your Mornings](https://forge-five-flax.vercel.app/blog/decision-fatigue)
- [What Is a Personal Life OS?](https://forge-five-flax.vercel.app/blog/life-os)
- [HRV: The Metric That Connects Sleep, Money, and Performance](https://forge-five-flax.vercel.app/blog/hrv-tracking)

---

Built solo in 3 months. Because I needed a system that held me accountable to my own word — not just tracked my data.
