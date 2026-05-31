export async function POST(req: Request) {
  try {
    const { email, source } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      // Notify ourselves of the new lead
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'FORGE <noreply@forge-life.app>',
          to: ['marcosags014@gmail.com'],
          subject: `New FORGE lead: ${email}`,
          text: `New lead from source: ${source ?? 'unknown'}\nEmail: ${email}\nTime: ${new Date().toISOString()}`,
        }),
      }).catch(() => {}) // non-blocking — don't fail the request

      // Send welcome email to the lead
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'FORGE <hello@forge-life.app>',
          to: [email],
          subject: 'You\'re on the FORGE list.',
          text: `Hey,\n\nThanks for your interest in FORGE.\n\nFORGE is a life OS that tracks your health, body, money, and goals — then uses AI to tell you exactly what to focus on today. Free, no account required, your data stays on your device.\n\nGet started now (free): https://forge-five-flax.vercel.app/setup\n\nIf you have questions, reply to this email.\n\n— Marcos, FORGE`,
        }),
      }).catch(() => {})
    }

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
