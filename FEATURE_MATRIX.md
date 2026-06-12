# FORGE — FEATURE MATRIX
**Date:** 2026-06-12  
**Format:** Complete feature inventory with status, tier, quality score, and honest assessment.

---

## HOW TO READ THIS

**Status:**
- ✅ Complete — works as intended
- ⚠️ Partial — implemented but with significant gaps
- ❌ Broken — implemented but not working
- 🚫 Missing — not implemented, no code exists
- 🔒 Planned — mentioned in marketing/roadmap, not built

**Tier:**
- FREE — available to all users
- PRO — requires Pro subscription
- BOTH — available to all but with different depth

**Quality Score (1–10):** How well the feature is actually implemented vs. how good it could be.

---

## MODULE 1: HEALTH / VITALS

| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Manual vitals logging (sleep, HRV, energy, mood, RHR) | ✅ | FREE | 7/10 | Sliders + number inputs. No validation on physiologically impossible values (e.g. HRV: 0ms). |
| Sleep quality vs sleep hours distinction | ✅ | FREE | 7/10 | Both logged. Both used in Readiness. |
| Apple Health auto-import | ✅ | FREE | 6/10 | Works on native only. No detection for non-native users. |
| Google Fit integration | 🚫 | FREE | —/10 | Not implemented. Listed on /vs/google-fit page. |
| 14-day Readiness trend chart | ✅ | FREE | 7/10 | Recharts LineChart. Not mobile-optimized. |
| HRV trend chart | ✅ | FREE | 7/10 | Same. |
| Sleep hours chart | ✅ | FREE | 7/10 | Same. |
| Readiness score calculation | ✅ | FREE | 7/10 | Formula: weighted average of HRV%, sleep quality, energy, mood. Not shown to user. |
| Daily vitals reminder notification | ⚠️ | FREE | 4/10 | Browser notification API. Permission must be manually granted. No iOS PWA support. |
| 30-day vitals history table | ✅ | FREE | 6/10 | Shows date, sleep, HRV, energy, readiness. No edit/delete. |
| HRV baseline tracking | 🚫 | FREE | —/10 | No personal baseline — shows raw ms. No "% vs your baseline" context. |
| Recovery protocols from Oracle | ⚠️ | FREE | 5/10 | Oracle can give advice but doesn't proactively alert on low HRV. |

---

## MODULE 2: BODY (WORKOUTS + NUTRITION + BODY METRICS)

| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Workout logging (exercises, sets, reps, weight) | ✅ | FREE | 7/10 | Solid. Inline editing. |
| Workout templates (Push/Pull/Legs/Cardio) | ✅ | FREE | 8/10 | Big UX win. Well implemented. |
| Custom exercise name (free text) | ✅ | FREE | 5/10 | No autocomplete. Typos fragment history. |
| Exercise search / autocomplete | 🚫 | FREE | —/10 | Not implemented. |
| Workout duration timer | 🚫 | FREE | —/10 | No in-app timer. User must use phone clock. |
| Rest timer between sets | 🚫 | FREE | —/10 | Not implemented. |
| Volume calculation (total sets × reps × weight) | 🚫 | FREE | —/10 | Data exists but no summary metric shown. |
| Progressive overload tracking | 🚫 | FREE | —/10 | No "last time you did this exercise, you lifted X" context. |
| Weekly volume chart (minutes) | ✅ | FREE | 6/10 | Bar chart by day of week. |
| Recent workouts history (5 visible) | ✅ | FREE | 5/10 | List format. No edit/delete. |
| Nutrition macro tracking (cal/protein/carbs/fat/water) | ✅ | FREE | 5/10 | Number inputs only. Very manual. |
| Food database / barcode scanner | 🚫 | FREE | —/10 | Not implemented. Major gap vs MyFitnessPal. |
| Meal quality logging | ⚠️ | FREE | 3/10 | `meals: string[]` field exists in schema but UI only shows first meal. |
| Protein trend chart | ✅ | FREE | 6/10 | LineChart. Not mobile-optimized. |
| Macro progress bars | ✅ | FREE | 7/10 | Visual. Hardcoded max of 300g for bars (not personalized to user's targets). |
| Daily calorie target | 🚫 | FREE | —/10 | No user-set targets. No comparison vs target. |
| Body weight logging | ✅ | FREE | 7/10 | Number input + line chart. |
| Body fat % logging | ✅ | FREE | 6/10 | Optional field. Chart not shown separately from weight. |
| Body measurements (waist, chest, etc.) | 🚫 | FREE | —/10 | Not implemented. Schema has no measurement fields. |
| Progress photos | 🚫 | PRO | —/10 | Not implemented. |
| Weight trend chart | ✅ | FREE | 7/10 | LineChart. |
| Unit switching (kg/lbs) | 🚫 | FREE | —/10 | Hardcoded to kg. Blocks US market. |

---

## MODULE 3: WEALTH (FINANCE)

| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Transaction logging (income/expense) | ✅ | FREE | 7/10 | Clean form. Toggle type. |
| 11 spending categories | ✅ | FREE | 6/10 | Fixed list. No custom categories. |
| Net balance display | ✅ | FREE | 7/10 | Running total. |
| Monthly income/expense summary | ✅ | FREE | 7/10 | Current month only. |
| Spending breakdown pie chart | ✅ | FREE | 7/10 | Donut with legend. |
| Monthly cash flow bar chart (6 months) | ✅ | FREE | 7/10 | Income vs expense bars. |
| Transaction history (last 20) | ✅ | FREE | 5/10 | No pagination. No edit. No delete. |
| Recurring transactions | 🚫 | FREE | —/10 | Not implemented. Must re-enter rent/salary monthly. |
| Transaction search / filter | 🚫 | FREE | —/10 | Not implemented. |
| Budget setting / tracking | 🚫 | FREE | —/10 | No budget targets. No "over budget" alerts. |
| Savings rate calculation | ✅ | FREE | 6/10 | Used internally for achievements. Not shown prominently to user. |
| Emergency fund tracking | 🚫 | FREE | —/10 | Mentioned in Oracle system prompt but no UI. |
| Investment tracking | 🚫 | FREE | —/10 | "Investment" is a transaction category but no portfolio view. |
| Net worth tracking | 🚫 | FREE | —/10 | Only cash flow tracked. No assets/liabilities. |
| Wealth projections calculator | ✅ | FREE | 8/10 | Compound growth chart. Adjustable savings + return rate. Best feature in module. |
| Multi-currency support | 🚫 | FREE | —/10 | Hardcoded € throughout. |
| Bank import / CSV import | 🚫 | PRO | —/10 | Not implemented. Major gap vs YNAB. |
| Financial insights from Oracle | ⚠️ | BOTH | 6/10 | Oracle can analyze but no proactive spending alerts. |

---

## MODULE 4: MIND (HABITS + COMMITMENTS + GOALS + ACHIEVEMENTS)

### Habits
| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Habit creation (name + category) | ✅ | FREE | 7/10 | Simple form. Enter key support. |
| Daily habit completion toggle | ✅ | FREE | 8/10 | Circle → checkmark. Satisfying. |
| 7-day completion grid | ✅ | FREE | 8/10 | Visual. Orange = done, gray = missed. Best habit UI. |
| Habit streak counter | ✅ | FREE | 7/10 | Shows flame emoji + count. |
| Habit delete | ✅ | FREE | 7/10 | Trash icon. |
| Habit edit (rename) | 🚫 | FREE | —/10 | Not implemented. Must delete and re-add. |
| Habit reordering | 🚫 | FREE | —/10 | Not implemented. |
| Habit completion rate (30-day) | ⚠️ | FREE | 5/10 | `completionRateFor()` exists in store but only shown in Alignment Score, not per-habit. |
| Habit categories | ⚠️ | FREE | 4/10 | Shows Health/Fitness/Mind/Finance/Social. Inconsistent with module taxonomy. |
| Streak notifications ("at risk") | 🚫 | FREE | —/10 | Not implemented. Duolingo's most effective retention tool. |
| Habit scheduling (specific days) | 🚫 | FREE | —/10 | Not implemented. All habits are daily. |
| Habit pause / archive | 🚫 | FREE | —/10 | Not implemented. Inactive habits clutter the list forever. |

### Commitments (Tasks)
| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Task creation with timestamp | ✅ | FREE | 9/10 | `createdAt` stored. Core accountability mechanic. |
| Priority levels (high/medium/low) | ✅ | FREE | 7/10 | Color-coded. |
| Due date | ✅ | FREE | 6/10 | Optional. Not used in priority sorting. |
| Overdue section with days elapsed | ✅ | FREE | 9/10 | Best accountability UX in product. "X broken commitments" language is great. |
| Word Kept Rate bar | ✅ | FREE | 8/10 | Shows in Commitments tab. |
| Task complete toggle | ✅ | FREE | 7/10 | Circle → check. |
| Task delete | ✅ | FREE | 7/10 | Hover trash icon. |
| Task edit | 🚫 | FREE | —/10 | Not implemented. |
| Recurring commitments | 🚫 | FREE | —/10 | Not implemented. |
| Goal-linked tasks | ⚠️ | FREE | 3/10 | `goalId` field exists in schema. No UI to link or display. |
| Subtasks | 🚫 | FREE | —/10 | Not implemented. |

### Goals
| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Goal creation (title, category, date, notes) | ✅ | FREE | 7/10 | Clean form. |
| Progress slider (0–100%) | ✅ | FREE | 5/10 | User manually slides to update. No objective progress tracking. |
| Goal category (health/fitness/finance/career/personal) | ✅ | FREE | 5/10 | Inconsistent with Habit categories and Oracle's category set. |
| Target date | ✅ | FREE | 6/10 | Shown. No countdown. No "X days remaining". |
| Goal notes / why | ✅ | FREE | 7/10 | Shown as italic quote. |
| Goal delete | ✅ | FREE | 7/10 | Trash icon. |
| Goal milestones | ⚠️ | FREE | 2/10 | `milestones[]` array in schema. Zero UI to add, view, or complete milestones. |
| Goal status (paused/completed) | ⚠️ | FREE | 3/10 | Schema supports it. Only active goals shown. No pause/complete flow. |
| Goal completion ceremony | 🚫 | FREE | —/10 | No animation, no celebration, no reflection prompt at 100%. |
| Oracle goal recommendations | ✅ | FREE | 7/10 | `[ADD_GOAL: ...]` token system. Works. |

### Achievements
| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| 16 unlockable achievements | ✅ | FREE | 7/10 | Good coverage. |
| Achievement unlock animation | ⚠️ | FREE | 4/10 | `animate-unlock` CSS class applied. Animation definition not confirmed. |
| Real-time unlock detection | ❌ | FREE | 2/10 | Only checked when visiting Achievements tab. Not triggered by actual events. |
| Achievement notification | 🚫 | FREE | —/10 | No toast/notification when achievement unlocked. |
| Achievement progress visibility | 🚫 | FREE | —/10 | User can see locked achievements but not how close they are to unlocking. |

---

## MODULE 5: INSIGHTS

| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Rule-based insight cards | ✅ | FREE | 7/10 | ~15 distinct insight rules. Auto-generated. |
| Insight severity (alert/warning/win/info) | ✅ | FREE | 8/10 | Good visual differentiation. |
| Insight dismiss | ✅ | FREE | 7/10 | X button on hover. Session-only (reappears on refresh). |
| Sleep→Mood correlation scatter | ✅ | FREE | 8/10 | Pearson r calculation. Visual and educational. |
| Mental health detection + banner | ✅ | FREE | 9/10 | 3-tier detection. Crisis resources included. Best safety feature in product. |
| AI Deep Analysis (JSON insight cards) | ✅ | BOTH | 7/10 | On-demand. Not cached. Every click costs API call. |
| Cross-domain correlations (algorithmic) | ⚠️ | FREE | 4/10 | Only sleep→mood correlation is computed. HRV→spending, sleep→workout not computed locally. |
| Persistent insight dismissal (survives refresh) | 🚫 | FREE | —/10 | Dismissed cards return on page refresh. |
| Insight history / archive | 🚫 | FREE | —/10 | Not implemented. |

---

## MODULE 6: JOURNAL

| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Daily journal entry | ✅ | FREE | 8/10 | Clean textarea. Auto-loads existing entry for date. |
| Mood slider (1–10) | ✅ | FREE | 7/10 | Color-coded. Syncs with vitals mood? (not confirmed) |
| Date navigation (past entries) | ✅ | FREE | 8/10 | Left/right arrows. Correct. |
| 7 rotating writing prompts | ✅ | FREE | 8/10 | High quality prompts. Shuffle button. |
| Word count | ✅ | FREE | 6/10 | Footer indicator. Nice touch. |
| Oracle reflection (2–3 sentences) | ✅ | FREE | 7/10 | Warm tone. Connects to data. Good. |
| Recent entries list (5 shown) | ✅ | FREE | 7/10 | Clickable. Shows mood + 2-line preview. |
| Journal search | 🚫 | FREE | —/10 | Not implemented. |
| Journal export (separate from data export) | 🚫 | FREE | —/10 | Only via full data export JSON. |
| Mood trend chart | 🚫 | FREE | —/10 | Mood data logged but no visualization in journal module. |
| Journal streak | 🚫 | FREE | —/10 | No streak for journal (only habits have streaks). |
| Photo attachments | 🚫 | PRO | —/10 | Not implemented. |

---

## MODULE 7: ORACLE AI

| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Chat interface with history | ✅ | BOTH | 7/10 | Message bubbles. Timestamps. |
| 5 agent presets | ✅ | BOTH | 7/10 | General / Vitals / Fitness / Wealth / Mind. |
| Custom agent prompts | 🚫 | PRO | —/10 | Not implemented. |
| Quick-start prompts | ✅ | BOTH | 8/10 | 4 suggestion buttons on empty chat. |
| Full user data context | ✅ | BOTH | 8/10 | All 6 domains + alignment score sent. |
| Cross-domain intelligence | ✅ | BOTH | 7/10 | System prompt instructs cross-domain connections. Quality depends on data volume. |
| Oracle streaming responses | 🚫 | BOTH | —/10 | Not implemented. Major UX gap — 5–8s blank wait. |
| Add habit from conversation | ✅ | BOTH | 7/10 | `[ADD_HABIT: ...]` token parsing. Works. Inconsistent emission. |
| Add goal from conversation | ✅ | BOTH | 7/10 | `[ADD_GOAL: ...]` token parsing. Works. |
| Daily morning brief | ✅ | BOTH | 7/10 | Cached once/day. Shown on dashboard. |
| Brief differentiation (free vs pro) | ❌ | — | 1/10 | Same brief for all. Pricing page implies Pro gets deeper analysis. |
| 10 queries/day limit (free) | ⚠️ | FREE | 3/10 | Counter is client-side only. Trivially bypassed. |
| Unlimited queries (pro) | ✅ | PRO | 7/10 | No limit applied for Pro users. |
| Oracle Weekly Review | ✅ | PRO | 8/10 | Pro-gated. JSON response with narrative + wins + improvements + next week. |
| AI Insights (Insights page) | ✅ | BOTH | 7/10 | On-demand. Not cached. |
| Journal reflection | ✅ | BOTH | 7/10 | Warm coach tone. Good. |
| Oracle chat history management | ⚠️ | BOTH | 3/10 | History grows forever. No clear/session/archive. |
| Voice input | 🚫 | PRO | —/10 | Not implemented. |

---

## MODULE 8: WEEKLY REVIEW

| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Domain rings (4 domains, score + trend delta) | ✅ | FREE | 8/10 | SVG rings with color-coded scores. Good. |
| Performance radar chart | ✅ | FREE | 7/10 | All 4 domains. Visual. |
| Auto-calculated wins (local logic) | ✅ | FREE | 7/10 | Based on sleep avg, workout count, habit rate, balance, goals. |
| Auto-calculated improvements (local logic) | ✅ | FREE | 7/10 | Same. |
| AI Coach Assessment | ✅ | PRO | 8/10 | Pro-gated. Frank narrative + wins + next week focus. |
| Week navigation (past weeks) | ✅ | FREE | 7/10 | Left/right week navigation. |
| Historical data in past-week reviews | ❌ | FREE | 2/10 | Week navigation works visually but scores are always current-week data. Past week data is not filtered. |
| PDF/Share export of weekly review | 🚫 | PRO | —/10 | Not implemented. |

---

## INFRASTRUCTURE FEATURES

| Feature | Status | Tier | Quality | Notes |
|---------|--------|------|---------|-------|
| Local-first data storage | ✅ | FREE | 8/10 | Core architecture. Well implemented. |
| JSON data export | ✅ | FREE | 7/10 | All data. Download JSON. |
| CSV export | 🚫 | PRO | —/10 | Listed in pricing page Pro features. Not implemented. |
| Cloud sync (Google OAuth) | ❌ | FREE | 2/10 | Infrastructure exists. Google OAuth not configured. Magic link works. |
| Cloud sync (Magic Link email) | ✅ | FREE | 7/10 | Works via Supabase Auth OTP. |
| Cross-device data access | ⚠️ | FREE | 4/10 | Manual push/pull only. No auto-sync. |
| Conflict resolution on sync | 🚫 | FREE | —/10 | Not implemented. Last-write wins. |
| Data reset | ✅ | FREE | 8/10 | Two-step confirmation. Clears all localStorage keys. |
| Pro subscription (Stripe) | ✅ | PRO | 7/10 | Checkout + webhook + portal. |
| Pro via access code | ✅ | PRO | 3/10 | Works but codes are in public bundle (security issue). |
| Beta Pro activation (/beta) | ✅ | PRO | 8/10 | Clean invite page. Auto-activates. |
| Referral code generation | ✅ | FREE | 6/10 | Auto-generated. Code exists but reward not automated. |
| Push notifications | ⚠️ | FREE | 3/10 | Browser API only. No iOS PWA. No native. |
| Apple Health integration | ⚠️ | FREE | 5/10 | Exists for native. No native app yet. |

---

## FEATURE COMPLETENESS SUMMARY

| Module | Features Built | Features Missing | Completeness |
|--------|---------------|-----------------|-------------|
| Health/Vitals | 10/14 | 4 | 71% |
| Body | 11/23 | 12 | 48% |
| Wealth | 10/18 | 8 | 56% |
| Mind — Habits | 8/14 | 6 | 57% |
| Mind — Commitments | 8/12 | 4 | 67% |
| Mind — Goals | 8/13 | 5 | 62% |
| Mind — Achievements | 5/8 | 3 | 63% |
| Insights | 7/10 | 3 | 70% |
| Journal | 8/14 | 6 | 57% |
| Oracle | 11/18 | 7 | 61% |
| Weekly Review | 6/8 | 2 | 75% |
| Infrastructure | 13/18 | 5 | 72% |
| **TOTAL** | **105/174** | **65** | **60%** |

**Assessment:** FORGE is approximately 60% of the way to a feature-complete v1. The missing 40% is not critical-path for the core value proposition, but contains several features (streaming, barcode scanner, recurring transactions, progressive overload tracking) that users from competing apps will expect.
