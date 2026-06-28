# MatLink

> Fiverr, but the only service is "competitive Brazilian Jiu-Jitsu coach for hire."
> Gym owners browse a marketplace of **verified** BJJ coaches open to teaching and
> relocating, and contact them directly on WhatsApp. Athletes build a credible
> profile and get discovered. **Where gyms find their next coach.**

Mobile-first **PWA** built with Next.js + Supabase. Monochrome, type-led design
(Shoyoroll × Albino & Preto) with a single volt-green accent.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| DB / Auth / Storage | Supabase (Postgres + RLS, Supabase Auth, Storage) |
| Forms / validation | react-hook-form + zod |
| Images | client-side compression (`browser-image-compression`) → Supabase Storage |
| Email | Resend (abstracted; stubbed when no key) |
| PWA | hand-written manifest + service worker (offline shell) |
| Deploy | Vercel (app) + Supabase Cloud (backend) |

All access is enforced by **Row-Level Security** at the database layer — never by the
client. Secrets live in env vars only.

---

## Local setup

**Prereqs:** Node 20+ and a Supabase project (cloud or local).

1. **Install**
   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # or the legacy anon key
   SUPABASE_SECRET_KEY=                                       # server-only (optional in dev)
   RESEND_API_KEY=                                            # optional — emails stub-log without it
   ```
   Find these in the Supabase dashboard → **Project Settings → API**.

3. **Apply the schema** — run the migrations in `supabase/migrations/` in order
   (`0001_init_schema`, `0002_rls`, `0003_storage`). Either:
   - **Supabase CLI:** `supabase link --project-ref <ref>` then `supabase db push`, or
   - paste each file into the dashboard **SQL Editor**, or
   - use the Supabase MCP `apply_migration` tool.

4. **Seed demo data** (optional but recommended so the marketplace isn't empty):
   run `supabase/seed.sql` in the SQL Editor. It creates 8 live demo coaches.
   See **Seeding** below for the login accounts.

5. **Run**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

---

## Seeding

`supabase/seed.sql` inserts **8 live demo coaches** (display-only, no login) so the
marketplace has realistic inventory. It runs as the service role, so it bypasses
GoTrue's email validation and is safe to run on a fresh DB. To reset:

```sql
delete from auth.users where email like '%@seed.matlink.dev';  -- cascades to profiles
```

**Demo login accounts** (created during development; password `Passw0rd!23`):

| Role | Email | Notes |
|------|-------|-------|
| Athlete | `athlete1@matlink.dev` | verified, live profile |
| Gym | `gym1@matlink.dev` | "Apex BJJ Dubai" |
| Gym | `gym2@matlink.dev` | "Northside Grappling" |
| Admin | `admin1@matlink.dev` | verification queue access |

> ⚠️ Supabase email validation rejects non-deliverable domains (`.test`,
> `example.com`). For real self-service sign-ups use an address on a real domain.
> SQL-seeded auth users must have their token columns set to `''` (not NULL) or
> GoTrue login fails — `seed.sql` handles this.

---

## How to make a user an admin

`admin` cannot be self-assigned at sign-up (a DB trigger downgrades any
`role: admin` in auth metadata to `athlete`). Promote an existing user via SQL:

```sql
update public.users set role = 'admin' where email = 'you@example.com';
```

Then sign out and back in. The admin panel lives at `/admin`.

---

## Deploy

**Backend (Supabase Cloud):** create a project, apply the migrations (step 3
above). Storage buckets (`avatars` public, `verification-docs` private) and all
RLS policies are created by the migrations.

**App (Vercel):**
1. Import the repo into Vercel.
2. Set the env vars from `.env.example` (Project → Settings → Environment Variables).
3. Deploy. The PWA manifest, icons, and service worker ship from `public/` and
   `app/manifest.ts` automatically.

**Auth redirect:** in Supabase → Authentication → URL Configuration, add your
production URL to the redirect allow-list so the email-confirmation link
(`/auth/confirm`) works.

---

## Roles & core flows

- **Athlete** — sign up → 6-step profile wizard (autosaves, resumes) → submit →
  profile goes **live** and enters the verification queue → admin verifies →
  **Verified** badge. Contacted by gyms off-platform.
- **Gym** — sign up → optional lightweight gym profile → browse/search/filter the
  marketplace → open a profile → **Contact on WhatsApp** (contact is visible to
  any signed-in user).
- **Admin** — `/admin`: stats, verification queue, single-screen review
  (credentials + links + signed-URL docs + references) → approve / reject (+reason,
  emails the athlete), plus user moderation (suspend, verification override).

---

## Project structure

```
src/
  app/
    (auth)/{login,signup}        # auth + role selection
    auth/confirm                 # email confirmation handler
    onboarding/<step>            # athlete profile wizard (6 steps)
    athletes/                    # marketplace (page) + [id] public profile
    gym/profile                  # lightweight gym profile
    admin/                       # overview+queue, athletes/[id] review, users
    dashboard, offline, manifest.ts, error.tsx, not-found.tsx
  components/{ui,onboarding,profile,marketplace,admin}
  lib/
    supabase/{client,server,middleware,database.types}
    auth.ts profile.ts gym.ts admin.ts email.ts upload.ts utils.ts
    validation/profile.ts  constants/  onboarding/
  proxy.ts                       # session refresh + route protection (Next 16)
supabase/
  migrations/0001_init_schema.sql  0002_rls.sql  0003_storage.sql
  seed.sql
public/  sw.js  manifest icons
```

---

## Privacy model (RLS)

- Anonymous users can browse **live** profiles and their public sub-rows.
- **Contact info** (`athlete_contacts`) requires a signed-in user.
- **Verification docs** and **raw reference contacts** are owner + admin only.
- Verification audit fields and suspension are admin-only, enforced by a DB
  trigger — a client can never self-verify.
- Helper functions live in a non-exposed `private` schema; the security advisor
  report is clean.

---

## Current stubs (intentional for v1)

- **Email:** Resend via REST; logs a stub when `RESEND_API_KEY` is unset.
- **No paywall:** contact is free to any signed-in user. The `contact_unlocks`
  table + a single contact-reveal component leave a clean seam for a future
  Stripe paywall.
- **Verification is manual:** a `verification_evidence` table + `verification_method`
  enum leave room for future automation.
- **Full auth-account deletion** (vs. suspend) needs the service-role key.
