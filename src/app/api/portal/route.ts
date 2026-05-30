import Stripe from 'stripe'

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Stripe not configured' }, { status: 503 })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-05-27.dahlia' })

  try {
    const { customerId } = await req.json()
    if (!customerId) return Response.json({ error: 'Missing customerId' }, { status: 400 })

    const origin = req.headers.get('origin') ?? 'https://forge-life.vercel.app'
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/settings`,
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    return Response.json({ error: 'Could not open billing portal' }, { status: 500 })
  }
}
