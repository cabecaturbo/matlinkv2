# MATLINK — SPACING & CRAFT SPEC ("the billion-dollar flow")

> Append after the enterprise addendum. This is the layer that separates "looks fine" from Linear/Stripe/Vercel-grade. It is mostly invisible: spacing discipline, rhythm, optical correction, tinted neutrals, and crafted microstates. These are HARD RULES with numbers — implement them as design tokens, not vibes. Where this conflicts with earlier files, this wins on spacing/craft specifics.

---

## 0. THE CORE TRUTH (why "premium" is mostly spacing)

The decisions that make Stripe, Linear, and Vercel feel premium are remarkably consistent, and almost none of them are about color or cleverness. They are: **generous whitespace, restraint in color, typography as the hierarchy anchor, and crafted microstates (hover, focus, disabled).** The craft is in what's *not* flashy — the spacing, the alignment, the focus rings. Most of what you can copy is process and system, not hex values.

Two ideas to internalize:
1. **"Take the spacing that feels like enough, then double it."** Dense layouts make the eye work; open layouts let content do the work. Crammed content reads as cheap; generous spacing reads as confident and expensive. When in doubt, add space.
2. **Density is in the behavior, not the pixels.** These products are visually *sparse* but interaction-dense — every element responds to hover, focus, and keyboard. Do not confuse "lots of stuff on screen" with premium. The opposite is true.

---

## 1. THE SPACING SYSTEM (8pt grid + 4pt baseline) — non-negotiable

Everything snaps to a grid. This is the single biggest lever for "billion-dollar flow."

**The scale (use ONLY these values for margin, padding, gap — define as tokens):**
```
space-0   = 0
space-1   = 4px    (fine adjustments, icon nudges, tight inline gaps only)
space-2   = 8px    (base unit)
space-3   = 12px
space-4   = 16px
space-5   = 24px
space-6   = 32px
space-7   = 48px
space-8   = 64px
space-9   = 96px
space-10  = 128px
```
- **All spacing is a multiple of 8** (8, 16, 24, 32, 48, 64, 96, 128). 4px is allowed ONLY for fine optical adjustments (icon-to-text, hairline nudges) — never for layout.
- **Tailwind already maps to this** (`p-2`=8, `p-4`=16, `p-6`=24, `p-8`=32, `p-12`=48, `p-16`=64, `p-24`=96). Use the scale tokens; never hand-pick arbitrary values like `p-[13px]` or `gap-[18px]`. Arbitrary one-off values are the thing that quietly makes a UI feel "off."
- **4pt baseline for type:** all line-heights are multiples of 4 (20, 24, 28, 32…) so text sits on a consistent vertical rhythm. The 8pt grid handles layout/components; the 4pt baseline handles text. They coexist.

**The scale is non-linear and that's the point.** Gaps grow in bigger jumps as they go up (…32 → 48 → 64 → 96). This creates *clear* tiers of separation instead of mushy in-between values. A 96px gap and a 16px gap say very different things; a 70px and an 80px gap say nothing.

---

## 2. THE THREE SPACING LEVELS (the rule that creates hierarchy)

Spacing isn't one thing — it operates at three levels, and using clearly different magnitudes at each is what makes layout read as organized:

- **Container level (largest):** space *around and between* big blocks — sections, cards, panels, the gap between sidebar and results. This is where you're generous. Section vertical padding on key pages should feel almost too big: **64–128px** vertical on desktop hero/section breaks (`space-8` to `space-10`). This expansiveness is a huge part of why premium products feel expensive.
- **Content level (medium):** space *between* related content inside a block — heading to body, paragraph to paragraph, label group to label group. Typically **16–32px** (`space-4` to `space-6`).
- **Component level (smallest):** space *inside* small elements — button padding, input padding, chip padding, icon-to-label. Typically **4–12px** (`space-1` to `space-3`).

**The internal ≤ external rule (memorize this):** the padding *inside* an element must be ≤ the spacing *around* it, and the space between related items must be *less* than the space to unrelated items. A card's inner padding (e.g. 24px) should be ≤ the gap between cards (e.g. 24–32px). This is the Gestalt proximity principle made concrete — closer = more related. Getting this wrong is the #1 cause of "everything feels crowded / I can't tell what groups with what."

**Parent padding ≥ child gap.** A container's padding should be equal to or greater than the gap between its children. Never let children touch the container edge tighter than they're separated from each other.

---

## 3. TYPOGRAPHIC RHYTHM & OPTICAL CORRECTION (the senior-level stuff)

This is what the Linear "Details Matter" film obsesses over — and what AI never does by default.

- **Hierarchy from weight and size, not noise.** Build hierarchy with subtle font-weight and size shifts on a near-monochrome palette — not with color or boxes. Big, slightly-low-contrast headlines; quiet readable body; nothing "screams design."
- **Tighten tracking on large type.** Display/headline sizes need negative letter-spacing (around **-0.02em to -0.04em**). Default (0) tracking on big type is a dead giveaway of un-crafted work. Vercel uses ~-0.04em; loose tracking on headlines is a top-5 "looks amateur" mistake.
- **Loosen tracking on small caps labels.** The spec-sheet uppercase labels (`BELT`, `IBJJF #`) get *positive* letter-spacing (~+0.04 to +0.08em) so they read as intentional, not cramped.
- **Optical alignment over geometric alignment.** Design tools align by math; the eye needs adjustment. Icons next to text often need a 1px nudge to *look* centered even when they're mathematically centered. Quotation marks, bullets, and arrows often need to hang slightly outside the text edge. Trust the eye over the measurement.
- **Tabular numbers for any aligned data.** Years, counts, IBJJF numbers, any column of figures → use `font-variant-numeric: tabular-nums` so digits align in a column. Stripe's financial-table alignment is a signature of looking serious with data.
- **Cap line length** at ~60–75 characters (`max-width: ~65ch`) for bios and any prose. Full-width body text is an instant tell of no typographic care.

---

## 4. TINTED NEUTRALS (the color decision that makes UI look expensive)

This is the single most-overlooked premium move, and it costs nothing.

**Never use pure neutrals.** Not `#FFFFFF`, not `#F5F5F5`, not `#000000`. Premium products never do. Every surface carries a faint trace of one temperature; every shadow leans the same way; muted text is warm-grey or cool-grey, never flat grey. The neutral system runs a consistent undertone through the whole UI.

For MatLink's monochrome aesthetic, pick ONE temperature and commit:
- Backgrounds: off-white / near-black with a faint cool (or warm) tint, e.g. a barely-there desaturated tint rather than `#FFF`/`#000`.
- The grey ramp: all greys share that same undertone (all slightly cool, or all slightly warm — never mixed).
- Shadows: tinted with the same temperature, never pure black at opacity.
- This is what makes it feel *designed* rather than *assembled*. Flat pure-grey neutrals are the assembled look.

**Borders define regions without becoming a design element.** Keep borders nearly invisible — hairline 1px at low opacity (Vercel uses white at ~8% on dark, gray-200/300 on light; "enough to delineate structure, not enough to add visual weight"). Prefer **borders over drop shadows** for separation — flat surfaces with hairline borders read more premium than shadow-floated cards. If you must use shadow, make it tight, tinted, and subtle.

---

## 5. COMPONENT CRAFT SPECS (exact numbers, not vibes)

These are the values that, gotten wrong, instantly read as generic. Set them as tokens.

- **Border radius:** small and consistent. For MatLink's editorial/Shoyoroll-A&P feel, lean crisp: **0–4px** on most surfaces, maybe up to 8px on large cards if desired — but pick one system and hold it. The #1 "looks like a template" mistake is radius too large (12px+ pill-rounding everything). Sharp edges read premium here.
- **Border opacity:** ~**0.08** on dark, gray-200/300 on light. Not 0.15+ (too heavy).
- **Letter-spacing on display:** ~**-0.03em**. On small caps labels: ~**+0.05em**.
- **Button height:** snap to the grid — **40px (5×8)** or **48px (6×8)**. Padding inside: 12–16px horizontal.
- **Input height:** match button height (40/48px) for alignment.
- **Card padding:** **24px** (`space-5`), with **24–32px** gap between cards (internal ≤ external).
- **Hit targets:** minimum **44×44px** for any tappable control; label + control share one generous target, no dead zones.
- **Icon-to-text gap:** 8px, with optical nudge as needed.

---

## 6. MICROSTATES & MOTION (where "fine" becomes "crafted")

Every interactive element needs deliberately designed hover, focus, active, and disabled states. This is the "interaction density" that defines premium — and it's the unglamorous work AI skips.

- **Hover:** subtle and fast. A tiny lift, a border brightening, a background tint shift — **150–200ms, ease-out**. Never scale-bounce.
- **Focus:** a visible, crafted focus ring on every focusable element (keyboard accessibility AND craft). Use the accent or a tinted neutral ring, consistent everywhere.
- **Active/pressed:** immediate visual response (slight darken or scale-down to ~0.98) so clicks feel physical.
- **Disabled:** reduced opacity + `cursor: not-allowed`, clearly distinct from enabled.
- **Negative motion rules (enforce these):** no scale-on-hover on cards beyond a hair, no shadow-pop, no bounce, no everything-animates. Motion explains state and structure only. Respect `prefers-reduced-motion`.
- **Transitions complete fast:** most 150–250ms. Network mutations should target <500ms; if longer, show optimistic/loading state.

---

## 7. THE GRID & ALIGNMENT (everything lines up)

- **12-column grid on desktop** (Stripe uses 12-col), 8 on tablet, 4 on mobile. Consistent gutters (24px desktop, 16px mobile) and outer margins.
- **Container max-width** so content doesn't sprawl on big screens (~1200–1280px for app content; narrower ~65ch for prose).
- **Everything aligns to the same vertical and horizontal lines.** The biggest difference between a "messy" screen and a clean one is whether key elements share grid structure and whether spacing patterns repeat. Edges should line up across rows and sections — left edges of headings, cards, and body should align to the same column lines.
- **Consider a subtle "blueprint" grid texture** (the Vercel move) as an optional brand-flavored background on marketing/hero surfaces only: 1px lines at ~8% opacity, 24px cells. Architecture, not decoration — skip it inside the app UI.

---

## 8. THE "BILLION-DOLLAR FLOW" CHECKLIST (run on every screen)

Spacing & rhythm:
- [ ] Every margin/padding/gap is a token value (multiple of 8; 4 only for optical nudges). Zero arbitrary one-off pixel values.
- [ ] Three spacing levels are clearly differentiated (container ≫ content > component).
- [ ] Internal ≤ external everywhere: card padding ≤ inter-card gap; related items closer than unrelated.
- [ ] Section breaks on key pages are genuinely generous (64–128px desktop). Did you "double the spacing that felt like enough"?
- [ ] Line-heights are multiples of 4; text sits on a consistent baseline.

Type & color craft:
- [ ] Display type has negative tracking (~-0.03em); small caps labels have positive tracking.
- [ ] Aligned numeric data uses tabular-nums.
- [ ] Prose capped at ~65ch.
- [ ] No pure neutrals anywhere — all surfaces/greys/shadows share one undertone.
- [ ] Borders are hairline and barely-there; separation favors borders over shadows.

Component & interaction craft:
- [ ] Radius is small and consistent (0–4px), not template-rounded.
- [ ] Buttons/inputs snap to grid heights (40/48px) and align to each other.
- [ ] Every interactive element has hover + focus + active + disabled states, fast and subtle.
- [ ] Visible, consistent focus rings. No dead zones in hit targets.
- [ ] Motion is 150–250ms ease-out, explains state only, respects reduced-motion.

Alignment:
- [ ] Elements share grid lines; edges align across rows/sections.
- [ ] Content has a max-width; nothing sprawls full-bleed unintentionally.

The test: **zoom out to 50% and squint.** If the spacing rhythm looks even and the hierarchy is still legible as pure blocks, the flow is right. If it looks lumpy or crowded, a spacing level is wrong.

---

## 9. HOW TO MAKE THE BUILDER ACTUALLY DO THIS

- **Put these values in code as tokens FIRST** — a spacing scale, a tinted neutral ramp, radius/border/tracking tokens — before building components. Then every component inherits the system. This is how you get Linear-grade consistency: the system enforces it, not hand-tuning.
- There's a known technique worth using: drop a single `DESIGN.md` (or reuse these specs) into the project root and tell the agent to **follow it strictly** for colors, typography, spacing, components, and tokens. Agents hold pixel-level discipline far better from a written spec than from "make it premium." Vercel even publishes public "Web Interface Guidelines" — this file is MatLink's version.
- When reviewing output, don't say "more polish." Point at the specific rule: "section padding is 24px, the spec calls for 96px"; "headline tracking is 0, should be -0.03em"; "card padding equals the inter-card gap — internal must be ≤ external"; "that grey is flat #888, tint it to match the cool neutral ramp."
