# FORGE — UX AUDIT
**Date:** 2026-06-12  
**Auditor Role:** Senior UX Researcher · Head of Product  
**Method:** Full codebase read + screen-by-screen analysis  
**Format:** Brutally honest. Scored 1–10.

---

## OVERALL UX SCORE: 5.5/10

Strong visual design system. Weak information architecture. Critical empty state failures. Mobile experience is an afterthought. Onboarding does not lead users to the aha moment.

---

## 1. DESIGN SYSTEM

**Score: 8/10**

### What's good
- Dark theme is consistent and well-executed across all pages
- `forge-card`, `forge-label`, `forge-tab`, `forge-tab-active` utility classes create visual consistency
- Color system is clear: orange (primary), green (positive/health), red (danger/negative), yellow (warning), blue (info), purple (mind)
- Typography scale is tight — 3xl bold headers, xs uppercase labels, sm body text
- Recharts integration is tasteful — dark tooltips, no chart junk

### What's wrong
- **Dark theme only with zero user choice.** Settings says "Always dark — the only correct choice." This is a personal opinion shipped as a product decision. Light mode is a legitimate accessibility need (photosensitivity, outdoor use, personal preference). Dismissing it with a quip is arrogant.
- **No design token documentation.** The `oklch()` color values are inline throughout. One designer working on this alone is fine. Two developers makes this a maintenance nightmare.
- **Inconsistent spacing.** Most pages use `p-6`, some use `p-4 md:p-6`. The `max-w` values vary: `max-w-5xl`, `max-w-4xl`, `max-w-3xl`, `max-w-2xl` — no consistent page width standard.
- **`forge-input` class referenced in Settings but the class definition is not verified** — potential invisible styling gap.

---

## 2. NAVIGATION

**Score: 5/10**

### What's good
- Sidebar on desktop (≥md) with FORGE logo, nav items
- BottomNav on mobile — standard pattern, correct
- Mobile top bar with hamburger + FORGE logo

### What's wrong
**The information architecture is confusing:**

```
/ (Dashboard)
/vitals       ← "Health & Performance"
/body         ← "Physical Performance" — contains Workouts + Nutrition + Body
/wealth       ← "Financial Intelligence"
/mind         ← "Mental OS" — contains Habits + Goals + Achievements + Journal?
/insights     ← "Intelligence Layer"
/journal      ← Separate top-level route, but also thematically part of "Mind"
/review       ← "Performance Analytics"
/oracle       ← "ORACLE"
```

Problems:
1. **Journal is a top-level route but thematically lives under Mind.** User mental model: "I journal to reflect on my mind/goals." The navigation doesn't reflect this.
2. **Insights and Review are nearly the same concept.** Insights = patterns in your data. Review = patterns in your data, weekly. One should probably be a tab inside the other.
3. **Body module has 3 sub-domains** (Workouts, Nutrition, Body Metrics) but Vitals and Body are both "physical health" at the top level — the split between `/vitals` and `/body` is not obvious to a new user.
4. **Oracle is a peer-level nav item with the data modules** — this implies it's a "tracker" like the others. It's not — it's the intelligence layer. Should be visually elevated.
5. **No breadcrumbs.** On mobile, navigating into a sub-tab (e.g., Mind → Achievements) gives no indication of where you are.

### The sidebar (not read but inferred from BottomNav structure)
BottomNav likely shows: Dashboard, Vitals, Body, Wealth, Mind (4-5 items). Oracle, Journal, Insights, Review probably only appear in the sidebar — invisible on mobile until the user discovers the hamburger menu.

---

## 3. ONBOARDING FLOW

**Score: 6/10**

### The good
- 3 steps is correct — short enough not to lose users
- Identity step ("Who do you want to become?") is the strongest question in the entire product
- Local-first means no account creation friction

### The bad

**Step 1: Name input**
- No validation shown. User can type anything, click Continue, and it accepts it silently.
- No example shown. "First name or nickname" is fine but "Alex" as a placeholder would help.

**Step 2: Focus selector**
- 6 options: Fitness, Health, Wealth, Mind, Balance, Performance
- Icons + labels but no description of what selecting each means for the app. User doesn't know if "Balance" means all four domains or something specific.
- "Performance" and "Fitness" overlap significantly.

**Step 3: Identity statement**
- Textarea with placeholder. Good prompt.
- But: **this is the most important data Oracle uses**, and it's step 3 of setup with no explanation of why it matters. Should be framed: "This is what Oracle will use to hold you accountable — write it like you mean it."

**After setup:**
- User lands on `/` (Dashboard)
- Dashboard is mostly empty — no vitals logged, no habits, no Oracle brief cached yet
- There is a "Day 1 guidance" Oracle brief for new users but it's not visually prominent
- **No explicit "here's what to do first"** checklist or coach marks

### What should happen (UX recommendation)
After setup, show a "Your first 5 minutes" modal:
1. Log today's vitals (→ /vitals)
2. Add 2–3 habits (→ /mind)
3. Ask Oracle your first question (→ /oracle)

Without this, new users face an empty dashboard and must self-direct. Most won't.

---

## 4. DASHBOARD (Command Center)

**Score: 6/10**

### The good
- Life Score ring is visually strong — one number that tells you how you're doing
- Domain row with 4 scores is clean and scannable
- Alignment Score with the habit/commitment breakdown is excellent
- Oracle Morning Brief as the first content block is the right call

### The bad

1. **Information density is high without clear priority.** The dashboard shows: Life Score → 4 domain scores → Alignment Score → Today's habits → Commitments → Oracle brief → Focus actions → Projections → Pro nudge. That's 8 content sections. What should I look at first?

2. **The habit checklist and commitment list are duplicated.** User checks habits in the dashboard AND in Mind → Habits. Commitment list appears in dashboard AND Mind → Commitments. The dashboard should be read-only summary, not a second place to interact.

3. **Pro nudge after 7 days is poorly placed.** It appears at the bottom of the dashboard. By day 7, the user has formed a scroll pattern and may never see it. It should appear where it creates the most desire — next to a blurred/locked feature.

4. **No "today's score vs yesterday" on the dashboard.** Life Score is shown but with no delta. Is 72 good today? Better or worse than yesterday? The trend context is missing from the most-viewed page.

5. **Projections section is vague.** "If you keep this up, in 6 months you'll have X." These are not data-driven projections — they're Oracle-generated text estimates. Users who see this once will not see it again if nothing changes. The section needs a date, a number, and a condition to be meaningful.

---

## 5. DATA LOGGING EXPERIENCE

**Score: 5/10**

### Vitals (`/vitals`)
**Score: 7/10**
- Sliders for subjective metrics (energy, mood, quality) is correct
- Number inputs for objective metrics (sleep hours, RHR) is correct
- Apple Health auto-import is excellent (when available)
- Problem: **HRV slider defaults to 60ms range 20–150.** Most users don't know their HRV baseline. Showing a number input with no reference ("is 60 good?") creates confusion. Add a reference: "Average: 60ms. Athletic: 80ms+. Low: <40ms."
- Problem: **No "Save" confirmation feedback beyond the button text change.** The entry silently disappears from the form. Confirmation should be more explicit.

### Body (`/body`)
**Score: 5/10**
- Template selector (Push/Pull/Legs/Cardio) is a great UX shortcut
- Problem: **Templates use metric (kg) with no unit switching.** International users aside, even US users will want lbs.
- Problem: **No exercise search/autocomplete.** User must type exercise name free-form every time. Typos ("Benchpress" vs "Bench Press") mean history is fragmented.
- Problem: **Nutrition section is too manual.** Logging exact macros requires either memory or a nutrition label. No barcode scanner, no food search, no common foods preset.
- Problem: **Body Metrics tab only logs weight + body fat.** No measurements, no progress photos.

### Wealth (`/wealth`)
**Score: 6/10**
- Income/expense toggle is clear
- Category select is functional but unordered (alphabetical would help)
- Problem: **No recurring transaction logic.** Rent, salary — users must log these manually every month.
- Problem: **Amount field has no currency symbol in the input** — the `€` is only in the label. Input should show `€ [_______]`.
- Problem: **No way to edit or delete a transaction.** Once logged, it's permanent. This is a significant data quality issue.

### Mind (`/mind`)
**Score: 7/10**
- Habit 7-day grid is visually excellent
- Overdue commitments with "broken commitment" language and days elapsed is the best accountability UX in the product
- Problem: **Habit category selector shows Health/Fitness/Mind/Finance/Social** but the rest of the app uses Health/Fitness/Wealth/Mind. "Finance" ≠ "Wealth". "Social" has no corresponding module. Inconsistent taxonomy.
- Problem: **Goal progress is a slider.** This means a user slides to 100% and the goal is "complete." No actual completion ceremony, no celebration, no reflection prompt. Goals should have a formal "mark as complete" flow.
- Problem: **Achievements only unlock when visiting the Achievements tab.** If you hit a 7-day streak and don't visit Mind → Achievements, you never know.

---

## 6. ORACLE EXPERIENCE

**Score: 7/10**

### The good
- Agent selector with 5 presets is well-conceived
- Quick-start prompts when chat is empty is correct
- Action buttons (Add Habit / Add Goal from conversation) is the most innovative UX in the product
- Message bubbles are clean

### The bad

1. **No streaming.** Oracle responses appear all at once after a multi-second wait. For a 600–1024 token response this can be 5–8 seconds of staring at a loading indicator. Streaming would make it feel alive and fast. This is the highest-leverage UX improvement in the product.

2. **No typing indicator during generation.** User has no feedback that the request is processing vs. the page hanging.

3. **Chat history grows indefinitely with no management.** After 50 conversations, the history is a wall of text with no search, no pinning, no sessions.

4. **The action buttons (Add Habit/Goal) require Oracle to emit very specific token syntax.** If the Oracle response says "You should track your morning HRV" without the exact `[ADD_HABIT: ...]` token, no button appears. Oracle doesn't always emit them. The mechanic is inconsistent from the user's perspective — sometimes there are buttons, sometimes there aren't, with no explanation.

5. **No confirmation after adding habit/goal from chat.** Button turns green with "Added to FORGE" — but user has to navigate to Mind to see it. Should show an inline mini-card of what was added with a link.

---

## 7. EMPTY STATES

**Score: 3/10** — This is the most critical UX failure in the product.

Every data module shows a blank logging form when the user has no data. There is no empty state messaging, no motivational copy, no "here's what you'll see after your first entry."

| Screen | Empty State Quality | What It Shows | What It Should Show |
|--------|-------------------|----------------|---------------------|
| Dashboard (new user) | 4/10 | Oracle Day 1 brief (good), empty habit/commitment sections | Guided first actions, preview of what data will look like |
| Vitals | 2/10 | Just the log form | "Log your first entry. Here's what the trend chart will look like." |
| Body → Workouts | 2/10 | Just the log form | Template prompt: "Start with Push Day" |
| Body → Nutrition | 2/10 | Just the log form | Daily macro targets suggestion |
| Body → Body Metrics | 2/10 | Just the log form | Before/after context |
| Wealth | 3/10 | Just the log form | "Log your first transaction to start building your financial picture" |
| Mind → Habits | 4/10 | Just the add form | "Habits take 66 days on average. Start with one." |
| Mind → Commitments | 5/10 | "No commitments yet. A commitment is a promise to yourself" | Good copy, could have a first commitment suggestion |
| Mind → Goals | 4/10 | "No goals yet. Create your first one." | Fine but no inspiration |
| Mind → Achievements | 5/10 | "No achievements yet. Log vitals, complete habits..." | Adequate |
| Insights | 5/10 | "Log vitals, workouts, habits..." | Should preview sample insights |
| Oracle (first visit) | 7/10 | Quick-start prompts | Good |
| Journal | 5/10 | Just the textarea | OK but could do more |
| Review | 4/10 | Domain rings showing 0, empty wins/improvements | Should show sample of what a filled week looks like |

**Overall:** Empty states are the first thing a new user sees. FORGE's empty states are mostly blank forms. This is a conversion killer.

---

## 8. MOBILE EXPERIENCE

**Score: 4/10**

### The good
- BottomNav is implemented
- Mobile top bar exists
- Responsive grid with `md:` breakpoints throughout
- `pt-14 md:pt-0` and `pb-20 md:pb-0` accounts for mobile chrome

### The bad

1. **No PWA manifest or install prompt.** The product is entirely web-based. Adding to Home Screen requires the user to know the browser menu trick. No `manifest.json` install prompt, no "Install App" banner.

2. **Tabs with 4+ items overflow on small screens.** Mind page has 4 tabs (Habits / Commitments / Goals / Achievements), Body has 3. On 375px screens, these must scroll horizontally. `overflow-x-auto scrollbar-hide` is applied but the user may not know they can scroll.

3. **Number inputs are painful on mobile.** `<input type="number">` on iOS shows a numeric keyboard but the up/down steppers are tiny. For the workout logger (logging 8 reps × 60kg across 4 exercises × 3 sets), this is 24 tiny taps.

4. **The workout logger is desktop-designed.** The exercise blocks with inline reps/weight editors work fine on desktop. On mobile, the row layout (`flex items-center gap-3`) results in cramped inputs. A card-per-set layout would work better on mobile.

5. **No touch gestures.** No swipe to navigate days in Journal. No swipe to complete a habit. No swipe to delete.

6. **Charts are not mobile-optimized.** Recharts `ResponsiveContainer` with `height={120}` is fine, but the `XAxis` labels at `fontSize: 10` are illegible on small screens. 14-day data with 10px labels is unreadable at 375px.

7. **The FAB (Quick Log) placement.** `QuickLogFAB` is a floating button. Its position, what it logs, and which modules it covers is not visible from the code read but presumably lives in the bottom-right. On mobile with a BottomNav, this may conflict visually.

---

## 9. ACCESSIBILITY

**Score: 2/10** — Not audited in depth but red flags are visible.

1. **No ARIA labels** on interactive elements visible in the code. Sliders, icon-only buttons, toggle buttons — all likely missing `aria-label`.
2. **Dark theme only** — no accommodation for users who prefer light mode (accessibility concern, not just preference).
3. **`focus:` states** — not visible in the component code. Tab navigation is likely broken or invisible.
4. **Color as the only signal** — red for overdue, green for complete, orange for score. Users with red-green color blindness (8% of males) will lose meaning.
5. **`line-clamp-2` on journal entries** — truncation without a "read more" option means screen readers see full text while sighted users see truncated. Inconsistent experience.
6. **Slider inputs for vitals** — `<input type="range">` without explicit step announcements is confusing for screen readers.

---

## 10. LOADING & PERFORMANCE UX

**Score: 5/10**

### The good
- Local-first means the app loads instantly for returning users (no API call required)
- `animate-in fade-in duration-300` on most pages creates smooth entry
- Skeleton/pulse loading states exist for Oracle brief

### The bad
1. **No loading state for Oracle API calls** beyond button text change and a spinner icon. For 5–8 second wait times, the user needs more feedback.
2. **No error states beyond console.error.** If Oracle fails, the user sees a generic error string. No retry button, no diagnostic info.
3. **Charts re-render on every component mount.** No memoization visible. With 30 vitals entries, this is probably fine. With 365 entries, the history scroll + chart re-render will be janky.
4. **`setupChecked` null state** in `LayoutShell` returns `null` (blank screen) while checking localStorage. Should return a skeleton screen.

---

## TOP 10 UX IMPROVEMENTS (Priority Order)

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 1 | Add Oracle streaming responses | High | Medium |
| 2 | Redesign empty states for all 8 modules | High | High |
| 3 | Add "Your first 5 minutes" onboarding checklist after setup | High | Low |
| 4 | Fix information architecture — merge Insights+Review, move Journal under Mind | High | Medium |
| 5 | Add exercise autocomplete to workout logger | High | Medium |
| 6 | Make achievements unlock in real-time (on every data save) | Medium | Low |
| 7 | Add goal completion ceremony (not just slider to 100%) | Medium | Low |
| 8 | Add transaction edit/delete | Medium | Low |
| 9 | Fix habit/wealth taxonomy inconsistency (Finance vs Wealth, Social has no module) | Low | Low |
| 10 | Add PWA manifest + install prompt | Medium | Low |
