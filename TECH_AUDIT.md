# FORGE — TECHNICAL AUDIT
**Date:** 2026-06-12  
**Auditor Role:** Senior Engineer · CTO-lens  
**Method:** Full codebase read  
**Format:** Brutally honest. Scored 1–10.

---

## OVERALL TECH SCORE: 5.5/10

Good foundation choices (Next.js App Router, TypeScript, local-first). Critical production breakages (API key missing, OAuth incomplete). Significant security gaps. No observability. Would not pass a Series A technical due diligence without addressing the items in this document.

---

## 1. ARCHITECTURE

**Score: 7/10**

### Stack
```
Framework:     Next.js 16.2.6 (App Router)
Language:      TypeScript
Styling:       Tailwind CSS
UI Components: Custom (shadcn-derived)
Charts:        Recharts
Auth:          Supabase Auth (Google OAuth + Magic Link)
Database:      localStorage (client) + Supabase (optional cloud sync)
AI:            Anthropic claude-sonnet-4-6 via direct API
Payments:      Stripe (Checkout + Webhooks)
Deployment:    Vercel (Hobby plan)
Analytics:     Vercel Analytics (2 events only)
```

### What's architecturally correct
- **Local-first is the right call** for sensitive personal data. Eliminates GDPR database liability, removes server infrastructure costs, enables offline use, creates trust advantage.
- **Next.js App Router** is appropriate. Static generation for 83 pages is efficient. API routes for Oracle/Stripe/Supabase are cleanly separated.
- **TypeScript throughout** — types defined in `lib/types.ts`, used consistently.
- **Supabase as optional sync layer** — correct pattern: local-first with opt-in cloud.

### What's architecturally wrong

1. **All business logic lives in `lib/store.ts`** — one file that is: localStorage CRUD, score calculations, insight generation, AI data aggregation, achievement checking, and utilities. This file is a God Object. At current size (~800 lines) it's manageable. At 2000 lines it becomes untestable.

2. **No separation of concerns in store** — `calculateLifeScores()`, `generateInsights()`, `getAllDataForAI()`, `checkAndUnlockAchievements()` are all in the same file as localStorage adapters. These should be separate modules.

3. **No service layer** — API calls are made directly from page components (`fetch('/api/oracle', ...)` inline in page files). No abstraction, no retry logic, no error handling standardization.

4. **In-memory rate limiter on a serverless function** — The Oracle rate limiter uses a `Map` in module scope. On Vercel, each serverless instance has its own memory. Under any real load, multiple instances = no effective rate limiting. A determined user could exhaust your Anthropic API quota.

---

## 2. SECURITY

**Score: 3/10** — This is the most serious section.

### Critical Issues

**1. Pro token is client-side and trivially bypassable**
```typescript
// lib/store.ts
export function isProUser(): boolean {
  const stored = localStorage.getItem('forge_pro')
  if (!stored) return false
  const { until } = JSON.parse(stored)
  return new Date(until) > new Date()
}
```
Any user can open DevTools and run:
```javascript
localStorage.setItem('forge_pro', JSON.stringify({ token: 'x', until: '2099-12-31', customerId: null }))
```
They now have permanent Pro access. The HMAC-signed token in `/api/activate` exists but `isProUser()` only checks the `until` date, not the token signature. **The Pro gate is effectively fake.**

**2. Access codes stored as base64 in client-side code**
```typescript
const valid = [
  'TUFSR09TLUZPUkdFLUZPVU5ERVI=',  // btoa('MARCOS-FORGE-FOUNDER')
  btoa('FORGE-BETA-2026'),
]
```
base64 is not encryption. Anyone who reads the source bundle (which is public) can decode these in 5 seconds. Every user who visits the site now knows both access codes. These codes should be validated server-side against a database or environment variable.

**3. Oracle API has no authentication**
The `/api/oracle` endpoint accepts POST requests from anyone. The rate limiter is broken (see above). There is no check that the requester is a legitimate FORGE user. Any script can call your Oracle endpoint, exhaust your Anthropic API quota, and generate a large bill.

```typescript
// No auth check, no API key validation, no user verification
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'local'
  if (!checkRateLimit(ip)) { ... } // broken on serverless
  // immediately calls Anthropic API
```

**4. Webhook secret validation not verified**
The Stripe webhook at `/api/webhook` presumably validates the Stripe signature — but this wasn't confirmed in the audit. If it doesn't, anyone can POST a fake `payment_intent.succeeded` event and activate Pro.

**5. Supabase anon key is public**
This is by design for Supabase's RLS model — the anon key is safe to expose IF Row Level Security is properly configured. If RLS is not configured on `forge_syncs`, any user can read any other user's sync data by knowing their `user_id`. This needs verification.

### Medium Issues

**6. XSS surface in Oracle output**
Oracle responses are rendered as text (not innerHTML) in the chat interface — this is correct. But if any component ever uses `dangerouslySetInnerHTML` with Oracle output, XSS risk is introduced. Current code appears safe but this needs explicit enforcement.

**7. Journal content is sent to Anthropic API without sanitization**
When user clicks "Ask Oracle" in Journal, their full journal entry text is sent to the Anthropic API. The Anthropic API privacy policy says data is not stored beyond the request, but users should be explicitly informed that journal content leaves their device when they click this button. The current UI just says "Oracle's Reflection."

---

## 3. DATA LAYER

**Score: 6/10**

### localStorage Design
The store pattern (`makeStore<T>(key)`) is clean:
```typescript
function makeStore<T extends { id: string }>(key: string) {
  return {
    getAll(): T[] { ... }
    save(item: T): void { ... }
    delete(id: string): void { ... }
  }
}
```
This is a solid, minimal local persistence pattern for MVP.

### Problems

**1. No data versioning / migration**
If the schema of `VitalEntry` changes (e.g., adding a required field), existing localStorage data becomes incompatible and will cause runtime errors. There is no version field in stored data, no migration runner.

**2. No data size limits**
localStorage is limited to ~5MB per origin. A power user logging daily vitals + workouts + nutrition + transactions for 2 years could approach this limit. No size monitoring, no warning, no overflow strategy.

**3. No data integrity checks**
`getAll()` returns `JSON.parse(localStorage.getItem(key) ?? '[]')`. If the stored JSON is corrupted (partial write, browser bug), the entire store for that key returns `[]` silently. Years of data could be silently lost with no error.

**4. The sync is a full-replace, not a merge**
`pushAllToCloud()` sends all data to Supabase, `pullFromCloud()` replaces all local data. There is no conflict resolution. If a user logs data on two devices without syncing between them, one device's data will be overwritten on pull.

**5. No data pagination**
`workoutsStore.getRecent(10)` — the "recent N" pattern works now. But `financeStore.getAll()` returns everything with no limit. With 3 years of daily transactions (~1000 entries), this creates large in-memory arrays on every render.

---

## 4. API & BACKEND

**Score: 5/10**

### Oracle API (`/api/oracle`)
```typescript
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: TOKEN_LIMITS[mode] ?? 1024,
  system: systemPrompt,
  messages,
})
```
- No streaming (synchronous call, blocks until complete)
- No retry logic (Anthropic API failures return error to user)
- No timeout handling (Vercel default 300s, Anthropic calls are much faster but edge cases)
- No request logging
- **ANTHROPIC_API_KEY missing in production** — every Oracle call returns 500

### Stripe APIs
- Checkout session creation: correct pattern
- Portal session creation: correct pattern
- Webhook: needs validation verification

### Supabase Auth
- Google OAuth flow is implemented client-side correctly
- Magic link OTP is implemented correctly
- But: Google OAuth requires Google Cloud consent screen which is not configured

### Missing APIs
- No `/api/export` — export is client-side only (fine)
- No `/api/user` — no server-side user state
- No `/api/health` — no liveness check endpoint

---

## 5. ERROR HANDLING & OBSERVABILITY

**Score: 1/10** — The lowest score in this audit.

### Error Handling
The pattern throughout the codebase:
```typescript
try {
  // do thing
} catch {
  // silent or generic message
}
```

Specific examples:
- Oracle API failure → "Oracle unavailable. Check your ANTHROPIC_API_KEY in .env.local." (shown to prod users)
- Auth callback error → silently redirects to /settings
- Sync failure → "Sync failed — check connection" (no detail)
- Chart render with malformed data → silent crash, blank chart

**There is no error boundary below the top-level one in LayoutShell.** A crash in any page component (e.g., malformed localStorage data) will show the root error boundary with no recovery path.

### Observability
- **No error tracking.** No Sentry, no Datadog, no Bugsnag. If a user hits a bug, there is no signal.
- **No logging.** `console.error('Oracle error:', error)` is the only logging. Vercel's function logs capture this but it's not searchable or alertable.
- **No performance monitoring.** No Core Web Vitals tracking beyond what Vercel provides by default.
- **No uptime monitoring.** If the Anthropic API goes down, FORGE has no alert.
- **No API latency tracking.** No way to know if Oracle responses are getting slower.

### YC Partner Assessment
> "What broke last week? How do you know?" If you can't answer this, you are flying blind. Sentry free tier takes 30 minutes to add. This is table stakes.

---

## 6. TESTING

**Score: 0/10**

No test files found anywhere in the repository.

- No unit tests
- No integration tests
- No E2E tests (Playwright, Cypress)
- No component tests
- No API route tests

This means:
- Every refactor is a potential regression
- The Stripe webhook logic has never been automatically verified
- The OAuth callback flow has never been tested
- The `calculateLifeScores()` and `getAlignmentScore()` formulas cannot be regression-tested

For an MVP with one developer, zero tests is understandable. For a product handling financial data, health data, and payment flows, it is a risk that will compound.

**Minimum required:** Unit tests for `calculateLifeScores()`, `getAlignmentScore()`, `calculateReadiness()`, and the Oracle action token parser (`parseOracleActions()`).

---

## 7. TYPESCRIPT QUALITY

**Score: 6/10**

### Good
- Core types in `lib/types.ts` are well-defined
- Discriminated unions used for `OracleAction` type
- `as const` assertions used correctly for achievements catalog

### Problems

**1. Type assertions used to paper over mismatches**
```typescript
const goalCat = (['health','fitness','finance','career','personal'].includes(cat) ? cat : 'personal') 
  as 'health' | 'fitness' | 'finance' | 'career' | 'personal'
```
This is a runtime check + compile-time assertion used together. The `as` cast is safe here but indicates the type system isn't doing the work it could be.

**2. `any` types likely present** (not confirmed in full audit but common in similar codebases when bridging JSON from localStorage)

**3. Loose typing on Oracle API response**
```typescript
const body = await req.json()
const { mode = 'chat', message, agentPrompt, history = [], userData } = body
```
`body` is implicitly `any`. No runtime validation of request shape. A malformed request body could cause undefined behavior.

**4. `Anthropic.MessageParam[]` cast**
```typescript
...(history.slice(-8) as Anthropic.MessageParam[]),
```
This trusts client-supplied history to be correctly typed. No validation that client isn't sending malicious content.

---

## 8. PERFORMANCE

**Score: 6/10**

### What's good
- Static generation of 83 pages — fast initial load
- Local-first data — no network calls on app open
- Recharts is lazy-loaded in practice (component-level imports)

### What's concerning

**1. `getAllDataForAI()` on every Oracle call**
This function reads every localStorage store, calls `calculateLifeScores()`, calls `generateInsights()`, and bundles everything into a JSON object. Called on every Oracle request — including simple questions. With 365 days of data, this is a non-trivial computation on the main thread.

**2. `generateInsights()` is an O(n) scan**
Reads all vitals, workouts, habits, goals, transactions. Called on Insights page load AND inside `getAllDataForAI()`. Called twice on every Oracle request from Insights.

**3. No React memoization**
Page components recreate derived data (chart datasets, filtered lists) on every render. `useMemo` is not used. For small datasets this is invisible. For power users with months of data, this will cause jank.

**4. No query limits on `financeStore.getAll()`**
Returns all transactions ever. 1000 transactions × JSON parse × chart computation on every Wealth page render.

**5. Charts all mount simultaneously**
Some pages have 4–5 `<ResponsiveContainer>` charts. All mount and compute on page load. No lazy loading, no virtualization.

---

## 9. DEPENDENCIES & SUPPLY CHAIN

**Score: 7/10**

The dependency footprint is reasonable:
- `@anthropic-ai/sdk` — official SDK
- `@supabase/supabase-js` — official SDK
- `recharts` — well-maintained charting
- `date-fns` — well-maintained date utilities
- `lucide-react` — well-maintained icons
- `@vercel/analytics` — official
- No `moment.js`, no `lodash`, no heavy legacy deps

**Concerns:**
- `next` at `16.2.6` — need to track for security patches
- No `npm audit` results available — likely some moderate advisories
- `stripe` dependency needs to stay up-to-date (PCI compliance implications)

---

## 10. DEPLOYMENT & INFRASTRUCTURE

**Score: 4/10**

### What's working
- Vercel Hobby plan handles current traffic
- Environment variables separated (development vs production in theory)
- Supabase handles auth and sync persistence

### What's broken

**1. ANTHROPIC_API_KEY not in Vercel production**
Every Oracle request in production returns 500. This is the most critical production bug. Fix: `vercel env add ANTHROPIC_API_KEY production`

**2. Vercel Hobby plan limitations**
- 100GB bandwidth/month
- No team collaboration
- No deployment protection
- Serverless function execution limited
- No SLA

For a product handling user data, a Pro or Team plan should be evaluated.

**3. No staging environment**
All changes deploy directly to production. No way to test a deploy before it goes live.

**4. No database backups**
Supabase on the free plan has limited backup options. The `forge_syncs` table has no automated backup strategy.

**5. No secrets rotation plan**
`NEXT_PUBLIC_SUPABASE_ANON_KEY` is in `.env.local` and was committed to the codebase read context. If this key is compromised, there's no documented rotation process.

---

## PRIORITY FIXES (Ranked by Risk)

| Priority | Issue | Risk | Effort |
|---------|-------|------|--------|
| 1 | Add `ANTHROPIC_API_KEY` to Vercel prod | Production broken | 5 min |
| 2 | Add server-side Pro verification (not just `until` date check) | Revenue theft | 1 day |
| 3 | Move access code validation to API route | Security | 2 hours |
| 4 | Add authentication to `/api/oracle` | API abuse / cost | 1 day |
| 5 | Add Sentry error tracking | Observability | 30 min |
| 6 | Add PostHog analytics (10 key events) | Product blindness | 1 day |
| 7 | Add localStorage data integrity checks | Data loss | 2 hours |
| 8 | Add Oracle response streaming | UX/perceived performance | 1 day |
| 9 | Split `lib/store.ts` into domain modules | Maintainability | 2 days |
| 10 | Add unit tests for score calculations | Regression safety | 1 day |
