# MATLINK — DESIGN SYSTEM & UX SPEC (append to the build prompt)

> The product is called **MatLink**. This document tells the AI builder how it should look, feel, and behave. It is grounded in current (2026) design practice AND in a specific brand aesthetic (see §1). Treat the §0 philosophy and §1 aesthetic as non-negotiable; treat specific values as strong defaults that can be refined, not abandoned.

**Product name:** MatLink. **Tagline direction** (pick/refine one, don't use a generic one): something plain and confident — e.g. "Where gyms find their next coach." The name itself does the work: *mat* (the sport) + *link* (the connection). Wordmark-led brand, set in the display face; no mascot, no abstract icon needed. If a mark is wanted, the strongest move is a simple monospace/grotesque "MatLink" wordmark, possibly with a single accent detail (a dot, a slash, or the "i" treated as a belt bar).

---

## 0. DESIGN PHILOSOPHY (the through-line)

The dominant shift in 2026 is **away from visual theatrics and toward calm clarity**. After years of glassmorphism, heavy gradients, and animation overload, the best interfaces now win on **cognitive clarity over sensory richness**: generous whitespace, a clear hierarchy, one confident accent, motion that explains rather than decorates. "Backbone with flair" — disciplined structure with one signature move, not ten.

For a marketplace specifically, the research is blunt: **trust signals drive conversion more than aesthetics**, and the core loop is **Match → Trust → Transact**, not "show → buy." Every screen should answer, for a gym owner: *who is this person, why should I trust them, and how do I reach them.* Beauty here is in service of that — a profile that feels credible and effortless to scan beats a flashy one.

The lucky thing about MatLink: the chosen brand aesthetic (Shoyoroll × Albino & Preto — monochrome, restrained, type-led, one sharp accent; see §1) IS this calm-clarity direction. Brand and usability pull the same way. There's no tension to resolve — disciplined restraint is both the look and the right UX.

**Three rules that override everything else:**
1. **Clarity beats cleverness.** If a visual flourish costs comprehension, cut it.
2. **Trust is the product.** The Verified badge, credentials, and competition record are the hero content — design *around* making them legible and believable.
3. **Mobile is the real product.** 70%+ of marketplace traffic is mobile. Design every screen at 375px first, then scale up.

---

## 1. VISUAL DIRECTION — the Shoyoroll × Albino & Preto aesthetic (the "feel")

MatLink should look like it came from the same world as **Shoyoroll** and **Albino & Preto** — the two most design-forward, collector-grade BJJ brands. This is the brief. Both share DNA (A&P's founder came out of Shoyoroll), and the shared language is:

- **Monochrome foundation.** The names literally mean *white and black* (albino e preto). The interface is overwhelmingly black, white, and a few greys. This is not a "neutral background" by accident — black-and-white IS the brand. Lean into it confidently.
- **Streetwear-grade restraint.** These read like high-end streetwear / fashion lookbooks, not like sports apps or SaaS dashboards. Think editorial fashion catalog, premium drop culture, gallery-clean. Lots of negative space. Nothing busy. Every element earns its place.
- **Type-led, not ornament-led.** Branding is carried by typography and layout, not graphics or illustration. Clean grotesque/sans wordmarks, tight confident type, generous margins. The "logo" is the word, well set.
- **One sharp accent, used like a weapon.** Shoyoroll's signature is a single neon/acid green against the monochrome; A&P uses sparing high-contrast color pops. MatLink gets exactly ONE accent color reserved for the highest-value moments (primary CTA, the Verified state, key emphasis). Everything else stays black/white/grey. The discipline of the restraint is what makes the accent land.
- **Collector-grade quality cues.** These brands signal premium through precision: perfect alignment, tight kerning, considered spacing, crisp edges, restrained motion. The feeling is "expensive and intentional," achieved through discipline, not decoration.

**Mood words:** monochrome, editorial, premium, disciplined, athletic, drop-culture, gallery-clean.

**This aesthetic is a gift for usability** — it happens to BE the 2026 calm-clarity direction (see §0), just with streetwear attitude. The brand brief and the UX best practice point the same way: restraint, whitespace, one accent, type-led hierarchy.

**Hard don'ts** (these break the aesthetic):
- No gradients-as-decoration, no glassmorphism, no drop-shadow soup, no rounded-everything "friendly SaaS" look.
- No multi-color UI. No belt-rainbow used decoratively across the chrome (belt colors appear ONLY as the meaningful belt-rank data element — see §2).
- No stock-photo cheese. Imagery should be high-contrast, editorial, athletic — or absent, replaced by clean type and space.
- Don't dilute the one accent by using it everywhere; if it's on more than ~10% of the screen, it's overused.

---

## 2. COLOR SYSTEM (monochrome + one accent)

The Shoyoroll/A&P aesthetic dictates this directly: **black, white, grey, and one accent.** That's it.

Define as CSS custom properties / Tailwind theme tokens.

**The monochrome core (this is ~90% of every screen):**
- **True/near-black** for primary text, key surfaces, and the dark-mode background (e.g. `#0A0A0A`–`#111`, not pure `#000` unless it reads right).
- **Clean white / near-white** for the light-mode background and inverted text (e.g. `#FAFAFA`–`#FFF`).
- **A disciplined grey ramp** (4–5 steps) for borders, dividers, secondary text, disabled states, card surfaces. Greys do the heavy lifting of hierarchy so color never has to.
- This product is a strong candidate to **ship dark mode as a first-class citizen**, possibly even as the default — black-dominant reads most "on-brand." Build both light and dark; make black-on-white and white-on-black both feel intentional and premium.

**The single accent:**
- **One** high-chroma color, reserved for the highest-value moments only: the primary CTA ("Contact on WhatsApp"), the Verified badge/state, and sparing key emphasis. Shoyoroll's signature acid/neon green is the obvious on-aesthetic choice and would make MatLink feel native to this world — but the builder may select one confident high-chroma color and commit to it. Whatever it is, it appears rarely and always means "this matters."
- Do not introduce a second decorative accent. Semantic states (below) are the only other colors allowed.

**Semantic colors (kept minimal and distinct from the brand accent):**
- success / warning / danger / info — used only for status (verification states, errors, destructive actions). Keep these muted and functional so they never compete with the one brand accent. A "pending" or "rejected" state should read clearly without turning the UI into a color circus.

**Belt colors — the ONE sanctioned multi-color element:**
- White, blue, purple, brown, black (+ degree). These render in their real belt colors as a *data* element — on the profile, the athlete card, and the belt filter. This is authentic (drawn straight from the sport), meaningful (it's real information), and disciplined (it's contained to the belt indicator, never bled into the chrome). It's the rare pop of color that earns its place against the monochrome — very much in the A&P "contrast pop" spirit.

**Contrast is non-negotiable AND on-brand:** black/white is inherently high-contrast, which serves both WCAG AA (4.5:1 body, 3:1 large text) and the premium feel. Verify every text/background pair, including the accent-on-black and accent-on-white pairings (neon greens often fail contrast on white — check, and adjust the accent's text usage accordingly).

---

## 3. TYPOGRAPHY (carries the whole brand — type-led identity)

In this aesthetic, type *is* the branding. There's no illustration or ornament to hide behind, so the type has to be excellent and confident.

- **Two families, used with intent** (plus a utility face for data):
  - A **display/heading face** with a clean, modern, slightly editorial or streetwear character — a strong grotesque or a tight geometric/neo-grotesque sans (the kind of confident sans you see on premium streetwear lookbooks and the Shoyoroll/A&P wordmarks). Used big and tight for the wordmark, athlete names, and section titles. This is the personality.
  - A **highly legible body/UI face** — a clean neutral sans for forms, bios, labels, buttons. Quiet, functional, gets out of the way.
  - A **monospace utility face** for data points (belt, years training, competition years, IBJJF number). Mono-for-data is both a current 2026 move AND reinforces the technical/drop-culture feel (batch numbers, spec sheets — very on-brand for these collector brands). Use it for the small structured facts.
- **Set type tight and confident.** Big headlines with tight tracking and tight leading; small labels in uppercase with generous letter-spacing (the eyebrow/spec-label treatment these brands love). The contrast between huge tight display type and tiny spaced-out caps labels is a signature of the aesthetic — use it.
- **Use a modular type scale**, not arbitrary sizes. Base 16px, ratio ~1.25 (major third): ~13 / 16 / 20 / 25 / 31 / 39 / 49px — and allow a few oversized display sizes above that for hero moments (this aesthetic supports genuinely large type). Every size comes from the scale.
- **Hierarchy from size + weight, not many fonts.** Two families plus the mono utility face — no more. Vary weight (regular / medium / semibold / bold).
- **Line length & leading:** body line-height ~1.5; cap measure ~60–75 characters. Don't let bios run full-width on desktop.
- **Case:** sentence case for UI controls and body; reserve UPPERCASE (with letter-spacing) for small eyebrow/spec labels, where it reads as intentional and premium rather than shouty.

---

## 4. SPACING, LAYOUT & WHITESPACE

Whitespace is the single biggest lever for "premium" perception. Generous spacing increases both comprehension and perceived quality.

- **Use an 8px spacing system.** Every margin, padding, and gap is a multiple of 8 (4px allowed for fine adjustments). This creates invisible rhythm. Tailwind's default scale already does this — use it consistently, don't hand-pick pixel values.
- **Give important things more room.** The rule of thumb: the more important an element, the more space around it. The Verified badge, the primary "Contact" button, the athlete's name — let them breathe. When space feels slightly "too much," it's usually right.
- **Respect scanning patterns.** Users scan in F/Z patterns. Put the most important info top-left-ish and along the natural eye path: name → belt → location → verified → key result → contact CTA.
- **Grid:** a simple responsive grid. Marketplace = card grid (1 col mobile, 2–3 tablet, 3–4 desktop). Profile = single readable column on mobile, two-column (sticky contact panel) on desktop.
- **Consistency is the law.** Same button styles, same card structure, same spacing, same icon set everywhere. Predictability reduces cognitive load — a user who learns one screen should understand the next instantly. Build from shared components (shadcn/ui) so this is enforced structurally, not by hand.

---

## 5. MOTION (must earn its place)

2026 motion philosophy: **motion guides, it doesn't perform.** Subtle, purposeful, fast.

- **Use motion to communicate state and structure:** a card lifting slightly on hover, a smooth transition when a filter applies, a gentle reveal as content loads, the Verified badge settling in. Never bouncy, never confetti, never parallax theatrics.
- **Keep it fast and quiet:** 150–250ms for most transitions, ease-out curves. If an animation makes the user wait, it's wrong.
- **`prefers-reduced-motion` is mandatory.** Respect it — disable non-essential motion for users who set it. This is both an accessibility requirement and a 2026 baseline expectation.
- **Micro-interactions for feedback:** every action gets an immediate, legible response (button press state, save confirmation, upload progress). Small signals reduce uncertainty and make the product feel responsive and alive. A real but counterintuitive trick: a brief, honest "saving…" state can *increase* user confidence that an action worked — don't make writes feel instant-but-ambiguous.

---

## 6. THE CUSTOMER EXPERIENCE, END TO END

Designing the *whole journey*, not just screens. There are three journeys; design each, then merge into shared navigation.

### A. Athlete (supply) — goal: a credible profile, with minimum friction
- **Progressive onboarding.** Do NOT demand sensitive info up front. Let them sign up with just email and start. Heavy/compliance steps (ID, credential docs) come only when they go to submit for verification — a high-intent moment where friction is acceptable. Every extra required field at the top of the funnel drops completion 5–15%; front-load nothing.
- **The profile wizard uses the endowed-progress effect.** Show a completion bar ("Profile 60% complete"). Once people see progress, they're compelled to finish — this is the LinkedIn/Duolingo mechanic and it measurably lifts completion. Autosave every step so nothing is lost.
- **One step per screen on mobile**, clear "what's next," ability to save a draft and return. Never a giant single form.
- **Make credibility-building feel rewarding:** when they add a competition result or get verified, acknowledge it (subtle celebration, badge appearing). The profile *is* their storefront — help them make it shine.

### B. Gym owner (demand) — goal: find a trustworthy coach and contact them in <3 interactions
- **Let them browse before signing up.** Don't gate discovery behind registration — that's a proven conversion killer. Require sign-in only at the high-intent moment (revealing/using contact). (In v1 with no paywall, you can let contact be visible to any signed-in user; still let anonymous users browse the marketplace.)
- **Search must surface a relevant result in under three interactions** or you lose them permanently. Strong filters (belt, verified-only, region open to relocate, languages, focus), sensible default sort (verified first).
- **Never show a dead "No results found."** On thin inventory or a failed search, suggest alternatives, relax a filter automatically, or show nearby/related athletes. Empty states are invitations to act, not dead ends.
- **Trust signals within view of every contact CTA.** Right next to "Contact via WhatsApp," show the Verified badge, belt, and a headline result. A trust signal beside the action is what converts.

### C. Admin (founder) — goal: verify fast, moderate confidently
- A focused review screen: all evidence (IBJJF number, public links, uploaded docs, references) side by side with Approve / Reject. Optimize the founder's time-per-review — this is the operational bottleneck of the whole marketplace.

### Cross-cutting:
- **Honest thin-inventory handling.** Early on there will be few athletes. Seed 6–10 real-feeling profiles, and never fake "curated" categories that open to nothing. Show real supply honestly; a small but genuine marketplace reads as more trustworthy than a padded one.
- **Off-platform contact is the model (v1).** Be transparent about it: the value is discovery + verification, and contact happens on WhatsApp. Don't pretend to be an escrow/messaging product you're not.

---

## 7. TRUST ARCHITECTURE (the part that actually drives conversion)

Marketplaces fail because users don't trust the other side, not because of missing features. Make trust *visible and legible*:

- **The Verified badge is a first-class design element.** Distinct, consistent, with a tooltip explaining what it means ("Credentials reviewed by [brand]"). It should feel earned and clear — not a generic checkmark lost in the layout.
- **Show the tiers honestly.** Verified vs. self-reported should be visually distinguishable so the badge means something. A self-reported profile gets a neutral label, not a fake badge.
- **Surface credentials prominently:** belt (with its real color), academy/lineage, IBJJF number, linked public profiles (IBJJF page, BJJ Heroes, Smoothcomp, Instagram). The links are themselves trust signals — they let a gym owner verify independently.
- **References as social proof.** Show reference names and notes on the public profile (raw contact stays private unless opted in).
- **Identity + a clear "what happens next."** A gym owner should always understand who they're looking at and exactly how to make contact. No ambiguity.

---

## 8. QUALITY FLOOR (build to this without announcing it)

- **Accessibility is extreme usability** — it helps everyone (the "curb-cut effect"). Non-negotiable: WCAG AA contrast, visible keyboard focus states, labels on every input, alt text on images, full keyboard navigation, screen-reader-sane structure, `prefers-reduced-motion` respected. Run an automated audit (Axe/WAVE).
- **Performance is UX.** Lean code, optimized/compressed images, fast loads. A slow marketplace bounces users and erodes trust. Compress images on upload; lazy-load the grid.
- **Consistency enforced by components.** Everything built from a shared component library so spacing, type, and interaction patterns are identical across screens.
- **Every state designed:** loading (skeletons, not spinners where possible), empty (actionable), error (plain-language, says what went wrong and how to fix it — errors don't apologize and are never vague), success (clear confirmation).
- **No dark patterns.** No fake scarcity, no hidden costs, no manipulative friction. Ethical, transparent design is both right and, in 2026, expected.

---

## 9. COPY / VOICE (words are design material)

- Write from the user's side of the screen. Name things by what people do, not how the system works.
- Active voice, sentence case, plain verbs. A button says exactly what happens: "Contact on WhatsApp," "Submit for verification," "Save and continue." The action keeps the same name through the whole flow (the button that says "Submit for review" leads to a state that says "In review").
- Empty and error states give *direction*, not mood. "No coaches match these filters yet — try widening your region" beats "No results found."
- Be specific over clever. "Black belt, 12 yrs, open to relocation" tells a gym owner more than any tagline.

---

## 10. BUILD-TIME SELF-CRITIQUE

Before considering any screen done, the builder should check it against this list:
1. Does it work and look right at 375px wide?
2. **Is it black/white/grey with the accent on ≤~10% of the screen?** (Shoyoroll/A&P discipline.)
3. Is there ONE clear primary action, with trust signals near it?
4. Does the hierarchy guide the eye to name → trust → contact?
5. Is every color/type value from the defined system (no arbitrary one-offs)? Is type tight and confident, with mono used for data?
6. Does contrast pass AA (including accent-on-black / accent-on-white)? Is focus visible? Does reduced-motion work?
7. Are loading/empty/error/success states all handled?
8. **Could you tell this came from the Shoyoroll/A&P world with the MatLink name cropped out?** (If it looks like generic SaaS, it's wrong.)
9. Is there exactly one "signature" flourish, with everything else quiet? (Chanel's rule: remove one accessory before leaving the house.)
10. Would a gym owner trust this person, and know how to reach them, in five seconds?
