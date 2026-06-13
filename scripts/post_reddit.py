#!/usr/bin/env python3
"""
FORGE Reddit Posting Script (uses PRAW — already installed)
------------------------------------------------------------
Setup (2 min):
1. Go to https://www.reddit.com/prefs/apps → "create another app"
2. Select "script" type
3. Set redirect URI to http://localhost:8080
4. Note the client_id (under app name) and client_secret
5. Run with:
   REDDIT_CLIENT_ID=xxx REDDIT_SECRET=xxx REDDIT_USER=yourusername REDDIT_PASS=yourpassword python3 scripts/post_reddit.py

IMPORTANT: Reddit limits new accounts to 1 post/10min. Space out posts.
New accounts under 30 days may have posts auto-removed by AutoModerator.
Use an established Reddit account if available.
"""

import praw
import os
import time
import sys

CLIENT_ID     = os.environ.get("REDDIT_CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("REDDIT_SECRET", "")
USERNAME      = os.environ.get("REDDIT_USER", "")
PASSWORD      = os.environ.get("REDDIT_PASS", "")
USER_AGENT    = "FORGE-growth-script/0.1 by forge_founder"

# ── Original Posts — ready to submit ────────────────────────────────────────
ORIGINAL_POSTS = [
    {
        "subreddit": "selfimprovement",
        "title": "I stopped tracking habits and started tracking alignment. Here's what actually changed.",
        "body": """For about three years I used every habit app you can name. Streaks, completion percentages, habit stacks. The apps were great. The results were mixed.

The problem wasn't the tools. The problem was I was measuring the wrong thing.

I was measuring whether I did the action. I wasn't measuring whether my actions were building the person I said I wanted to be.

Those are different metrics. You can have a 90% habit completion rate and still feel completely lost. You can have a 47% rate and be genuinely making progress on what matters. The streak tells you about behavior. It doesn't tell you about direction.

**The thing that actually helped:**

I started writing down, explicitly, who I was becoming. Not goals. Identity. "I am becoming someone who trains four days a week, sleeps eight hours, and doesn't check his phone before 9am."

Then I started measuring the gap. Not "did I do the habit" but "how close is my actual behavior to that identity statement."

The first time I calculated this honestly, I was at around 31%.

I thought I was doing pretty well. I was completing most of my habits. But when I measured against who I actually said I was becoming, the gap was massive. I trained twice a week and called it four. I slept 6.1 hours and called it "close enough." I checked my phone at 7am and told myself I'd fix it tomorrow.

**What changed:**

The number made it real. Not in a shameful way. In a clarifying way. You can argue with a feeling. You can't argue with a gap.

After about six weeks of tracking this, I was at 74%. Not because I got more disciplined — but because I couldn't unsee the number anymore. Every morning it was right there. Here's the gap. Here's what you said you were. Here's what you're actually doing.

**The practical thing:**

Write your identity statement. Make it specific. Then every week, actually calculate the gap. How many of your actions that week were consistent with that identity?

If you want to shortcut the calculation, I built something that does it automatically. But honestly? You can do this with a notebook. The technology isn't the point. The honest confrontation with the gap is the point.

What does your identity statement look like right now? Or do you not have one?""",
    },
    {
        "subreddit": "getdisciplined",
        "title": "The Monday Reset is a grief ritual, not a failure",
        "body": """Something I've noticed after talking to a lot of people about discipline: the Sunday planning session and Monday fresh start isn't laziness. It's a grief ritual.

You're mourning the version of yourself that was supposed to show up last week and didn't. The planning session is closure. The new notebook, the new app, the clean slate — that's the burial. Monday is the resurrection.

The problem: resurrection feels productive. It creates the neurochemical sensation of progress without requiring any actual change in behavior. You get the dopamine hit of a fresh start without having to do the hard thing, which is continue.

**Why Thursday is the real test:**

If you want to know whether your system is working, don't measure Mondays. Measure Thursdays. Monday you have momentum, novelty, and the guilt of last week's failures driving you. Thursday you have neither. Thursday is just: this is my life, am I showing up?

Most people who "struggle with consistency" are actually quite consistent through Wednesday. The failure pattern is almost always days 4-5 of a streak, not days 1-2.

**What actually fixes it:**

Stop treating weeks as units. The clean-slate psychology is what's killing you.

Try this: for one month, don't plan on Sundays at all. Don't review last week. Don't set next week's intentions. Just show up on Monday and do the thing, because it's a day and you do the thing on days.

It feels wrong. It feels like you're missing something. That discomfort is the point. You're breaking the ritual.

The ritual is comfortable. Continuing is hard. That's why most people keep choosing the ritual.

What does your Thursday discipline actually look like right now?""",
    },
    {
        "subreddit": "Habits",
        "title": "The two-phase failure pattern — why habits die at day 15-40, not day 1",
        "body": """After tracking a lot of habit data, I've noticed a consistent failure pattern that nobody talks about: habits don't usually fail in week one. They fail in weeks three and four.

**Phase 1 (Days 1-14): Novelty protection**

New habits are protected by novelty. The behavior is interesting, you're tracking it consciously, and you have emotional investment from having started. Failure rate in this phase is low not because you're disciplined, but because the habit is new.

**Phase 2 (Days 15-40): The dead zone**

This is where habits actually die. The novelty is gone. The habit hasn't automated yet (that takes 60-90 days for most people). You're in no-man's-land: it's not interesting anymore, but it's also not automatic. This requires actual discipline.

Most habit advice is written for Phase 1 people. "Start small." "Make it easy." "Habit stack." That's Phase 1 advice. It doesn't help Phase 2 people.

**What actually helps in Phase 2:**

1. **Identity anchoring.** The behaviors that survive Phase 2 are almost always the ones tied to identity ("I'm a person who trains") rather than outcomes ("I want to lose weight"). Identity is stickier than outcome.

2. **Measuring alignment, not completion.** Instead of tracking whether you did the habit, track how close your actual week was to the identity you've defined. The gap is more motivating than the streak.

3. **Reducing the unit of measurement.** Instead of "did I train today," track "how many days this month." Going 14/30 in Phase 2 is genuinely good. An unbroken streak expectation in Phase 2 is almost guaranteed to fail.

4. **Expecting Phase 2.** Just knowing this phase exists changes how you interpret it. When it gets boring and hard around day 18, that's not a sign you're not cut out for it. That's Phase 2. It's supposed to feel like this. Push through it and you're building something real.

Where are you in the cycle right now?""",
    },
]

# ── Comments on existing posts ────────────────────────────────────────────
# Read from REDDIT_CONTENT.md and paste URLs here
POST_COMMENTS = [
    # Format: ("post_url_or_id", "comment text")
    # ("https://www.reddit.com/r/selfimprovement/comments/abc123/", "Your comment here..."),
]


def get_reddit():
    if not all([CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD]):
        print("❌ Missing Reddit credentials. Set REDDIT_CLIENT_ID, REDDIT_SECRET, REDDIT_USER, REDDIT_PASS")
        sys.exit(1)
    return praw.Reddit(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        username=USERNAME,
        password=PASSWORD,
        user_agent=USER_AGENT,
    )


def post_original(reddit, post: dict, delay: int = 600):
    """Submit an original post. delay=seconds to wait between posts (default 10min)."""
    sub = reddit.subreddit(post["subreddit"])
    print(f"\n📝 Posting to r/{post['subreddit']}: \"{post['title'][:60]}...\"")
    try:
        submission = sub.submit(title=post["title"], selftext=post["body"])
        print(f"   ✅ Posted: https://reddit.com{submission.permalink}")
        return submission
    except Exception as e:
        print(f"   ❌ Failed: {e}")
        return None


def comment_on_post(reddit, post_url: str, comment_text: str):
    """Add a comment to an existing Reddit post."""
    try:
        submission = reddit.submission(url=post_url)
        comment = submission.reply(comment_text)
        print(f"   ✅ Commented on: {post_url}")
        return comment
    except Exception as e:
        print(f"   ❌ Failed to comment on {post_url}: {e}")
        return None


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "help"

    if cmd == "help":
        print("Usage:")
        print("  python3 scripts/post_reddit.py posts     — submit all original posts (10min apart)")
        print("  python3 scripts/post_reddit.py comments  — post all comments")
        print("  python3 scripts/post_reddit.py all       — posts then comments")
        sys.exit(0)

    reddit = get_reddit()
    print(f"✅ Logged in as u/{reddit.user.me().name}")

    if cmd in ("posts", "all"):
        for i, post in enumerate(ORIGINAL_POSTS):
            result = post_original(reddit, post)
            if result and i < len(ORIGINAL_POSTS) - 1:
                print(f"   ⏳ Waiting 10 min before next post...")
                time.sleep(610)

    if cmd in ("comments", "all"):
        print(f"\n💬 Posting {len(POST_COMMENTS)} comments...")
        for url, text in POST_COMMENTS:
            comment_on_post(reddit, url, text)
            time.sleep(30)  # 30s between comments
