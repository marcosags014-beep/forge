import Stripe from 'stripe'

const usedSessions = new Set<string>()

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return new Response('Stripe not configured', { status: 503 })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-05-27.dahlia' })

  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return new Response('Invalid webhook signature', { status: 400 })
  }

  // Log all events to console (Vercel logs)
  console.log('Stripe webhook:', event.type)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      // The client will poll /api/activate with session_id to get their Pro token
      console.log('Payment completed for session:', session.id)
      break
    }
    case 'customer.subscription.deleted': {
      // Subscription cancelled — we can't revoke localStorage tokens,
      // but they expire naturally (30-day rolling window from activate)
      const sub = event.data.object as Stripe.Subscription
      console.log('Subscription cancelled:', sub.id)
      break
    }
  }

  return new Response('ok', { status: 200 })
}

export { usedSessions }
