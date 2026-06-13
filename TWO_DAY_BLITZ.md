# FORGE — 2-Day 20,000 Interaction Blitz
## Goal: 20,000 interactions (views + comments + upvotes + clicks) in 48 hours
## No budget. No ads. Pure distribution.

---

## THE MATH

One r/selfimprovement front page post = 5,000–80,000 views
One Show HN front page = 10,000–100,000 views  
One viral tweet = 2,000–20,000 impressions
YouTube comments on 100k+ view videos = 500–5,000 impressions per comment
Gmail blast to any existing list = depends on list size

**20,000 is achievable from a SINGLE platform hit.**
Spread across channels = guaranteed 20k+ even if nothing goes viral.

---

## DAY 1 — THE PUSH

### HOUR 0 (right now): 5-min setup
```bash
# Step 1: Get Gmail App Password
open https://myaccount.google.com/apppasswords
# Create → "FORGE Script" → copy the 16-char password

# Step 2: Test Gmail
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx" python3 scripts/send_gmail.py test

# Step 3: Reddit API (2 min)
open https://www.reddit.com/prefs/apps
# Create app → script type → redirect: http://localhost:8080
# Copy client_id and secret

# Step 4: Test Reddit login
REDDIT_CLIENT_ID=xxx REDDIT_SECRET=xxx REDDIT_USER=youruser REDDIT_PASS=yourpass python3 scripts/post_reddit.py
```

---

### HOUR 1: Show HN (biggest single bet — potential 20k alone)

**POST THIS RIGHT NOW at news.ycombinator.com/submit:**

Title:
```
Show HN: FORGE – measures how aligned your daily actions are with your stated identity
```

Body (paste exactly):
```
I got tired of habit apps that track whether I did the action but not whether I was becoming who I said I was.

FORGE measures the Alignment Score: the gap between your declared identity ("I am becoming someone who trains 4x/week, sleeps 8h, and spends intentionally") and what your data actually shows.

Technical implementation:
- Fully local-first (localStorage, no backend for data)
- 6 domains tracked simultaneously: sleep/HRV, workouts, nutrition, transactions, habits, journal entries
- Alignment Score = habitRate × 0.6 + keptRate × 0.4 (weighted toward daily behavior vs one-time commitments)
- Oracle AI (Claude Sonnet) reads all 6 domains and surfaces cross-domain patterns: "your HRV correlates with your spending the next day" — these are invisible across siloed apps
- The identity statement the user writes at setup is fed into every Oracle prompt as context

The insight I kept coming back to while building: most productivity apps optimize for completion rates. But you can complete 90% of your habits and still feel completely lost, because the habits might not be aligned with your actual identity vision.

Stack: Next.js 16, React 19, Tailwind, Supabase for auth, Anthropic API, Vercel.

Try it free (no account required): https://forge-five-flax.vercel.app/setup
Source: [GitHub link if public]

Happy to talk through the Alignment Score algorithm or the cross-domain correlation approach.
```

**Best time to post Show HN: Tuesday–Thursday, 9am–11am PST.**

---

### HOUR 2: Reddit blast (3 posts, staggered 10 min apart)

Run:
```bash
REDDIT_CLIENT_ID=xxx REDDIT_SECRET=xxx REDDIT_USER=xxx REDDIT_PASS=xxx python3 scripts/post_reddit.py posts
```

Posts will go to:
1. r/selfimprovement — "I stopped tracking habits and started tracking alignment"
2. r/getdisciplined — "The Monday Reset is a grief ritual, not a failure"  
3. r/Habits — "The two-phase failure pattern — why habits die at day 15-40"

**Post timing tip:** Each post auto-submits 10 min after the previous.

---

### HOUR 3: Reddit comments (while original posts warm up)

Go to these subreddits and find the top 5 posts from the last 24h about consistency/habits:
- reddit.com/r/selfimprovement/new
- reddit.com/r/getdisciplined/new  
- reddit.com/r/DecidingToBeBetter/new

Copy comments from `REDDIT_CONTENT.md` (Part 1 — 20 comments ready to paste).

**Target: 15 comments posted across 5 subreddits = ~3,000 potential views**

---

### HOUR 4: YouTube comments (open the 50 videos, paste comments)

Open `YOUTUBE_COMMENTS.md` — 50 comments ready.

**Priority order (highest view count first):**
1. Start with videos from "How to Build Discipline" category (highest view counts)
2. Then "Why You Can't Stay Consistent"
3. Then "Stop Procrastinating"

**Target: 30 comments posted = ~15,000 combined video views exposed**

---

### HOUR 5: Gmail blast

Add creator emails to `scripts/send_gmail.py` → CREATOR_TARGETS list.

Run:
```bash
GMAIL_APP_PASSWORD="xxxx" python3 scripts/send_gmail.py creators
```

Templates in `OUTREACH_CONTENT.md` — Section 2, Creator DMs.

---

### HOUR 6: Product Hunt pre-launch page

Go to producthunt.com → Submit → "Coming Soon" (gets indexed before full launch)

Use this from `OUTREACH_CONTENT.md`:
- Tagline: "The gap between who you say you're becoming and what your data shows"
- Description (from OUTREACH_CONTENT.md Section 4)

---

### HOUR 7: Twitter/X first post

Copy from `OUTREACH_CONTENT.md` — Section 1, Week 1 Day 1.

The identity gap post. Add the FORGE link. Post at 12pm EST.

---

### HOUR 8: Discord drops

Self-improvement Discords that allow tool sharing:
- Seek the app Discord (self-improvement)
- Atomic Habits unofficial servers
- Any productivity-focused servers you're in

Post this message:
```
Built something that measures the gap between who you say you're becoming 
and what your data actually shows. Not a habit tracker — an Alignment Score.

Free, no account needed: https://forge-five-flax.vercel.app/setup

Would love feedback from people who've tried every habit app and are 
still struggling with consistency.
```

---

## DAY 2 — AMPLIFICATION

### MORNING: Reply to every single Reddit comment
**This is critical.** Every reply drives Reddit's algorithm to keep the post in feeds.
Spend 30 minutes replying thoughtfully to every comment on yesterday's posts.

### HOUR 1: Indie Hackers post
Paste from `OUTREACH_CONTENT.md` Section 4 — Indie Hackers post.
Submit to indiehackers.com/post/new

### HOUR 2: Second Reddit wave (comments on trending posts)
Find the 5 most upvoted posts from the last 24h in target subreddits.
Use remaining comments from REDDIT_CONTENT.md.

### HOUR 3: Twitter thread
Post the Day 2 thread from OUTREACH_CONTENT.md — Section 1, Week 1 Day 2.
Reply to any engagement from Day 1 tweet.

### HOUR 4: YouTube second batch
Post remaining 20 YouTube comments from YOUTUBE_COMMENTS.md.

### HOUR 5: Creator DM follow-ups
For any creators you got a response from on Day 1, follow up personally.
Send remaining DMs to creators not yet contacted.

### HOUR 6: Email newsletter feature requests
Find 5 self-improvement newsletters (Substack search: "self-improvement")
Send the pitch from OUTREACH_CONTENT.md — Sequence B, Email 1.

---

## TRACKING

Keep this running count:

| Channel | Day 1 | Day 2 | Total |
|---------|-------|-------|-------|
| Reddit post views | | | |
| Reddit comments | | | |
| YouTube comment impressions | | | |
| Show HN views | | | |
| Twitter impressions | | | |
| Gmail sent | | | |
| FORGE signups (check Vercel) | | | |
| **TOTAL INTERACTIONS** | | | **0** |

---

## IF ONE THING POPS (viral moment protocol)

If any post starts getting significant upvotes/replies:
1. Reply to EVERY comment immediately
2. Cross-post the insight (not the link) to 2-3 other subreddits
3. Turn it into a Twitter thread immediately
4. Add it to the Indie Hackers post as an update
5. Email the creator targets with "this just resonated with [X] people on Reddit — thought you'd want to know"

---

## THE SINGLE BIGGEST LEVER

**Show HN on the right day at the right time.**

If you submit Tuesday morning at 9am PST and it hits the front page:
- 20,000–100,000 page views in 24 hours
- 200–1,000 FORGE signups
- Organic Reddit/Twitter sharing follows automatically

Post it. Then post it again the next week if it doesn't hit.
