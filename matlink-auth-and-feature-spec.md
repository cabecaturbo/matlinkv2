# MATLINK — AUTH, ONBOARDING & FEATURE ROADMAP SPEC

> Two parts. **Part A** fixes auth and the entry flow — the thing Lucas struggled with, which means it'll lose real users. This is the priority; make it bulletproof before adding features. **Part B** is the prioritized feature roadmap (what to build, build effort, free vs paid, what to charge). Append this to the build prompt. Build Part A first.

---

# PART A — AUTH & ONBOARDING (make it impossible to get stuck)

## A0. THE GOAL

A first-time user should get from "landing on the site" to "inside, using it" without ever being confused, stuck, or unsure what to do next. If a motivated user (Lucas) had trouble, the flow is too hard. The bar: **a non-technical gym owner on their phone gets in on the first try with zero help.**

## A1. ROOT-CAUSE CHECKLIST (fix these first — they're the usual culprits)

The builder should audit the current auth for every one of these and fix any that are broken:
- **No dead ends.** Every screen has a clear next step and a way back. Never a state where the user doesn't know what to do.
- **No silent failures.** Every error shows a plain-language message ("That password is too short — needs 8+ characters"), never a blank screen, a spinner that never resolves, or a generic "something went wrong."
- **Email confirmation doesn't trap people.** If email verification is on, the confirmation email must arrive fast, the link must work on mobile, and there must be a visible "resend email" option. A huge share of "I can't get in" is a confirmation email that's slow, in spam, or whose link breaks. **Recommendation: for launch, consider NOT requiring email confirmation before first use** — let them in immediately, confirm later. Friction at the door kills signups.
- **Clear role choice.** The athlete-vs-gym choice must be obvious and reversible, not a confusing fork. (See A3.)
- **Password rules shown up front**, not after a failed attempt. Show requirements as they type.
- **Loading states everywhere.** Every button that does something shows it's working (disabled + spinner) so users don't double-tap or think it's frozen.
- **Session persistence.** Once logged in, stay logged in. Don't kick users back to login on refresh. (Supabase handles this — make sure it's wired right.)
- **Mobile-first.** Lucas (and most gyms) are on phones. Test the entire flow at 375px. Buttons reachable, inputs not zooming weirdly, keyboard not covering the submit button.

## A2. THE SIGN-UP / SIGN-IN FLOW (exact spec)

Keep it radically simple. The fewer fields and choices at the door, the more people get in.

**Sign-up (3 steps max to "inside"):**
1. **One screen: email + password** (or social login — see A4). That's it. Not name, not role, not profile — just credentials. Show password rules inline. Big clear "Create account" button.
2. **Role choice:** one clean screen, two big tappable cards: **"I'm a gym looking to hire"** / **"I'm an athlete offering coaching."** Plain language, no jargon. One tap.
3. **You're in.** Land them somewhere useful immediately (gyms → the marketplace; athletes → "let's build your profile"). Never land on a blank or confusing page.

**Sign-in:**
- Email + password, a **"Forgot password?"** link that actually works (test the reset email end-to-end), and a clear toggle between "Sign in" and "Create account" so people don't get stuck on the wrong one.
- **"Magic link" option** (Supabase supports passwordless email login) is worth offering — for non-technical users, "we'll email you a link to log in" removes the whole password-memory problem. Strongly consider this as the *primary* method for gyms.

**Error handling (every case):**
- Wrong password → "That password doesn't match. Try again or reset it."
- Email already exists → "You already have an account — want to sign in instead?" with a button straight to sign-in (don't make them retype).
- Network failure → "Couldn't connect — check your internet and try again," with the form preserved (never wipe what they typed).
- Email not confirmed (if confirmation is on) → clear message + a "resend confirmation" button.

## A3. ROLE CLARITY

- The role choice is the one fork that confuses people. Make it two big visual cards with plain descriptions, not a dropdown or radio buttons.
- Make it **recoverable**: if someone picks wrong, there's an obvious way to switch (or support can switch it). Don't let a wrong tap trap them forever.
- After choosing, the whole app adapts to that role — a gym never sees "build your athlete profile," an athlete never sees "post a job." Showing irrelevant options is half of why people feel lost.

## A4. SOCIAL / PASSWORDLESS LOGIN (strongly recommended — this likely fixes Lucas's problem)

The single biggest "I can't get in" reducer for non-technical users is **not making them create and remember a password.** Add at least one of:
- **"Continue with Google"** / **"Continue with Apple"** (Supabase supports both OAuth providers). One tap, no password, no confirmation email. For most gym owners and athletes this turns a 3-minute frustrating signup into a 5-second one.
- **Magic link** (passwordless email) as described above.
- Recommendation: offer **Google + Apple + magic link**, with email/password as a fallback. This alone probably solves what Lucas hit.

## A5. ONBOARDING AFTER LOGIN (don't dump them into a void)

- **Gyms:** land directly in the marketplace so they see value instantly (athletes to browse). A small optional "tell us what you're looking for" prompt, skippable. Never force profile completion before they can look around.
- **Athletes:** land in the profile wizard with the completion bar (the endowed-progress mechanic). Make step 1 trivially easy (name + photo) so they get an early win. Autosave every step so they can leave and come back. Clear "you're X% done, finish to go live."
- **A short, skippable welcome** (one screen, "here's how MatLink works") is fine; a forced multi-screen tutorial is not — let people skip and explore.

## A6. THE SOLID-FLOW CHECKLIST (run before calling auth done)

- [ ] A brand-new user can sign up and reach a useful screen in under 60 seconds, on a phone, with no help.
- [ ] At least one passwordless option (Google/Apple/magic link) works end-to-end.
- [ ] Forgot-password works end-to-end (tested with a real email).
- [ ] Every error state shows a plain-language message + a way forward; the form never wipes input.
- [ ] No confirmation-email trap (either skipped for launch, or fast + resendable + mobile-safe link).
- [ ] Session persists across refresh and app reopen.
- [ ] Role choice is two clear cards and is recoverable.
- [ ] Every interactive element has a loading/disabled state.
- [ ] Whole flow tested at 375px wide.
- [ ] "Lucas test": hand it to a non-technical person cold — they get in without asking you anything.

---

# PART B — FEATURE ROADMAP (prioritized, with build effort + pricing)

Each feature tagged: **[EASY / MEDIUM / HARD]** build effort, **FREE / PAID**, and what to charge. Build in the order listed.

## TIER 1 — SHIP AT LAUNCH (core + first revenue)

### 1. Subscription paywall on contact & full profiles — [EASY] — PAID (the engine)
The core of monetization, and barely a feature — it's a permission flag. Free users see athletes exist + partial profiles; **paying gyms** see full records and contact info. This is *why* anyone pays, so it ships at launch.
- **Charge:** gym subscription **$49/mo** or **$490/yr**. Athletes free.
- **Note:** keep browsing/discovery open to non-paying users so they see the value before the wall.

### 2. Saved searches + new-athlete alerts — [EASY] — FREE feature that drives PAID retention
A gym saves filter criteria (e.g. black belt, open to relocation, English-speaking, their region) and gets an email when a new matching athlete appears.
- Build: a saved-filter record + a scheduled job + an email. Cheap.
- **Why it matters:** turns MatLink into something that works *for* the gym, and is the #1 defense against "cancel after one hire" — there's always a reason to stay subscribed. Bundle into the subscription.

### 3. Job postings ("we're hiring") — [MEDIUM] — PAID add-on or bundled
Gyms post an opening; athletes see it and apply/express interest. Flips the marketplace so athletes come to gyms too.
- **Charge:** bundle into subscription, OR **$30/post** for non-subscribers / extra visibility. Featured/boosted post: **+$20**.
- **Why it matters:** doubles the platform's usefulness, gives gyms a reason to engage even when not actively searching, and adds a second revenue line.

### 4. Featured / boosted placement — [EASY] — PAID (both sides)
- **Athletes:** "$10/mo Featured" — top of search results + a Featured badge. Trivial build (sort flag + badge).
- **Gyms:** boost a job post to the top.
- **Why it matters:** pay-for-visibility is one of the most reliable, cheapest-to-build marketplace revenue models. Honors Lucas's "athletes free to exist" rule — it's optional and aspirational, never required.

### 5. Trust/profile essentials (keep FREE — they make the paid stuff worth buying) — [EASY]
- Verified badge + tiered verification (already speced) — keep prominent.
- Profile-completeness prompts ("70% complete") — improves supply quality gyms pay to access.
- Outbound links to public records (IBJJF, Smoothcomp, Instagram, BJJ Heroes) — near-zero build, big trust payoff.

## TIER 2 — BUILD NEXT (highest-value addition after launch)

### 6. Reviews / reputation — [MEDIUM] — FREE feature, huge strategic value
After a gym and athlete work together, they rate each other. Visible on profiles.
- **Why it matters most:** reputation is the one asset that can ONLY live on MatLink — an athlete's track record of good placements can't be carried to WhatsApp. It's your single best defense against disintermediation and the strongest long-term justification for the subscription. Build it once there are real transactions to review (so, right after launch, not at launch).

## TIER 3 — PARK FOR LATER (valuable but premature)

### 7. Seminars / booking + payments — [HARD] — PAID (transactional, big upside)
Athletes list seminar availability + rate; gyms book and pay through MatLink; you take ~10% gym-side. Needs payment/payout infrastructure (Stripe Connect), cross-border handling, cancellation logic.
- **Charge:** ~10% gym-side booking fee. **Park** until you choose to do bookings — it's a real build and a real "later" decision. High upside (Lucas can be booking #1).

### 8. Placement / success fees — [HARD] — PAID (biggest dollars, hardest to enforce)
A fee when a hire happens. Only viable once you've built the contract/guarantee layer that makes reporting a hire worth it. The high-ceiling model; **park** until trust infrastructure exists.

### 9. In-app messaging — [HARD] — DON'T BUILD EARLY
Tempting but a trap: big build, heavy moderation/support burden, and adds little over click-to-WhatsApp. The value is in discovery + trust *before* the conversation, not hosting it. **Skip until much larger.**

### 10. Analytics dashboards (for athletes/gyms) — [MEDIUM] — possible PAID upgrade later
"Who viewed/contacted you" for athletes; hiring insights for gyms. Nice premium upsell eventually, not a launch priority.

## BUILD ORDER SUMMARY

**Launch:** solid auth (Part A) → core marketplace → #1 subscription paywall → #2 saved-search alerts → #3 job postings → #4 featured boosts → #5 trust essentials.
**Next:** #6 reviews/reputation.
**Later/park:** #7 seminars, #8 placements, #9 messaging, #10 analytics.

## PRICING RECAP
- Gym subscription: **$49/mo** or **$490/yr** (full access + contact + alerts + job posts).
- Athlete: **free** to list/be contacted; optional **$10/mo Featured**.
- Job post (if unbundled): **$30**; boost **+$20**.
- (Later) seminar booking fee: **~10%** gym-side.
