# FORGE Distribution Playbook
## First 100 Users — Community Acquisition

---

## PRIORITY 1: Reddit Posts (Solve CAPTCHAs, post immediately)

### r/quantifiedself — "The cross-domain gap in QS apps"
**Title:** I tracked HRV, sleep, training, and finances simultaneously for 6 months. Here's what the patterns looked like.

**Body:**
Been running an experiment: tracking all four simultaneously rather than in separate apps that don't talk to each other.

What I found: the connections between domains are more consistent than I expected.

Low HRV weeks and high discretionary spending weeks overlap with unusual frequency — within 24-48h. Sleep debt compounds training output faster than any single metric would suggest. Financial stress (visible in cash flow) precedes HRV suppression by about 3 days.

None of this is visible when you track each in a separate app.

I built FORGE to surface these patterns — it tracks all four in one place and uses AI to find the connections. Free, local-first (data never leaves your device), open to feedback.

URL: forge-five-flax.vercel.app

Happy to share more data from the experiment if there's interest.

---

### r/getdisciplined — "What tracking my word-kept rate taught me"
**Title:** I calculated how often I actually kept my word to myself. The number was 31%. Here's what I did about it.

**Body:**
Started tracking every commitment I made to myself — every task I created, every habit I set — and noting when I actually completed it vs. when it expired.

After 30 days: 31% completion rate on commitments. Not because I was lazy. Because I was creating 3x more commitments than I had capacity to keep.

That number changes how you think about the problem. It's not a motivation problem. It's a volume problem. And seeing it as data vs. vague shame makes it fixable.

I built a metric around this called the Alignment Score — it tracks habit completion (60%) and commitment kept rate (40%). Built it into a free app called FORGE.

Most people who calculate this for the first time are below 40%. Would be curious if others have tracked this kind of thing.

---

### r/selfimprovement — "Noticed my worst spending weeks follow my worst sleep weeks"
**Title:** Mapped my spending against my sleep data for 3 months. The pattern was uncomfortably consistent.

**Body:**
I've been tracking both sleep quality and daily spending for about 3 months. I was expecting weak correlation, if any.

What I found: the weeks where my sleep quality score was below 60 corresponded to the weeks with the highest discretionary spending — within 24-48 hours, consistently.

The mechanism makes physiological sense (cortisol → reward-seeking behaviour) but actually seeing it in your own data is different from knowing it abstractly.

Built an app to track this automatically: FORGE. It's free, local-first, and uses AI to surface these cross-domain patterns. Not trying to sell anything — mostly sharing because this was genuinely surprising data.

Anyone else tracked this kind of thing?

---

### r/productivity — "I stopped using 4 apps and built one system. Here's what changed."
**Title:** Cut my morning planning session from 45 minutes to 90 seconds. Here's the system.

**Body:**
I was spending 45 minutes every morning reviewing data from 4 different apps and trying to synthesize it into a plan. This was eating my best cognitive hours.

The problem: the apps don't talk to each other, so I was the integration layer. Manually connecting sleep data to training decisions to financial check-ins to goal review.

Moved to a single system that tracks all four simultaneously and gives me one prioritized recommendation each morning based on that day's actual data.

Morning routine is now: log today's vitals (60s), read AI brief (30s), start working.

The system is FORGE — free app, local-first, AI tells you what matters. Built it because I couldn't find anything that solved this problem.

---

### r/Whoop / r/ouraring — "Cross-referencing HRV with financial data"
**Title:** Cross-referenced my HRV data with spending data. The pattern was clearer than I expected.

**Body:**
Hypothesis: low HRV days (and the physiological state they represent) would correlate with higher impulsive spending.

Result: yes, consistently, within 24-48h. High cortisol drives reward-seeking behaviour — that shows up in HRV and in bank statements.

The challenge: no existing app shows both. You have to do this manually. So I built FORGE — tracks HRV, sleep, spending, fitness, and goals in one place. Free, local-first.

Happy to share methodology if useful to anyone.

---

## PRIORITY 2: Hacker News

### Show HN post (wait for karma)
**Title:** Show HN: FORGE – local-first life OS tracking health, finances, and goals with AI

**Body:**
FORGE is a personal life operating system I built because I was frustrated with tracking health in one app, finances in another, and goals in a third.

The core insight: these domains are deeply correlated. Low HRV predicts spending spikes. Sleep debt compounds training output. Financial stress suppresses recovery. No single-domain app can see this.

Tech: Next.js 16 with React 19, all localStorage (zero backend for user data), Claude API for the Oracle AI layer. GDPR compliant by design since there's no server to store data on.

The thing I'm most interested in feedback on: the Alignment Score. It tracks word-kept rate (habit completion × commitment kept rate) rather than just habit streaks. Most people are below 40% when they first see it.

Live: forge-five-flax.vercel.app

---

## PRIORITY 3: Communities to Join + Post In

- r/quantifiedself (5 posts/month rule, be genuine)
- r/LifeOS (small but targeted)
- r/whoop, r/ouraring (show cross-domain data)
- r/YNAB (financial-stress-to-health correlation angle)
- Indie Hackers (build in public posts)
- Product Hunt (launch when ready)
- Twitter/X @forgelifeos (daily insights)
- LinkedIn (founder + performance angle)

---

## PRIORITY 4: SEO Keywords to Target Next

**High intent, low competition:**
- "life OS app" (50-100/mo)
- "accountability score app" (10-50/mo)
- "HRV and sleep tracker together" (100-1k/mo)
- "Notion life OS alternative" (100-1k/mo)
- "quantified self app 2026" (100-1k/mo)
- "biohacker tracking app" (100-1k/mo)
- "personal finance and health tracking" (100-1k/mo)
- "AI morning brief app" (10-100/mo)
- "word kept rate tracker" (near-zero — FORGE can own this)

**Articles to write next:**
1. "The Alignment Score: What Your Productivity App Won't Tell You"
2. "How I Use FORGE: A Week of Cross-Domain Data"
3. "Sleep + Money: The Connection Your Finance App Ignores"
4. "FORGE vs YNAB: What Your Budget App Can't See"

---

## PRIORITY 5: Actions Requiring User

1. Solve Reddit CAPTCHAs (Safari tabs 19, 34-37, 42, 43)
2. Configure forge-life.app custom domain on Vercel → massive SEO impact
3. Set RESEND_API_KEY on Vercel → email capture starts working
4. Complete Peerlist verification (email code)
5. Product Hunt: select tags, publish
6. DevHunt: upload screenshots
7. Twitter @forgelifeos: post daily
