-- MatLink v2 — Phase 1: schema (enums, tables, helpers, triggers)
-- Data model per build prompt §8. RLS lives in 0002_rls.sql; storage in 0003_storage.sql.
-- Postgres 17 (gen_random_uuid() is built in — no extension needed).

-- ────────────────────────────────────────────────────────────────────────────
-- 0. PRIVATE SCHEMA for helper functions
--    Kept out of the PostgREST-exposed `public` schema so helpers aren't callable
--    as RPC, while still usable inside RLS policies and triggers.
-- ────────────────────────────────────────────────────────────────────────────
create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role;

-- ────────────────────────────────────────────────────────────────────────────
-- 1. ENUMS
-- ────────────────────────────────────────────────────────────────────────────
create type public.user_role           as enum ('athlete', 'gym', 'admin');
create type public.profile_status      as enum ('draft', 'pending', 'live', 'suspended');
create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type public.belt_rank           as enum ('white', 'blue', 'purple', 'brown', 'black');
create type public.link_type           as enum ('ibjjf', 'bjjheroes', 'flograppling', 'smoothcomp', 'instagram', 'youtube', 'other');
-- room for later automation (§6 "design for future automation")
create type public.verification_method as enum ('manual', 'smoothcomp_oauth', 'scraper', 'partner_api');

-- ────────────────────────────────────────────────────────────────────────────
-- 2. TABLES
-- ────────────────────────────────────────────────────────────────────────────

-- 2.1 users — app mirror of auth.users carrying the role (set by signup trigger)
create table public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  role       public.user_role not null default 'athlete',
  created_at timestamptz not null default now()
);

-- 2.2 athlete_profiles — public marketing + verification record (NO raw contact here)
create table public.athlete_profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references auth.users(id) on delete cascade,
  status              public.profile_status not null default 'draft',

  -- Step 1 — identity & basics
  full_name           text,
  photo_url           text,
  cover_url           text,
  dob                 date,
  nationality         text,
  location_country    text,
  location_city       text,
  languages           text[] not null default '{}',

  -- Step 2 — BJJ credentials
  belt                public.belt_rank,
  belt_degree         smallint check (belt_degree between 0 and 6),
  years_training      smallint check (years_training >= 0),
  professor           text,
  academy             text,
  ibjjf_number        text,
  affiliations        text[] not null default '{}',

  -- Step 3 — competition record (structured results/links are separate tables)
  highlights          text,

  -- Step 4 — what they offer / availability
  headline            text,
  bio                 text,
  coaching_focus      text[] not null default '{}',
  open_to_relocation  boolean not null default false,
  relocation_regions  text[] not null default '{}',
  needs_visa          boolean not null default false,
  availability        text[] not null default '{}',
  rate_note           text,

  -- Step 5 — consent (docs live in verification_docs)
  credentials_consent boolean not null default false,

  -- verification (audit fields are admin-write-only, enforced by guard trigger)
  verification_status public.verification_status not null default 'unverified',
  verification_method public.verification_method not null default 'manual',
  verified_at         timestamptz,
  verified_by         uuid references auth.users(id),
  rejection_reason    text,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 2.3 athlete_contacts — contact info, split out so it can be hidden from anon at the DB
--     layer (column-level privacy can't be expressed with row-level RLS; a table can).
create table public.athlete_contacts (
  profile_id    uuid primary key references public.athlete_profiles(id) on delete cascade,
  whatsapp_e164 text,
  public_email  text
);

-- 2.4 athlete_results — structured "notable results" repeater (§5 Step 3)
create table public.athlete_results (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.athlete_profiles(id) on delete cascade,
  competition text not null,
  division    text,
  year        smallint,
  placement   text,
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now()
);

-- 2.5 athlete_links — public profile / social links (§5 Step 3; double as verification evidence)
create table public.athlete_links (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.athlete_profiles(id) on delete cascade,
  type       public.link_type not null default 'other',
  url        text not null,
  created_at timestamptz not null default now()
);

-- 2.6 athlete_references — name/relationship/note are public for live profiles.
--     Raw contact lives in athlete_reference_contacts (owner + admin only).
create table public.athlete_references (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.athlete_profiles(id) on delete cascade,
  name         text not null,
  relationship text,
  note         text,
  created_at   timestamptz not null default now()
);

-- 2.7 athlete_reference_contacts — private raw contact for a reference (split for privacy)
create table public.athlete_reference_contacts (
  reference_id uuid primary key references public.athlete_references(id) on delete cascade,
  contact      text
);

-- 2.8 verification_docs — uploaded ID / belt cert / membership card (§5 Step 5) — admin + owner only
create table public.verification_docs (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.athlete_profiles(id) on delete cascade,
  file_url   text not null,
  doc_type   text,
  created_at timestamptz not null default now()
);

-- 2.9 verification_evidence — seam for future automated verification (§6) — admin only
create table public.verification_evidence (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.athlete_profiles(id) on delete cascade,
  method     public.verification_method not null default 'manual',
  payload    jsonb,
  checked_by uuid references auth.users(id),
  checked_at timestamptz
);

-- 2.10 gym_profiles — lightweight gym/hiring profile (§8)
create table public.gym_profiles (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null unique references auth.users(id) on delete cascade,
  gym_name         text,
  location_country text,
  location_city    text,
  website          text,
  looking_for      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 2.11 contact_unlocks — seam for a future paywall (§9). Unused in v1.
create table public.contact_unlocks (
  id          uuid primary key default gen_random_uuid(),
  gym_user_id uuid not null references auth.users(id) on delete cascade,
  athlete_id  uuid not null references public.athlete_profiles(id) on delete cascade,
  paid_at     timestamptz,
  amount      integer,
  created_at  timestamptz not null default now(),
  unique (gym_user_id, athlete_id)
);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. HELPERS (in `private`; SECURITY DEFINER → safe inside RLS, no recursion)
-- ────────────────────────────────────────────────────────────────────────────
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- 4. INDEXES (marketplace filters/sorts — §7)
-- ────────────────────────────────────────────────────────────────────────────
create index idx_athlete_profiles_status       on public.athlete_profiles (status);
create index idx_athlete_profiles_verification on public.athlete_profiles (verification_status);
create index idx_athlete_profiles_belt         on public.athlete_profiles (belt);
create index idx_athlete_profiles_country      on public.athlete_profiles (location_country);
create index idx_athlete_profiles_created      on public.athlete_profiles (created_at desc);
create index idx_athlete_profiles_languages    on public.athlete_profiles using gin (languages);
create index idx_athlete_profiles_focus        on public.athlete_profiles using gin (coaching_focus);
create index idx_athlete_profiles_regions      on public.athlete_profiles using gin (relocation_regions);
create index idx_athlete_results_profile       on public.athlete_results (profile_id);
create index idx_athlete_links_profile         on public.athlete_links (profile_id);
create index idx_athlete_references_profile    on public.athlete_references (profile_id);
create index idx_verification_docs_profile     on public.verification_docs (profile_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 5. TRIGGERS
-- ────────────────────────────────────────────────────────────────────────────

-- 5.1 keep updated_at fresh
create trigger trg_athlete_profiles_updated_at
  before update on public.athlete_profiles
  for each row execute function private.set_updated_at();

create trigger trg_gym_profiles_updated_at
  before update on public.gym_profiles
  for each row execute function private.set_updated_at();

-- 5.2 provision public.users on signup; role comes from auth metadata.
--     'admin' is NOT self-assignable — only 'athlete'/'gym' honored, else default 'athlete'.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role public.user_role;
begin
  if (new.raw_user_meta_data ->> 'role') in ('athlete', 'gym') then
    v_role := (new.raw_user_meta_data ->> 'role')::public.user_role;
  else
    v_role := 'athlete';
  end if;

  insert into public.users (id, email, role)
  values (new.id, new.email, v_role)
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- 5.3 trust boundary: only an admin may set verification audit fields, flip 'verified',
--     or suspend/unsuspend. An owner may submit for review (-> 'pending') and resubmit
--     from 'rejected'. Enforced at the DB layer so the client can never bypass it.
create or replace function private.guard_athlete_verification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if private.is_admin() then
    return new;
  end if;

  if new.verification_status is distinct from old.verification_status then
    if not (new.verification_status = 'pending'
            and old.verification_status in ('unverified', 'rejected')) then
      raise exception 'verification_status can only be changed by an admin';
    end if;
  end if;

  if new.verified_at      is distinct from old.verified_at
     or new.verified_by   is distinct from old.verified_by
     or new.rejection_reason is distinct from old.rejection_reason then
    raise exception 'verification audit fields can only be changed by an admin';
  end if;

  if new.status = 'suspended' or old.status = 'suspended' then
    raise exception 'suspension status can only be changed by an admin';
  end if;

  return new;
end;
$$;

create trigger trg_guard_athlete_verification
  before update on public.athlete_profiles
  for each row execute function private.guard_athlete_verification();
