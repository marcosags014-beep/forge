import Stripe from 'stripe'
import { createHmac } from 'crypto'

// Simple stateless token: base64(expiry_iso) + "." + HMAC(expiry_iso, TOKEN_SECRET)
function createProToken(until: string): string {
  const secret = process.env.TOKEN_SECRET ?? 'forge-dev-secret-change-in-prod'
  const sig = createHmac('sha256', secret).update(until).digest('hex').slice(0, 16)
  return `${Buffer.from(until).toString('base64')}.${sig}`
}

export function verifyProToken(token: string): boolean {
  try {
    const [b64, sig] = token.split('.')
    if (!b64 || !sig) return false
    const until = Buffer.from(b64, 'base64').toString('utf8')
    if (new Date(until) <= new Date()) return false
    const secret = process.env.TOKEN_SECRET ?? 'forge-dev-secret-change-in-prod'
    const expected = createHmac('sha256', secret).update(until).digest('hex').slice(0, 16)
    return sig === expected
  } catch { return false }
}

// In-memory set to prevent session replay (resets on deploy — acceptable for MVP)
const usedSessions = new Set<string>()

export async function GET(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Stripe not configured' }, { status: 503 })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-05-27.dahlia' })

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) return Response.json({ error: 'Missing session_id' }, { status: 400 })
  if (usedSessions.has(sessionId)) return Response.json({ error: 'Session already used' }, { status: 409 })

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return Response.json({ error: 'Payment not completed' }, { status: 402 })
    }

    usedSessions.add(sessionId)

    // Token valid for 35 days (billing cycle + grace)
    const until = new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString()
    const token = createProToken(until)
    const customerId = typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? null)

    return Response.json({ token, until, customerId })
  } catch (error) {
    console.error('Activate error:', error)
    return Response.json({ error: 'Could not verify payment' }, { status: 500 })
  }
}
