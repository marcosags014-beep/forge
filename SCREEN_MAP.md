# FORGE — SCREEN MAP
**Date:** 2026-06-12  
**Format:** Every screen, every state, every component. Visual hierarchy + user flow.

---

## LEGEND
```
[PAGE]        Top-level route
  [SECTION]   Named section within a page  
  (STATE)     UI state variant
  → action    User action
  ← result    System response
  🔒          Pro-gated
  ⚠️           Known issue
  ❌           Broken in production
```

---

## SHELL COMPONENTS (present on all app routes)

### Sidebar (desktop ≥768px)
```
[SIDEBAR]
  Logo: FORGE flame icon + wordmark
  Nav items:
    → /          Dashboard (home icon)
    → /vitals    Vitals (heart icon)
    → /body      Body (dumbbell icon)
    → /wealth    Wealth (trending-up icon)
    → /mind      Mind (brain icon)
    → /insights  Insights (lightbulb icon)
    → /journal   Journal (book icon)
    → /review    Review (bar-chart icon)
    → /oracle    Oracle (sparkles icon)
    → /settings  Settings (gear icon)
  Bottom: Pricing link (if not Pro)
```

### Mobile Top Bar
```
[MOBILE_TOP_BAR]  (visible on <768px)
  Left:  Hamburger menu button → opens Sidebar overlay
  Center: FORGE logo (links to /)
  Right: [empty spacer]
```

### Bottom Navigation (mobile)
```
[BOTTOM_NAV]  (visible on <768px, fixed bottom)
  Items: (inferred from codebase structure)
  Home | Vitals | Body | Wealth | Mind
  ⚠️ Oracle, Journal, Insights, Review are only in sidebar (discoverable only via hamburger)
```

### Quick Log FAB
```
[QUICK_LOG_FAB]  (floating bottom-right, all app pages)
  State (collapsed): Orange circle, + icon
  → tap
  State (expanded): Shows log options
    → Log Vitals (→ /vitals)
    → Log Workout (→ /body, workout tab)
  ⚠️ Only covers 2 of 6 modules
```

### Error Boundary
```
[ERROR_BOUNDARY]  (wraps all page content in LayoutShell)
  (normal): transparent passthrough
  (error caught): Shows error message + reload button
  ⚠️ No sub-page error boundaries — one crash = full page blank
```

---

## SETUP FLOW (no sidebar)

### `/setup`
```
[SETUP_PAGE]
  Progress dots: ● ○ ○  (step 1 of 3)

  (step 1: NAME)
  ─────────────
  Subheading: "What should I call you?"
  Input: text, placeholder "First name or nickname"
  Button: "Continue" (no disabled state — iOS Safari fix)
  → enter name + Continue
  ← advance to step 2

  (step 2: FOCUS)
  ───────────────
  Progress dots: ● ● ○
  Subheading: "What's your primary focus right now?"
  6 selector buttons (type="button" — iOS Safari fix):
    Fitness | Health | Wealth | Mind | Balance | Performance
  Each: icon + label, selected = orange border + bg
  Button: "Continue"
  → select focus + Continue
  ← advance to step 3

  (step 3: IDENTITY)
  ──────────────────
  Progress dots: ● ● ●
  Subheading: "Who do you want to become?"
  Helper text: "Be specific. 'I want to be a high-performing athlete who controls their finances' is better than 'healthy.'"
  Textarea: 3 rows
  Button: "Start FORGE" (primary CTA)
  → fill identity + Start FORGE
  ← saves UserProfile to localStorage
  ← redirects to /

  ⚠️ No validation on any field (user can submit empty)
  ⚠️ Identity field not framed as Oracle's primary context
  ⚠️ No "here's what happens next" after completion
```

---

## DASHBOARD — `/`

```
[DASHBOARD]
  Header: 
    "Good [morning/afternoon/evening], [name]"
    Subheading: [day of week], [date]

  [LIFE_SCORE_RING]
    Large SVG ring, overall score 0–100
    Score color: green(≥75) / yellow(50–74) / red(<50)
    Label: "Life Score"

  [DOMAIN_ROW]
    4 cards: Health | Body | Wealth | Mind
    Each: score number + trend arrow (↑↓→) + domain label
    Tap → navigates to module page

  [ALIGNMENT_SCORE_BAR]
    Label: "Alignment Score — [score]%"
    Subtext: "[habitRate]% habits · [keptRate]% commitments"
    Bar: full width, color-coded
    (if overdue): "⚠ [n] overdue commitment[s]" in red
    Color: green(≥70) / yellow(40–69) / red(<40)

  [ORACLE_BRIEF_CARD]
    Header: "ORACLE · Today's Brief" + Sparkles icon
    (loading): 3 shimmer/pulse lines
    (loaded): Brief text (≤200 tokens)
    (Pro): "Refresh" button
    ← Cached in forge_oracle_daily, one generation/day
    ❌ Broken in production (no ANTHROPIC_API_KEY)

  [TODAY_HABITS]
    Label: "Today's Habits"
    (no habits): empty / prompt to add
    (has habits): List
      Each: Circle/CheckCircle2 + habit name
      → toggle → updates habitsStore

  [TODAY_COMMITMENTS]
    Label: "Today's Commitments"  
    (overdue): Red section with broken commitment count
    (active): List of today's tasks
    (none): empty state

  [FOCUS_ACTIONS]
    Label: "Focus Actions"
    2–3 bullet points from Oracle
    ❌ Likely empty if Oracle broken

  [PROJECTIONS]
    1–3 short projection statements
    Color: green(positive) / yellow(warning) / gray(neutral)
    Each has icon

  [PRO_NUDGE]  🔒  (shown after 7 days, if not Pro)
    "Unlock Oracle's full intelligence"
    → /pricing

  (new user, no data)
  [DAY_1_STATE]
    Oracle Day 1 guidance is primary content
    ❌ May be blank if Oracle broken
    ⚠️ No explicit first-action prompt
```

---

## VITALS — `/vitals`

```
[VITALS_PAGE]
  Header: "Health & Performance" / "Vitals" (text-gradient)

  [LOG_FORM_CARD]
    Header: "Log Today — [date]"
    (native): Apple Health import button
    Save button

    Grid inputs:
      Sleep Hours: number input (0–12, step 0.5)
      RHR (bpm): number input (30–120)

    Sliders (range inputs):
      Sleep Quality: 1–10 with Moon icon
      HRV: 20–150ms with Heart icon
      Energy: 1–10 with Zap icon
      Mood: 1–10 with Smile icon

    Notes: textarea (2 rows)

    → Save
    ← vitalsStore.save(), button flashes "Saved!"
    ⚠️ No validation on impossible values
    ⚠️ HRV slider: no context for user ("is 60ms good?")

  [SNAPSHOT_CARDS]  (only if data exists)
    2×2 grid:
      Sleep: "[hours]h" + "Quality [x]/10"
      HRV: "[x]ms" + "RHR [x]bpm"
      Energy: "[x]/10"
      Readiness: "[x]%"

  [READINESS_TREND_CHART]  (if >1 entry)
    14-day LineChart
    X: date labels, Y: 0–100
    Orange line

  [HRV_CHART]  (if >1 entry)
    LineChart, green line

  [SLEEP_CHART]  (if >1 entry)
    LineChart, blue line

  [HISTORY_TABLE]  (if entries exist)
    Scrollable max-h-64
    Rows: date | sleep | HRV | energy | readiness
    ⚠️ No edit/delete

  (empty state)
  ⚠️ Just shows the log form. No guidance. No preview of what the charts will look like.
```

---

## BODY — `/body`

```
[BODY_PAGE]
  Header: "Physical Performance" / "Body"
  Tab bar: [Workouts] [Nutrition] [Body]

  ════════════════
  TAB: WORKOUTS
  ════════════════

  [WORKOUT_LOGGER_CARD]
    Header: "Log Workout" + duration input (minutes)
    Templates row: [Push] [Pull] [Legs] [Cardio]
      → click template → populates exercises below

    Exercise blocks (1+):
      Exercise name input (free text, no autocomplete ⚠️)
      Sets:
        Each row: #[n] | [reps] reps @ [weight] kg
        reps: number input (w-14)
        weight: number input (w-16, step 2.5)
      "+ Add set" button

    Controls:
      "+ Exercise" button (outline)
      "Save Workout" button (primary)
      → Save (if any exercise named)
      ← workoutsStore.save(), resets form, "Saved!"

  [WEEKLY_VOLUME_CHART]  (if workouts exist)
    Bar chart, days of week, height = minutes

  [RECENT_WORKOUTS_LIST]  (last 5)
    date | exercise names joined | duration
    ⚠️ No edit/delete

  ════════════════
  TAB: NUTRITION
  ════════════════

  [NUTRITION_FORM_CARD]
    Header: "Nutrition Today"
    Save button

    Grid:
      Calories (kcal): number, step 50
      Protein (g): number, step 5
      Carbs (g): number, step 5
      Fat (g): number, step 2
      Water (L): number, step 0.25

    Macro bars:
      Protein: orange bar, hardcoded max 300g ⚠️
      Carbs: blue bar
      Fat: yellow bar

  [PROTEIN_TREND_CHART]  (if >1 entry)
    LineChart, orange line

  ════════════════
  TAB: BODY
  ════════════════

  [BODY_METRICS_CARD]
    Body Weight (kg): number, step 0.1
    Body Fat (%): number, step 0.5
    "Log" button → bodyStore.save()

  [WEIGHT_TREND_CHART]  (if >1 entry)
    LineChart, orange line

  (all tabs — empty state)
  ⚠️ Just the log form, no guidance, no preview
```

---

## WEALTH — `/wealth`

```
[WEALTH_PAGE]
  Header: "Financial Intelligence" / "Wealth"

  [SUMMARY_CARDS]  3-column grid
    Net Balance: €[total], green(+) or red(−)
    Monthly Income: €[sum], green
    Monthly Spent: €[sum], red

  [TRANSACTION_FORM]
    Expense/Income toggle (pill tabs)
    Amount (€): number, step 0.01
    Date: date picker
    Category: select dropdown (11 options)
    Description: text input
    "Add Transaction" button (full width primary)
    → save → financeStore.save(), clears amount+desc

  [SPENDING_PIE]  (if expenses exist)
    Donut chart, 140×140
    Legend: category | amount

  [MONTHLY_CASH_FLOW_CHART]  (if >1 month)
    Bar chart, 6 months
    Green = income, red = expenses

  [TRANSACTION_HISTORY]  (if transactions exist)
    Scrollable max-h-80
    Last 20 transactions
    Each: color dot | description + category + date | ±€amount
    ⚠️ No edit/delete
    ⚠️ No pagination (old transactions invisible)

  [WEALTH_PROJECTIONS]
    Monthly savings input (pre-filled from actual data)
    Annual return slider (1–15%, default 7%)
    5-year milestone | 10-year milestone
    Area chart (20 years): total value + contributed
    Disclaimer text
    ← Best feature in Wealth module

  (empty state)
  ⚠️ Summary cards show €0.00. No guidance to log first transaction.
```

---

## MIND — `/mind`

```
[MIND_PAGE]
  Header: "Mental OS" / "Mind"
  Tab bar (scrollable on mobile): [Habits] [Commitments] [Goals] [Achievements]

  ════════════════
  TAB: HABITS
  ════════════════

  [ADD_HABIT_FORM]
    Name input + Category select (Health/Fitness/Mind/Finance/Social)
    Enter key or + button to add
    ⚠️ Category list inconsistent with app taxonomy

  [HABITS_LIST_CARD]  (if habits exist)
    Header + 7-day column labels (M T W T F S S)
    Each habit row:
      Circle/CheckCircle2 (toggle today's completion)
      Habit name (strikethrough if done)
      [n]🔥 streak (if streak > 0)
      7-day grid (orange squares = done, gray = missed)
      Trash icon (hover)
    → toggle → habitsStore.toggle(id, today)
    → delete → habitsStore.delete(id)

  ════════════════
  TAB: COMMITMENTS
  ════════════════

  [WORD_KEPT_RATE_BAR]  (if tasks exist)
    "Word Kept Rate: [n]%"
    Bar: green/yellow/red
    "[done] kept · [overdue] overdue · [active] active today"

  [OVERDUE_SECTION]  (if overdue tasks exist)
    Red card, pulsing dot
    "Overdue — [n] broken commitment[s]"
    Each: Circle → hover green | task title | "Committed [date] — [n]d ago" | trash
    → toggle → marks complete

  [ADD_COMMITMENT_FORM]
    "What did you commit to doing?" input
    Priority: [high] [medium] [low] pills
    Date picker
    "+ Add" button

  [TODAY_COMMITMENTS_LIST]  (if active tasks created today)
    Each: Circle | title + priority badge | due date | trash

  (no tasks at all)
  [EMPTY_STATE]
    ListTodo icon
    "No commitments yet."
    "A commitment is a promise to yourself — add one above."

  [DONE_LIST]  (if completed tasks)
    Scrollable max-h-40
    CheckCircle2 | strikethrough title | trash

  ════════════════
  TAB: GOALS
  ════════════════

  "Goals" label + "New Goal" button

  (no goals, no form)
  [EMPTY_STATE]
    Target icon
    "No goals yet. Create your first one."

  (showForm = true)
  [ADD_GOAL_FORM_CARD]
    Title input
    Category select + Date input
    Notes textarea "Why does this goal matter?"
    "Create Goal" + "Cancel" buttons

  [ACTIVE_GOALS_LIST]
    Each goal card:
      ChevronRight (category color) | title | category badge | due date
      Progress % | Trash icon
      Progress slider (range 0–100)
      Visual progress bar
      Notes (italic quote)
      → slide → goalsStore.save() with new progress
    ⚠️ No completion ceremony at 100%
    ⚠️ No milestone UI despite schema support

  ════════════════
  TAB: ACHIEVEMENTS
  ════════════════

  "[n]/16" counter
  Overall progress bar

  [UNLOCKED_GRID]  (if achievements earned)
    "Unlocked ([n])"
    2×4 grid (md: 4 columns)
    Each: emoji (3xl) | title | description
    Yellow border + bg
    ⚠️ animate-unlock class on latest (30s window)

  [LOCKED_GRID]
    "Locked ([n])"
    Same grid, grayscale + opacity-40 + lock icon
    ⚠️ No "X more days until unlock" progress

  (no achievements)
  [EMPTY_STATE]
    Trophy icon
    "No achievements yet. Log vitals, complete habits, hit your goals."

  ⚠️ Achievements only checked when this tab is mounted
  ⚠️ No notification when achievement unlocks
```

---

## INSIGHTS — `/insights`

```
[INSIGHTS_PAGE]
  Header: "Intelligence Layer" / "Insights" + Lightbulb icon

  [MENTAL_HEALTH_BANNER]  (conditional)
    (watch): Blue — "Worth checking in with yourself today."
    (concern): Yellow — "Your mood and energy have been lower than usual."
    (crisis): Red — "It looks like you've been having a hard time lately."
      → "See support resources" → expands with phone numbers
    Dismiss X button

  [SUMMARY_ROW]  (if scores exist)
    2×2 grid (md: 4 columns):
      Life Score: [n], color by score
      Alerts: [n], red if >0
      Wins: [n], green if >0
      Insights: [total visible], orange

  [CORRELATION_CHART]  (if ≥5 vitals)
    "Sleep → Mood Correlation"
    Pearson r label: "Strong/Moderate/Weak positive/negative"
    ScatterChart: X=sleep hours, Y=mood, orange dots

  [INSIGHTS_HEADER_ROW]
    "Your Insights" | "Deep AI Analysis" button
    → click AI button → fetch('/api/oracle', mode='insights')
    ← 3–5 AI insight cards appended to list
    ❌ No API key in production

  [INSIGHT_CARDS_LIST]
    Each card:
      Left border color: red(alert) / yellow(warning) / green(win) / blue(info)
      Severity badge + domain label
      Title (sm, semibold)
      Body text (xs, muted)
      Action link (if present)
      X button (hover) → dismiss (session-only ⚠️)
    Staggered fade-in animation

  (no cards)
  [EMPTY_STATE]
    Lightbulb icon
    "No insights yet. Log vitals, workouts, habits, and transactions to start seeing patterns."

  [FOOTER]
    Crisis phone numbers (always visible)
    "You don't have to be in crisis to talk to someone."
```

---

## JOURNAL — `/journal`

```
[JOURNAL_PAGE]
  Header: [Day of week, Month Day] + date navigator (← →)
  (today): forward button disabled

  [MOOD_CARD]
    "Today's Mood" | "[n]/10" (color-coded)
    Range slider 1–10
    "Awful" / "Okay" / "Amazing" labels

  [PROMPT_CARD]
    "Today's Prompt" (orange, xs)
    Current prompt in italics
    ↻ shuffle button

  [EDITOR_CARD]
    Textarea (10 rows), "Write freely. No one reads this but you and Oracle."
    Footer:
      "[n] words" counter
      "Ask Oracle" button (requires content, shows spinner)
      "Save" button → journalStore.save()

  [AI_REFLECTION_CARD]  (after Oracle call)
    Sparkles icon + "Oracle's Reflection"
    2–3 sentences
    Fade-in slide-in animation
    ❌ Empty in production (no API key)

  [RECENT_ENTRIES]
    "Recent Entries" label
    Up to 5 past entries (excluding current date)
    Each: date | mood score | 2-line preview (line-clamp-2)
    → click → navigates to that date
```

---

## REVIEW — `/review`

```
[REVIEW_PAGE]
  Header row:
    "Performance Analytics" / "Weekly Review"
    Week navigator: ← [Week of Mon DD, YYYY] →
    (current week): → button disabled

  [DOMAIN_RINGS]  4-column grid
    Each ring: 80×80 SVG
      Outer ring: score fill (color-coded)
      Center: score number
    Label: Health / Body / Wealth / Mind
    Trend delta: ↑+X / ↓-X / → flat

  [RADAR_CHART]  (if scores exist)
    PolarGrid + PolarAngleAxis
    Radar fill: orange with 15% opacity
    ⚠️ Past-week navigation doesn't actually filter historical data

  [WINS_CARD]
    Trophy icon (green)
    Bullet list of auto-calculated wins (or AI wins if generated)

  [IMPROVEMENTS_CARD]
    TrendingUp icon (yellow)
    Bullet list of auto-calculated improvements

  [AI_COACH_ASSESSMENT_CARD]  🔒 (Pro)
    Header: "AI Coach Assessment" + PRO badge (if free)

    (free user)
    Blurred preview: 3 lines of sample text (first line sharp, rest blurred)
    Gradient overlay
    Lock icon + "Unlock your AI coach analysis"
    Description text
    "Start Free Trial" → /pricing

    (pro user, not generated)
    "Click 'Generate Review' to get your AI coach assessment"
    "Generate Review" button

    (pro user, generating)
    3 shimmer lines

    (pro user, generated)
    Narrative paragraph
    ❌ API key missing in production

  [NEXT_WEEK_FOCUS]  (if AI generated nextWeek array)
    3 cards: numbered (1/2/3) + focus text
    Orange border
```

---

## ORACLE — `/oracle`

```
[ORACLE_PAGE]
  [AGENT_SELECTOR]
    5 buttons:
      ORACLE (General) | Vitals Coach | Fitness Coach | Wealth Advisor | Mind Coach
    Selected: orange border + bg
    Each has custom system prompt

  [CHAT_AREA]
    (empty chat)
    [EMPTY_STATE_PROMPTS]
      4 suggestion buttons:
        "What should I focus on today?"
        "Analyze my alignment score"
        "What patterns do you see in my data?"
        "How is my [current week] looking?"
      → click → populates input and sends

    (messages exist)
    [MESSAGE_LIST]
      User messages: right-aligned, orange bg
      Assistant messages: left-aligned, card bg
      Each: content | timestamp (xs, muted)
      [ACTION_BUTTONS]  (parsed from assistant response)
        Orange "Add habit: [name]" button
        → click → habitsStore.save() → turns green "Added ✓"
        Orange "Add goal: [title]" button
        → click → goalsStore.save() → turns green "Added ✓"
        ⚠️ Buttons appear inconsistently (Oracle doesn't always emit tokens)
        ⚠️ No confirmation of what was added beyond button color change

  [INPUT_AREA]
    Textarea: "Ask Oracle anything about your data..."
    Send button (or Enter)
    → send → POST /api/oracle with userData, history (last 8), message
    ← streams? No. Full response waits 5–8s ⚠️
    ❌ API key missing in production

  ⚠️ Chat history has no management (clear, sessions, search)
  ⚠️ No typing indicator during generation
```

---

## SETTINGS — `/settings`

```
[SETTINGS_PAGE]
  Header: "Configuration" / "Settings"

  [PROFILE_SECTION]
    Your name: input + Save button
    Primary focus: display-only (from setup)
    Member since: display-only
    → Save → profileStore.save()

  [DATA_SECTION]
    3×2 grid: Vitals | Workouts | Transactions | Habits | Goals | Journal counts
    "All data stored locally. We never upload or sell your data."
    "Export All Data (JSON)" button → downloads forge-export-[date].json

  [NOTIFICATIONS_SECTION]
    Daily vitals reminder toggle (8:00 AM)
    → toggle on → requestNotificationPermission() + scheduleDailyVitalsReminder()
    → toggle off → cancelDailyReminder()
    (native): "Apple Health auto-import is active" green indicator
    ⚠️ No iOS PWA notification support

  [APPEARANCE_SECTION]
    Theme: "Dark" badge
    "Always dark — the only correct choice"
    ⚠️ No light mode. No actual preference control.

  [PRO_SECTION]
    (not Pro)
    "Unlock unlimited Oracle queries..."
    "Start 7-Day Free Trial" → /pricing
    Referral code display + copy button

    (is Pro)
    "Pro — Active" badge (orange)
    "Manage Subscription" button (if customerId) → /api/portal → Stripe portal
    Referral code display + copy button

  [CLOUD_SYNC_SECTION]
    (no Supabase configured)
    "Cloud sync not configured yet."

    (Supabase configured, not signed in)
    "Sync your data across all devices."
    Google sign-in button (SVG logo + "Continue with Google")
    → click → supabase.auth.signInWithOAuth({ provider: 'google' })
    ❌ Google OAuth not configured — will error

    "or use email" divider
    Email input + "Send link" button
    → click → supabase.auth.signInWithOtp()
    ← "Check your email. Click the link sent to [email]."
    ✅ Magic link works

    (signed in)
    "Sync active" green badge + email address
    "Save to cloud" button → pushAllToCloud()
    "Restore" button → pullFromCloud() + page reload
    Status text (3s display)
    "Sign out of sync" link

  [ACCESS_CODE_SECTION]  (only if not Pro)
    "Have a founder or partner access code?"
    Code input (mono, uppercase, tracking-widest) + Redeem button
    (success): "✓ Founder access activated — enjoy FORGE Pro."
    (error): "Invalid code. Check and try again."
    ⚠️ Valid codes (MARCOS-FORGE-FOUNDER, FORGE-BETA-2026) exposed in client bundle

  [DANGER_ZONE]
    Red border card
    "Delete all FORGE data" warning text
    (initial): "Reset All Data" button
    → click → confirmReset = true
    (confirmed):
      "Are you absolutely sure? This cannot be undone."
      "Yes, delete everything" → clears all forge_* localStorage → redirect /setup
      "Cancel" button

  Footer: version info + privacy/terms/support links
```

---

## MARKETING PAGES (no sidebar)

### `/pricing`
```
[PRICING_PAGE]
  Nav: Logo + "Open App" + "Try Free" CTA

  Hero section:
    Badge: "Personal Life OS · Health · Body · Wealth · Mind"
    H1: "Stop deciding. Just do."
    Description + "Free to start · No credit card"
    CTAs: "Get Started Free" | "See pricing"

  Social proof bar:
    50+ Countries | 60s Daily log | 4 domains | €0 to start

  How it works (3 steps):
    01 Log in 60 seconds
    02 Oracle connects the dots
    03 One clear priority. You execute.

  Oracle demo block:
    Sample data snapshot
    Sample Oracle morning brief response
    ← Most persuasive content on the site

  Alignment Score section:
    Formula display: Habit Rate (60%) + Kept Rate (40%) × Life Score
  
  Scenarios (3 cases):
    Recovery risk | Root cause spending | Integrity gap

  Pricing cards:
    Monthly/Annual toggle (annual default, −45% badge)
    Free: €0 | feature list | "Start Free — No Card"
    Pro: €8.25/mo (annual) | €14.99/mo | feature list
      "Start 7-Day Free Trial" → startCheckout()
      ⚠️ Checkout flow requires working Stripe config

  Trust section:
    Zero server storage | Oracle AI privacy | Export | Cloud sync

  Cross-domain intelligence visual

  FAQ (6 questions, accordion)

  Final CTA: "What would your Alignment Score be?"

  Email capture: "Get the FORGE weekly brief"
    → POST /api/waitlist

  Footer: nav links + legal
```

### `/setup` → (documented above)

### `/beta`
```
[BETA_PAGE]
  (on mount): setProUser('beta-tester', '2099-12-31')
  Logo + "Beta Tester — Full Access Activated" badge
  "You're in." h1
  Product description
  4-module grid: Health | Fitness | Wealth | Mind
  "Enter FORGE" button → / or /setup based on profile
```

### `/auth/callback`
```
[AUTH_CALLBACK_PAGE]
  Loading spinner (visible briefly)
  On mount:
    Gets ?code= from URL
    → supabase.auth.exchangeCodeForSession(code)
    ← redirect to /settings
  (no code or no supabase): immediate redirect to /settings
  ❌ Google OAuth not configured so this route is never reached via Google
```

---

## EMPTY STATE INVENTORY

| Screen | Empty State | Quality | Notes |
|--------|-------------|---------|-------|
| Dashboard (new user) | Day 1 Oracle brief (if API works) | 4/10 | Generic if API broken |
| Dashboard (no habits) | Nothing | 2/10 | Should prompt to add habits |
| Vitals | Just the log form | 2/10 | No preview, no motivation |
| Body → Workouts | Just the log form | 2/10 | No guidance |
| Body → Nutrition | Just the log form | 2/10 | No guidance |
| Body → Body Metrics | Just the log form | 2/10 | No guidance |
| Wealth | €0.00 summary cards | 3/10 | Slightly better (numbers visible) |
| Mind → Habits | Add form only | 3/10 | No example habits |
| Mind → Commitments | "No commitments yet" + explanation | 6/10 | Best empty state |
| Mind → Goals | "No goals yet" | 4/10 | Too sparse |
| Mind → Achievements | "No achievements yet" + guidance | 6/10 | Adequate |
| Insights | "No insights yet" | 5/10 | Explains what's needed |
| Journal | Textarea + prompt | 6/10 | Actually fine |
| Review | 0-score rings + no AI | 4/10 | Misleading zero rings |
| Oracle | Quick-start prompts | 8/10 | Best empty state in product |

---

## LOADING STATE INVENTORY

| Screen | Loading State | Quality |
|--------|--------------|---------|
| Oracle brief (dashboard) | 3 shimmer/pulse lines | 7/10 |
| Oracle chat (generating) | Button text change + no visible indicator | 3/10 |
| Oracle AI insights button | "Analysing…" + spinning RefreshCw | 6/10 |
| Weekly Review AI generate | 3 shimmer lines | 7/10 |
| Journal Oracle reflection | Spinning Sparkles icon | 6/10 |
| LayoutShell setup check | `null` (blank screen) | 1/10 |
| Checkout redirect | "Redirecting…" + spinner | 7/10 |
| Sync push/pull | Status text | 5/10 |

---

## ERROR STATE INVENTORY

| Screen | Error State | Quality | Notes |
|--------|-------------|---------|-------|
| Oracle API failure | "Oracle unavailable. Check your ANTHROPIC_API_KEY" | 2/10 | Shows dev message to prod users |
| Oracle insights failure | Fallback to raw text card | 5/10 | Recovers gracefully |
| Checkout failure | Toast: "Checkout unavailable" | 6/10 | Appropriate |
| Portal failure | `alert()` | 1/10 | Native browser alert — broken UX |
| Sync failure | Status text "Sync failed — check connection" | 4/10 | Too vague |
| Auth callback error | Silent redirect to /settings | 5/10 | Recovers but user doesn't know why |
| localStorage parse error | `[]` returned silently | 1/10 | Silent data loss |
| Any unhandled crash | Root ErrorBoundary | 3/10 | No recovery path |
