import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// In-memory rate limiter — per-instance, fine for MVP
const rateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 30) return false
  entry.count++
  return true
}

const SYSTEM_BASE = `You are ORACLE — the AI intelligence layer of FORGE Life OS.

FORGE tracks the user across 6 modules simultaneously:
- Health (Vitals): Sleep hours/quality, HRV (ms), RHR (bpm), energy (1-10), mood (1-10), stress level
- Body: Workouts (exercises, sets, reps, weight, volume), body weight/fat %, body measurements
- Nutrition: Daily calories, protein/carbs/fat grams, meal quality, hydration
- Wealth: Income/expense transactions by category, monthly cash flow, savings rate, net balance, emergency fund
- Mind: Daily habits with completion history, journal entries, daily tasks/commitments
- Goals: Long-term goals with progress %, key results, deadlines

Your operating rules:
1. Be direct and data-specific — cite actual numbers from their data, never generalise
2. No filler phrases, no generic advice — every sentence must be immediately actionable
3. Speak like a world-class high-performance coach who has read all their data
4. Cross-domain connections are your superpower: "your HRV drop this week correlates with your spending spike" — this is the insight no other app gives them
5. If data is missing in a relevant domain, name the exact metric to track and why it matters for their specific situation
6. Privacy-first: their data is only in this conversation — never imply otherwise
7. FORGE's core metric is the ALIGNMENT SCORE — the gap between what users commit to and what they actually do. When alignment is below 70%, address the intention-execution gap directly.
8. If they have overdue commitments, name them specifically. Don't let them hide from their own word.
9. Always end recommendations with the single highest-leverage action they should take right now.

ADDING TO FORGE:
When your recommendation includes a specific habit they should track daily, append EXACTLY this on its own line (one per habit, max 2):
[ADD_HABIT: <habit name> | <category: health|fitness|wealth|mind>]

When your recommendation includes a specific goal they should pursue, append EXACTLY this on its own line (max 1):
[ADD_GOAL: <goal title> | <category: health|fitness|wealth|mind> | <months to complete: 1-24>]

Only emit these when you are recommending something concrete and specific. The habit/goal name must be specific and actionable. Omit entirely if not applicable.`

const TOKEN_LIMITS: Record<string, number> = {
  brief:      200,
  insights:   600,
  review:     800,
  chat:       1024,
  onboarding: 700,
  vision:     1200,
}

async function callWithRetry(
  params: Anthropic.MessageCreateParamsNonStreaming,
  retries = 2
): Promise<Anthropic.Message> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 28_000)
      const result = await client.messages.create(params)
      clearTimeout(timeout)
      return result
    } catch (err: unknown) {
      const isLast = attempt === retries
      if (isLast) throw err
      // Exponential backoff: 500ms, 1000ms
      await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt)))
    }
  }
  throw new Error('Exhausted retries')
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'local'
  if (!checkRateLimit(ip)) {
    return Response.json(
      { content: 'Too many requests. Please wait a moment before asking again.' },
      { status: 429 }
    )
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { content: 'Oracle is temporarily unavailable. Please try again shortly.' },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { mode = 'chat', message, agentPrompt, history = [], userData, stream = false, imageData, mediaType } = body

    const systemPrompt = agentPrompt
      ? `${SYSTEM_BASE}\n\n${agentPrompt}`
      : SYSTEM_BASE

    let dataSection = ''
    if (userData) {
      const identityContext = userData.profile?.identity
        ? `\n\nUSER'S IDENTITY VISION: "${userData.profile.identity}" — Every recommendation must connect to this vision. Help them become this person.`
        : ''

      const alignmentContext = userData.alignment
        ? (() => {
            const { score, habitRate, keptRate, overdueCount } = userData.alignment
            const overdueNote = overdueCount > 0
              ? ` They have ${overdueCount} overdue commitment${overdueCount !== 1 ? 's' : ''} — address this directly.`
              : ''
            return `\n\nALIGNMENT (INTENTION vs EXECUTION): Word Kept score ${score}% (habits: ${habitRate}%, commitments: ${keptRate}%).${overdueNote} Always reference when relevant.`
          })()
        : ''

      const newUserContext = userData.isNewUser
        ? `\n\nDAY 1 CONTEXT: This user just started. Use their profile (name: ${userData.profile?.name ?? 'unknown'}, goal: "${userData.profile?.primaryGoal ?? 'not set'}", identity: "${userData.profile?.identity ?? 'not set'}") to give highly specific, actionable Day 1 guidance. Tell them exactly what to log first and what their first week should look like.`
        : ''

      dataSection = `\n\n--- USER DATA ---\n${JSON.stringify(userData, null, 2)}\n---${identityContext}${alignmentContext}${newUserContext}`
    }

    // Vision mode: image + text content block
    let messages: Anthropic.MessageParam[]
    if (mode === 'vision' && imageData && mediaType) {
      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/webp', data: imageData },
            },
            { type: 'text', text: `${message}${dataSection}` },
          ],
        },
      ]
    } else {
      messages = [
        ...(history.slice(-8) as Anthropic.MessageParam[]),
        { role: 'user', content: `${message}${dataSection}` },
      ]
    }

    const maxTokens = TOKEN_LIMITS[mode] ?? 1024

    // ── Streaming path ────────────────────────────────────
    if (stream) {
      const msgStream = client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      })

      const readable = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder()
          try {
            for await (const event of msgStream) {
              if (
                event.type === 'content_block_delta' &&
                event.delta.type === 'text_delta'
              ) {
                controller.enqueue(encoder.encode(event.delta.text))
              }
            }
          } catch {
            controller.error(new Error('Stream error'))
          } finally {
            controller.close()
          }
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff',
        },
      })
    }

    // ── Non-streaming path (with retry) ──────────────────
    const response = await callWithRetry({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : ''
    return Response.json({ content })

  } catch (error) {
    console.error('Oracle error:', error)
    return Response.json(
      { content: 'Oracle is temporarily unavailable. Your data is safe — please try again in a moment.' },
      { status: 500 }
    )
  }
}
