import Stripe from 'stripe'

const PRICE_ID = process.env.STRIPE_PRICE_ID ?? ''

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Stripe not configured' }, { status: 503 })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-05-27.dahlia' })

  try {
    const { referral } = await req.json().catch(() => ({}))
    const origin = req.headers.get('origin') ?? 'https://forge-life.vercel.app'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${origin}/activate?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
      metadata: { referral: referral ?? '' },
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
      },
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return Response.json({ error: 'Could not create checkout session' }, { status: 500 })
  }
}
