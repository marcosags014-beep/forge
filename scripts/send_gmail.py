#!/usr/bin/env python3
"""
FORGE Gmail Outreach Script
----------------------------
Setup (1 min):
1. Go to https://myaccount.google.com/apppasswords
2. Create an App Password for "Mail"
3. Set the env vars below and run:
   GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx" python3 scripts/send_gmail.py

This script sends the creator partnership + user interview outreach emails.
"""

import smtplib
import os
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

GMAIL_USER = "marcosags014@gmail.com"
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")

# ── Target list — creator partnership outreach ─────────────────────────────
# Add/remove targets here. Format: (name, email, specific_reference, their_niche)
CREATOR_TARGETS = [
    # Format: (first_name, email, one_line_about_their_content, their_audience_pain)
    # Fill these in from OUTREACH_CONTENT.md creator list
    # Example:
    # ("Matt", "email@example.com", "your 'why I quit social media' video", "people optimizing their environment"),
]

# ── Target list — cold user interview outreach ─────────────────────────────
# People who signed up / engaged but you want to interview
USER_INTERVIEW_TARGETS = [
    # Format: (first_name, email)
    # ("Alex", "alex@example.com"),
]

def send_email(to_email: str, subject: str, body: str, name: str = "") -> bool:
    if not GMAIL_APP_PASSWORD:
        print(f"  ⚠️  GMAIL_APP_PASSWORD not set — skipping {to_email}")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = GMAIL_USER
    msg["To"] = to_email

    part = MIMEText(body, "plain")
    msg.attach(part)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_USER, to_email, msg.as_string())
        print(f"  ✅ Sent to {name} <{to_email}>")
        return True
    except Exception as e:
        print(f"  ❌ Failed {to_email}: {e}")
        return False


def creator_partnership_email(first_name: str, specific_ref: str, audience_pain: str) -> tuple[str, str]:
    subject = f"Something that might resonate with your audience, {first_name}"
    body = f"""Hey {first_name},

Your content on {specific_ref} is exactly the kind of thing I've been building around.

I'm building FORGE — a system that shows people the gap between who they say they're becoming and what their data actually shows. We call it the Alignment Score. It reads sleep, workouts, spending, habits, and mood, then tells you what's most misaligned with your stated identity.

Your audience — people dealing with {audience_pain} — would get this immediately. It's not another tracker. It's the reckoning most people avoid.

Would you be open to trying it for a week? No script, no talking points. Just your honest experience. Free to start, no account needed: https://forge-five-flax.vercel.app/setup

Either way — keep making the content. It's genuinely good.

Marcos
FORGE founder"""
    return subject, body


def user_interview_email(first_name: str) -> tuple[str, str]:
    subject = f"Quick question, {first_name} — 15 minutes?"
    body = f"""Hey {first_name},

I'm Marcos, the person building FORGE. I noticed you've been using it and I wanted to reach out personally.

I'm trying to understand: what made you sign up? What were you hoping it would do? And is it actually doing that?

Not a sales call. Not a survey. Just a 15-minute conversation where you talk and I listen. Founders who skip this end up building for themselves instead of for their users — I don't want to do that.

If you're open to it, just reply with a time that works. Zoom, call, or even async voice message — whatever's easiest for you.

Thanks either way.

Marcos
https://forge-five-flax.vercel.app"""
    return subject, body


def run_creator_outreach():
    print(f"\n🚀 Sending creator partnership emails ({len(CREATOR_TARGETS)} targets)...")
    sent = 0
    for first_name, email, specific_ref, audience_pain in CREATOR_TARGETS:
        subject, body = creator_partnership_email(first_name, specific_ref, audience_pain)
        if send_email(email, subject, body, first_name):
            sent += 1
        time.sleep(3)  # avoid rate limiting
    print(f"Done: {sent}/{len(CREATOR_TARGETS)} sent\n")


def run_user_interviews():
    print(f"\n📞 Sending user interview requests ({len(USER_INTERVIEW_TARGETS)} targets)...")
    sent = 0
    for first_name, email in USER_INTERVIEW_TARGETS:
        subject, body = user_interview_email(first_name)
        if send_email(email, subject, body, first_name):
            sent += 1
        time.sleep(3)
    print(f"Done: {sent}/{len(USER_INTERVIEW_TARGETS)} sent\n")


def send_test():
    """Send a test email to yourself to verify credentials work."""
    print("🧪 Sending test email to yourself...")
    subject = "FORGE Gmail Script — Test ✅"
    body = f"Test sent at {datetime.now().isoformat()}. Gmail outreach script is working."
    send_email(GMAIL_USER, subject, body, "yourself")


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 scripts/send_gmail.py test          — test credentials")
        print("  python3 scripts/send_gmail.py creators      — send creator partnership emails")
        print("  python3 scripts/send_gmail.py interviews    — send user interview requests")
        print("  python3 scripts/send_gmail.py all           — send all")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "test":
        send_test()
    elif cmd == "creators":
        run_creator_outreach()
    elif cmd == "interviews":
        run_user_interviews()
    elif cmd == "all":
        send_test()
        time.sleep(2)
        run_creator_outreach()
        run_user_interviews()
    else:
        print(f"Unknown command: {cmd}")
