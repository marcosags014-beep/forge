import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

// Simple in-memory rate limit: max 3 from same IP per hour
const ipMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipMap.get(ip)
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + 3600_000 })
    return true
  }
  if (entry.count >= 3) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    if (!checkRateLimit(ip)) {
      return Response.json({ ok: false, error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const { email, source } = body as { email?: string; source?: string }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }

    // Save to Supabase waitlist table (ignore duplicates)
    if (supabase) {
      try {
        await supabase
          .from('waitlist')
          .insert({ email: email.toLowerCase().trim(), source: source ?? 'landing', created_at: new Date().toISOString() })
          // upsert-style: if unique constraint on email, just ignore
      } catch {
        // Non-fatal — Supabase table may not exist yet; continue
      }
    }

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      // Notify ourselves
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'FORGE <noreply@forge-life.app>',
          to: ['marcosags014@gmail.com'],
          subject: `New FORGE lead: ${email}`,
          text: `New lead from source: ${source ?? 'unknown'}\nEmail: ${email}\nTime: ${new Date().toISOString()}`,
        }),
      }).catch(() => {})

      // Welcome email to lead
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'FORGE <hello@forge-life.app>',
          to: [email],
          subject: "You're on the FORGE list.",
          text: `Hey,\n\nThanks for your interest in FORGE.\n\nFORGE is a life OS that tracks your health, body, money, and goals — then uses AI to tell you exactly what to focus on today. Free, no account required, your data stays on your device.\n\nGet started now (free): https://forge-five-flax.vercel.app/setup\n\nIf you have questions, reply to this email.\n\n— Marcos, FORGE`,
        }),
      }).catch(() => {})
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: 'Failed' }, { status: 500 })
  }
}
