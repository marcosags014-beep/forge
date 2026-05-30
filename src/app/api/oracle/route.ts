import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// In-memory rate limiter — resets on deploy, fine for MVP
const rateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 20) return false
  entry.count++
  return true
}

const SYSTEM_BASE = `You are ORACLE — the AI intelligence layer of FORGE Life OS.

FORGE tracks the user across 4 domains simultaneously:
- Health: Sleep hours/quality, HRV (ms), RHR (bpm), energy (1-10), mood (1-10)
- Body: Workouts (exercises, sets, weight), nutrition (calories, protein, carbs, fat), body weight
- Wealth: Income/expense transactions by category, monthly cash flow, net balance
- Mind: Life goals with progress %, daily habits with completion records, priority tasks

Your operating rules:
1. Be direct and data-specific — cite actual numbers from their data
2. No filler phrases, no generic advice — every sentence must be actionable
3. Speak like a high-performance coach, not a chatbot
4. Cross-domain connections are your superpower: "your HRV drop correlates with your spending spike"
5. If data is missing, name the exact metric to track and why it matters
6. Privacy-first: never imply their data goes anywhere else`

const TOKEN_LIMITS: Record<string, number> = {
  brief: 200,
  insights: 600,
  review: 800,
  chat: 1024,
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'local'
  if (!checkRateLimit(ip)) {
    return Response.json(
      { content: 'Too many requests. Please wait a moment before asking again.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const { mode = 'chat', message, agentPrompt, history = [], userData } = body

    const systemPrompt = agentPrompt
      ? `${SYSTEM_BASE}\n\n${agentPrompt}`
      : SYSTEM_BASE

    let dataSection = ''
    if (userData) {
      const identityContext = userData.profile?.identity
        ? `\n\nUSER'S IDENTITY VISION: "${userData.profile.identity}" — Every recommendation must connect to this vision. Help them become this person.`
        : ''
      const newUserContext = userData.isNewUser
        ? `\n\nDAY 1 CONTEXT: This user just started. No historical data yet. Use their profile (name: ${userData.profile?.name ?? 'unknown'}, goal: "${userData.profile?.primaryGoal ?? 'not set'}") to give highly specific, actionable Day 1 guidance. Tell them exactly what to log first, why it matters, and what their first week should look like.`
        : ''
      dataSection = `\n\n--- USER DATA ---\n${JSON.stringify(userData, null, 2)}\n---${identityContext}${newUserContext}`
    }

    const messages: Anthropic.MessageParam[] = [
      ...(history.slice(-8) as Anthropic.MessageParam[]),
      { role: 'user', content: `${message}${dataSection}` },
    ]

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: TOKEN_LIMITS[mode] ?? 1024,
      system: systemPrompt,
      messages,
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : ''
    return Response.json({ content })
  } catch (error) {
    console.error('Oracle error:', error)
    return Response.json(
      { content: 'Oracle unavailable. Check your ANTHROPIC_API_KEY in .env.local.' },
      { status: 500 }
    )
  }
}
