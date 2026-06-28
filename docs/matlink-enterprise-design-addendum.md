# MATLINK — ENTERPRISE DESIGN ADDENDUM (v2)

> Append this AFTER `matlink-design-system.md`. It exists because the first build came out functional but "vibe-coded": correct, but generic, voiceless, and with filters dumped in one clump. This document fixes three things: (1) why it looks generic and how to give MatLink a real voice, (2) a proper enterprise filter/dropdown system, (3) the senior-level process and bar. Where this conflicts with anything earlier, this wins.

---

## PART 0 — WHY THE FIRST PASS LOOKED "VIBE-CODED" (the root cause)

This is not a tooling problem and it's not fixable by saying "make it prettier." The mechanism is specific: **an AI model outputs the statistical mean of its training data, and distinctive design lives in the tails of that distribution — which the model systematically averages away.** Ask it to "build a marketplace" and you get the *average* marketplace: the shadcn/ui default, one safe sans-serif, evenly-weighted cards in a grid, soft shadows, a faint hover state. It looks fine and says nothing.

The tells that scream "AI built this" (we are banning all of them):
- One default sans-serif (Inter or similar) used for everything.
- Default component library look with nothing customized — stock radii, stock shadows, stock spacing.
- A flat grid of same-weight cards with no visual hierarchy — nothing is bigger or more important than anything else.
- Generic placeholder content ("User Name," "Item 1") that was never replaced with real data.
- Trend-decoration with no reason: gradients, glassmorphism, floating cards applied because they're "modern," not because they mean anything.
- Every screen weighted equally — no single focal point, no anchor.

**The fix is the same thing senior designers do: replace defaults with intent.** Every visual choice must have a *reason* tied to MatLink specifically. The cure is not more decoration — it's a strong, specific point of view, executed with discipline. The sections below give the builder that point of view as hard constraints, because "be more distinctive" is useless and "do exactly this" works.

---

## PART 1 — GIVING MATLINK ITS OWN VOICE

The MatLink voice is already defined in the design system: **Shoyoroll × Albino & Preto — monochrome, editorial, drop-culture, type-led, one sharp accent.** The first build didn't *execute* it; it fell back to defaults. This part makes the voice concrete and enforceable.

### 1.1 The single most important move: commit to ONE memorable signature
A distinctive interface has **one** thing it does that nothing else does — a single visual anchor per screen and a single signature motif across the product. MatLink's signature is the **"spec-sheet" treatment** borrowed from how these brands present their gis (batch numbers, weave specs, drop numbers). Athletes are presented like premium products in a catalog:

- Athlete data rendered as a **typographic spec block** — monospaced labels in spaced-out uppercase (`BELT`, `YRS`, `IBJJF #`, `TEAM`, `LOCATION`) with the values in the display face. This is the recurring motif that makes any MatLink screen recognizable with the logo cropped out.
- A **"batch number" style ID** for each athlete profile (e.g. `MATLINK · No. 0047 · BLACK / 2°`) as a small monospace eyebrow. It's pure brand flavor, costs nothing, and instantly reads as drop-culture rather than SaaS.
- Pick this ONE motif and apply it consistently. Do not add a second competing signature.

### 1.2 Typography: kill the default-sans look
- **Two intentional faces, neither one being the generic default.** A characterful grotesque/neo-grotesque or editorial face for display (names, headlines, the wordmark), and a clean but *chosen* face for body — plus the monospace for data. Do NOT ship with the framework default font. State the actual font names in code.
- **Extreme type scale contrast is the aesthetic.** Huge, tight display type next to tiny, wide-tracked uppercase labels. Flat, mid-sized type everywhere is the generic look; dramatic scale contrast is the editorial look. Hero athlete name can be genuinely large.
- Tighten tracking on big display type; widen it on small caps labels. This single pairing does most of the "premium editorial" work.

### 1.3 Hierarchy: nothing is allowed to be equal-weight
The generic tell is a grid where every card carries identical weight. Fix:
- **Each card has a clear internal hierarchy:** photo → name (large) → belt+location (the spec block) → one signature result → verified state. The eye must land somewhere first, not bounce across a uniform field.
- Consider a **non-uniform marketplace grid** — e.g. a featured/larger treatment for verified or standout athletes — so the layout has rhythm instead of monotony. (Even subtle: verified cards get a slightly stronger frame.)
- One primary action per screen, visually dominant. Everything else recedes.

### 1.4 Customize the components — never ship the library default
- **Set the design tokens explicitly:** corner radius (these brands lean crisp/squared, not pill-rounded-everything — small or zero radius reads more premium/editorial here), border treatment (hairline 1px in the grey ramp, used confidently as structure — A&P/SYR love a clean rule), shadow philosophy (prefer flat + borders over soft drop-shadow soup; if shadows, make them tight and intentional).
- **Borders over shadows** as the primary separation method fits the monochrome editorial look and avoids the "floating card" AI tell.
- Define these as tokens once; every component inherits them. This is what makes it feel like one designed system rather than assembled parts.

### 1.5 Use REAL content, never placeholders
Placeholder content is both an AI tell and a design risk (real data is a different shape than "Lorem ipsum"). The seed profiles (build prompt §6) must be realistic: real-sounding names, actual belt ranks, plausible academies (Atos, Alliance, Checkmat, Gracie Barra, etc.), real competition names (IBJJF Worlds, Pans, ADCC, European), real locations, real-length bios. Design the cards and profiles *against this real data* so the layout fits how the content actually behaves (long names, missing fields, athletes with thin records).

### 1.6 Motion as signature, not decoration
- One or two **signature micro-interactions** done well beats many. Candidate: the verified badge settling in with a crisp, fast confirm; a tight reveal on the spec block; a considered hover lift on cards (subtle, fast, 150–200ms, ease-out). Motion explains state; it never performs.
- Respect `prefers-reduced-motion`. Keep everything quiet and fast — restraint is the brand.

---

## PART 2 — THE FILTER & DROPDOWN SYSTEM (fixing the "big clump")

The current filters are dumped in one undifferentiated block. That's the #1 enterprise-immaturity tell. Here is the system to replace it. The governing principles, straight from current best practice: **applied filters must always be visible; group and progressively disclose options; show result counts; keep results responsive; never dead-end on zero results.**

### 2.1 Layout pattern (pick by breakpoint — this is the standard mature pattern)
- **Desktop:** a **left sidebar of faceted filters** alongside the results grid. Sidebar is the right call for data-heavy, frequently-adjusted filtering with 5–8+ categories — which MatLink has. Results update **asynchronously** as filters apply (grey out + repopulate; never freeze, never full-page reload that jumps you to the top).
- **Mobile:** filters collapse behind a single **"Filters" button** that opens a **full-screen drawer/sheet**, with the most common one or two filters (e.g. Belt, Verified-only) also exposed as **chips above the grid** for quick access. The drawer uses a sticky **"Show N results" button** at the bottom that updates its count live, and applies on tap (mobile = batch-apply, not apply-on-every-tap).

### 2.2 Group the facets — never one flat list
Organize the filters into **labeled, collapsible sections** (accordion), not a clump. For MatLink, group like this:

```
RANK & EXPERIENCE
  · Belt (multi-select, rendered in real belt colors)
  · Years training (range)

AVAILABILITY
  · Open to relocation (toggle)
  · Visa sponsorship needed (toggle)
  · Commitment (full-time / part-time / seminars / camps) (multi)

LOCATION & LANGUAGE
  · Regions open to (multi-select, searchable)
  · Languages (multi-select, searchable)

COACHING FOCUS
  · Gi / No-gi / Competition team / Fundamentals / Kids / MMA grappling (multi)

TRUST
  · Verified only (toggle — visually prominent, uses the accent)
```

- Show **3–5 most-used options per section by default** with a **"Show all"** expander for long lists. Don't make users dig.
- Any facet with **>10–15 options** (regions, languages) gets a **search field inside the dropdown** so users jump instead of scroll.
- **Result counts** next to options where feasible (e.g. "Black (12)") so users know what's worth selecting and never hit an empty set.

### 2.3 Choose the right control per facet (don't default everything to dropdowns)
- **Multi-select with few, comparable options** (coaching focus, commitment) → visible **checkboxes** or **toggle chips**, not a dropdown. Visibility beats hiding here.
- **Binary** (verified-only, relocation, visa) → **toggle switches**, on by intent.
- **Long lists** (regions, languages) → **searchable multi-select dropdown** with in-dropdown search.
- **Belt** → multi-select rendered with the **real belt colors** as swatches — this is both functional and the sanctioned color moment.
- **Years training** → **range** control with sensible default bounds.
- **Sort** (separate from filters) → a single **dropdown** with a sensible **default ("Verified first")**.

### 2.4 The applied-filters bar (non-negotiable)
- Active filters appear as **dismissible chips/pills** in a **sticky summary bar** at the top of the results, each individually removable, plus a **"Clear all."** This is the single biggest usability lift and the clearest sign of a mature filter system. On mobile especially — where the panel is hidden — the chips are how users see what's applied.
- Selections **persist** as the user navigates; remember them across the session.

### 2.5 Zero-results is a designed state, never a dead end
If a filter combination returns nothing, **never** show a bare "No results found." Instead: say what happened, and offer a way forward — relax the most restrictive filter automatically, suggest removing a specific facet ("No coaches match in these 3 regions — remove 'Visa sponsorship' to see 8 more"), or show nearby/related athletes. Empty states are invitations to act.

### 2.6 Dropdown craft details (so they don't feel cheap)
- Open on click; if it has many options, let the user **type to filter immediately** (focus the search on open).
- Provide **default selections** where they save time (Sort defaults to "Verified first").
- Multi-select dropdowns **don't refetch on every tick** — let the user finish, then apply (a section-level or panel-level apply), so results don't thrash.
- Keyboard accessible, visible focus, adequate touch targets, label every control. Animate open/close fast and quietly.

---

## PART 3 — THE ENTERPRISE BAR & PROCESS (how to actually get there)

Enterprise-grade isn't a skin — it's discipline applied in sequence. The reason the first pass fell short is that "design, implement, and integrate" got compressed into one generation. No serious team works that way. Enforce a **sequential process** instead.

### 3.1 Build design in phases, not one shot
For any significant screen (marketplace, profile, wizard), the builder should work in this order, pausing between:
1. **Layout & hierarchy** — structure, what's dominant, what recedes. Greybox it.
2. **Type & color** — apply the system; get the editorial type contrast and monochrome+accent right.
3. **Component customization** — tokens, borders, radii, the spec-sheet motif.
4. **Interaction & motion** — states, the signature micro-interactions.
5. **States** — loading (skeletons), empty (actionable), error (plain-language), zero-results.
6. **Accessibility & critique** — audit, then the self-critique checklist.

### 3.2 Use a design sandbox before touching production
Before integrating a new screen into the app, build it as a **standalone mockup** (a throwaway component with hardcoded realistic data, no API, no state) to nail the *look* in isolation. When it's right, port the design decisions into the real app. This separates "what should it look like" from "wire it up," which is exactly the compression that produced the generic result. (For MatLink: a Claude Artifact or a `/sandbox` route is perfect for this — get the marketplace card and the profile page beautiful as static mockups first.)

### 3.3 Enterprise-grade checklist (every significant screen)
Functional maturity:
- All states designed: loading (skeleton, not spinner), empty (actionable), error (says what + how to fix), zero-results (offers a path), success (clear confirm).
- Real content stress-tested: long names, missing fields, thin records, the longest plausible value.
- Responsive and correct at 375px, then scaled up — not the reverse.
- Async, non-blocking interactions; nothing freezes or full-reloads.
- Accessibility: WCAG AA contrast (incl. accent pairings), visible focus, full keyboard nav, labels, alt text, `prefers-reduced-motion`.
- Performance: compressed images, lazy-loaded grid, fast paint.

Distinctiveness (the anti-generic gate):
- Not the framework default font. Named, intentional faces.
- Editorial type-scale contrast present (big tight display vs small wide caps).
- Clear single focal point per screen; no all-equal-weight grids.
- The spec-sheet / batch-number signature motif is present and consistent.
- Tokens customized (radius, border-over-shadow, spacing) — not library stock.
- One accent, on ≤~10% of the screen, meaning "this matters."
- **The cropped-logo test:** crop out the MatLink name — could you still tell this is MatLink and not a generic SaaS template? If no, it's not done.

### 3.4 How to direct the build from here (practical)
When pushing the builder, be specific, not vibey. "Make it look better" produces nothing. Instead, per screen: name the layout pattern, the hierarchy (what's dominant), the exact type treatment, the motif, the states. Reference this addendum's sections by number. Have it build the contested screen as a standalone mockup first, critique against §3.3, then integrate. Iterate screen by screen — marketplace and profile are the two that carry the brand, so spend the most there.
