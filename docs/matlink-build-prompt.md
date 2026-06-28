# BUILD PROMPT — "MatLink" (working title): a marketplace connecting BJJ gyms with competitive coaches

> Hand this entire document to your AI coding tool. Build it in the order the phases are listed. Do not skip the data model or auth before building UI.

---

## 1. ONE-LINE PITCH

Fiverr, but the only service is "competitive Brazilian Jiu-Jitsu coach for hire." Gym owners browse a marketplace of verified BJJ athletes who are open to relocating/teaching, and contact them directly (WhatsApp). Athletes build a profile, prove their credentials, and get discovered.

---

## 2. SCOPE GUARDRAILS (read first)

- **Build a PWA**, not a native app. Mobile-first responsive web that installs to the home screen (manifest + service worker + offline shell). Architect so a later wrap in Capacitor/React Native for the Play Store is easy — keep all business logic in API routes, keep the UI in clean component boundaries, don't couple anything to browser-only APIs without a fallback.
- **NO paywalls in v1.** Contact info is visible to any signed-in gym owner. Build the data model so a paywall *could* be added later (see §9), but ship with everything free.
- **Two roles only:** `gym` (looking to hire) and `athlete` (offering coaching). The only service category that exists is "BJJ coaching/instruction." Don't build a generic services engine.
- **Verification is manual in v1.** An admin (the founder) reviews each athlete's submitted credentials and flips a Verified badge. No scraping, no third-party API — none exists for IBJJF (confirmed: IBJJF has no public API; athlete records are login-gated).
- Ship something usable fast. Prefer boring, proven choices over clever ones.

---

## 3. TECH STACK (use exactly this)

- **Framework:** Next.js (App Router, TypeScript).
- **DB + Auth + Storage:** Supabase (Postgres, Supabase Auth, Supabase Storage for images/docs).
- **Styling:** Tailwind CSS + shadcn/ui components.
- **PWA:** `next-pwa` (or manual service worker) + web manifest. Installable, with an offline fallback page.
- **Forms/validation:** react-hook-form + zod.
- **Image handling:** Supabase Storage with signed URLs; resize/compress on upload client-side before storing.
- **Email (transactional):** Resend (verification approved/denied notices). Keep it abstracted so it can be swapped.
- **Deploy:** Vercel for the app, Supabase cloud for backend.
- **Maps/geo:** store country + city as text in v1 and filter on those. Don't integrate a maps API yet.

Keep secrets in env vars. Provide a `.env.example`. Use Supabase Row Level Security (RLS) on every table — do not rely on client-side checks for auth.

---

## 4. CORE USER FLOWS

### Athlete (the supply side)
1. Sign up → choose role "Athlete / Coach."
2. Build profile (multi-step wizard, can save draft and finish later).
3. Submit credentials for verification.
4. Profile sits in `pending` until admin approves → becomes `verified` and goes live in the marketplace. (An athlete can choose to go live as `unverified` too — see §6 verification tiers.)
5. Receives WhatsApp/email contact from gyms directly. No in-app messaging in v1.

### Gym owner (the demand side)
1. Sign up → choose role "Gym / Hiring."
2. Lightweight gym profile (gym name, location, what they're looking for) — optional but encouraged.
3. Browse/search/filter the marketplace of athletes.
4. Open a profile → see full details + a "Contact via WhatsApp" button (deep link) and email.
5. Done. Contact happens off-platform.

### Admin (the founder)
1. Protected `/admin` route (role = `admin`).
2. Queue of pending athlete verifications with all submitted docs/links shown.
3. Approve / Deny (with optional reason). Approve flips `verification_status` and badge, sends email.
4. Basic moderation: hide/suspend a profile, view all users.

---

## 5. ATHLETE PROFILE BUILDER (this is the heart of the product — make it good)

Multi-step wizard, progress bar, autosave draft to DB on each step. Fields:

**Step 1 — Identity & basics**
- Full name (real name; shown only after... no — show name publicly in v1 since no paywall)
- Profile photo (required, single, cropped square)
- Cover/action photo (optional)
- Date of birth → derive age
- Nationality (country)
- Current location (country + city)
- Languages spoken (multi-select, important for international placements)

**Step 2 — BJJ credentials (the trust core)**
- Belt rank (white/blue/purple/brown/black + degree for black) — dropdown
- Years training
- Lineage / professor (text)
- Primary academy / team affiliation (text)
- **IBJJF membership number** (text, optional but boosts trust)
- Other affiliations (IBJJF, ADCC, UAEJJF, JJWL, AJP, etc. — multi-select)

**Step 3 — Competition record**
- Free-text "career highlights" rich-ish text area
- Structured "notable results" repeater: each = { competition name, division/belt, year, placement }. Let them add several.
- Links to public profiles: IBJJF athlete page URL, BJJ Heroes, FloGrappling, Smoothcomp, Instagram, YouTube highlight reel. (These links double as how the admin verifies them — see §6.)

**Step 4 — What they offer / availability**
- Headline (e.g. "Black belt competitor available for full-time head instructor role")
- Bio / about (rich text)
- Coaching focus (multi-select: gi, no-gi, competition team, fundamentals, kids, MMA grappling, private lessons)
- Open to: relocation (yes/no), which regions/countries (multi-select), visa sponsorship needed (yes/no)
- Availability: full-time / part-time / seminars / short camps
- Rate expectations (optional free text — keep loose)

**Step 5 — References & verification docs**
- References repeater: { name, relationship, contact (email/phone), note }
- Upload: photo of IBJJF membership card / belt certificate / ID (stored privately, shown ONLY to admin, never public)
- Consent checkbox: "I confirm these credentials are accurate."

**Step 6 — Contact**
- WhatsApp number (E.164 format, validated) — required, this is the primary CTA
- Public email (optional)
- Submit for review.

Public profile page renders Steps 1–4 + references (names/notes, not raw contact unless they opt in) + the Verified badge. Step 5 upload docs are **admin-only**.

---

## 6. VERIFICATION SYSTEM (v1 = manual, designed to scale later)

**Reality check baked into the design:** There is no public IBJJF API. Athlete competition results exist on public web pages (ibjjf.com athlete pages, BJJ Heroes, Smoothcomp, FloGrappling) and the IBJJF issues a membership number + digital membership card. So v1 verification is a human reviewing evidence.

**Verification tiers (store as enum `verification_status`):**
- `unverified` — self-reported only. Profile can still go live but shows a neutral "Self-reported" label, no badge.
- `pending` — athlete submitted docs, awaiting admin review.
- `verified` — admin confirmed. Shows a green "Verified" badge with tooltip "Credentials reviewed by MatLink."
- `rejected` — with admin reason; athlete can resubmit.

**What the admin reviews (build this into the admin queue UI):**
- The IBJJF number + the public profile links the athlete provided. Admin clicks through, confirms belt/name/results match.
- The uploaded membership card / belt certificate photo.
- The references.

Admin sees a single review screen per athlete with all of this side by side, plus Approve / Reject (+reason) buttons. Approving sets `verified` + timestamp + which admin, and triggers an email.

**Design for future automation** (don't build now, just leave seams): a `verification_evidence` table and a `verification_method` field (`manual` for now, room for `smoothcomp_oauth` / `scraper` / `partner_api` later).

---

## 7. MARKETPLACE / BROWSE EXPERIENCE

- Grid of athlete cards: photo, name, belt (with color), location, "open to relocation" flag, top result, Verified badge.
- **Filters:** belt rank, verified-only toggle, country/region open to relocate, coaching focus, languages, availability type, visa sponsorship.
- **Sort:** newest, verified first, belt rank.
- **Search:** name, academy, keyword.
- Profile detail page with the big **"Contact via WhatsApp"** button → `https://wa.me/<number>?text=<prefilled message referencing MatLink>`. Plus copy-email button.
- Empty/seed state: ship with 6–10 realistic seed profiles so it doesn't look dead on day one.

---

## 8. DATA MODEL (Postgres, via Supabase)

```
users (managed by Supabase Auth)
  - id, email, role enum('athlete','gym','admin'), created_at

athlete_profiles
  - id, user_id FK, status enum('draft','pending','live','suspended')
  - full_name, photo_url, cover_url, dob, nationality, location_country, location_city
  - languages text[]
  - belt enum, belt_degree int, years_training, professor, academy, ibjjf_number
  - affiliations text[]
  - highlights text, bio text, headline
  - coaching_focus text[], open_to_relocation bool, relocation_regions text[], needs_visa bool
  - availability text[], rate_note
  - whatsapp_e164, public_email
  - verification_status enum('unverified','pending','verified','rejected')
  - verified_at, verified_by, rejection_reason
  - created_at, updated_at

athlete_results        (repeater)  -> profile_id, competition, division, year, placement
athlete_links          (repeater)  -> profile_id, type, url
athlete_references     (repeater)  -> profile_id, name, relationship, contact, note
verification_docs      (admin-only)-> profile_id, file_url, doc_type
verification_evidence  (future)    -> profile_id, method, payload jsonb, checked_by, checked_at

gym_profiles
  - id, user_id FK, gym_name, location_country, location_city, website
  - looking_for text, created_at

-- future, not used in v1:
contact_unlocks        -> gym_user_id, athlete_id, paid_at, amount  (for the eventual paywall)
```

**RLS rules (critical):**
- Anyone can read `athlete_profiles` where `status='live'` — but only public columns.
- `verification_docs` and references' raw contact readable only by the owner + admin.
- Athletes can only edit their own profile. Gyms can only edit their own. Admin can read/edit all.

---

## 9. FUTURE-PROOFING (build the seams, don't build the feature)

- **Paywall to reveal contact:** the `contact_unlocks` table and a feature flag `CONTACT_PAYWALL_ENABLED=false`. When false (v1), WhatsApp/email show freely. When later true, gate the contact button behind a one-time Stripe payment and an unlock record. Keep the contact-reveal in a single component so flipping it is a one-place change.
- **Native app:** keep logic in API routes, avoid browser-only deps without fallback, so Capacitor wrap is clean.
- **In-app messaging:** out of scope, but don't design anything that assumes contact is purely external forever.
- **Automated verification:** the evidence table + method enum described above.

---

## 10. ADMIN PANEL (`/admin`, role-gated)

- Verification queue (pending athletes) with the side-by-side review screen.
- All users list with search; suspend/unsuspend, change verification, delete.
- Simple counts dashboard: total athletes, verified, pending, gyms, signups this week.

---

## 11. NON-NEGOTIABLE QUALITY BAR

- Mobile-first. Test every screen at 375px wide.
- Real form validation with helpful errors (zod messages).
- Loading and empty states everywhere.
- Image uploads compressed client-side; cap file size; only allow image/pdf for docs.
- RLS enforced server-side — never trust the client for auth.
- Accessible: labels on inputs, alt text, keyboard-navigable.
- Seed data + a README explaining setup, env vars, Supabase schema migration, and how to make a user an admin.

---

## 12. DELIVERABLES

1. Working Next.js + Supabase repo, deployable to Vercel.
2. SQL migration file(s) for the full schema + RLS policies.
3. `.env.example`.
4. README: local setup, deploy steps, how to seed, how to promote a user to admin.
5. PWA manifest + service worker + installable + offline fallback.
6. Seed script with 6–10 realistic athlete profiles and 2 gym accounts + 1 admin.

---

## 13. BUILD ORDER (do in this sequence)

1. Supabase project + schema + RLS + auth with roles.
2. Sign-up/login + role selection + route protection.
3. Athlete profile wizard (with draft autosave).
4. Public profile page + WhatsApp contact.
5. Marketplace browse/search/filter.
6. Admin verification queue + approve/reject + email.
7. Gym profile (lightweight).
8. PWA wrap (manifest, SW, install, offline).
9. Seed data + README + polish (loading/empty states, mobile pass).

Build phase 1 fully and show me the schema + RLS before moving on.
