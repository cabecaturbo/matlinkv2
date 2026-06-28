-- MatLink v2 — Phase 1: Row Level Security (build prompt §8 "RLS rules (critical)")
-- Principle: privacy is enforced at the DB layer, never trusted from the client.
--   • Anyone (incl. anonymous) may read LIVE athlete profiles + their public sub-rows
--     (profile, results, links, reference names/notes).
--   • Contact info (athlete_contacts) requires a signed-in user (no paywall in v1).
--   • Verification docs + raw reference contact: owner + admin only.
--   • Everyone edits only their own; admin reads/edits all.

alter table public.users                      enable row level security;
alter table public.athlete_profiles           enable row level security;
alter table public.athlete_contacts           enable row level security;
alter table public.athlete_results            enable row level security;
alter table public.athlete_links              enable row level security;
alter table public.athlete_references         enable row level security;
alter table public.athlete_reference_contacts enable row level security;
alter table public.verification_docs          enable row level security;
alter table public.verification_evidence      enable row level security;
alter table public.gym_profiles               enable row level security;
alter table public.contact_unlocks            enable row level security;

-- ── users ────────────────────────────────────────────────────────────────────
-- Read your own row; admin reads all. (Inserts happen via the SECURITY DEFINER
-- signup trigger, so no client insert policy. Role changes are admin-only.)
create policy users_select_self_or_admin on public.users
  for select to authenticated
  using (id = auth.uid() or private.is_admin());

create policy users_update_admin on public.users
  for update to authenticated
  using (private.is_admin()) with check (private.is_admin());

-- ── athlete_profiles ─────────────────────────────────────────────────────────
create policy athlete_profiles_select on public.athlete_profiles
  for select to anon, authenticated
  using (status = 'live' or user_id = auth.uid() or private.is_admin());

create policy athlete_profiles_insert on public.athlete_profiles
  for insert to authenticated
  with check (user_id = auth.uid());

-- Owner edits own; admin edits all. Verification/suspension fields are further
-- gated by private.guard_athlete_verification().
create policy athlete_profiles_update on public.athlete_profiles
  for update to authenticated
  using (user_id = auth.uid() or private.is_admin())
  with check (user_id = auth.uid() or private.is_admin());

create policy athlete_profiles_delete on public.athlete_profiles
  for delete to authenticated
  using (user_id = auth.uid() or private.is_admin());

-- ── athlete_contacts (requires sign-in to read — §6 "sign in at contact moment") ──
create policy athlete_contacts_select on public.athlete_contacts
  for select to authenticated
  using (
    private.is_admin()
    or exists (select 1 from public.athlete_profiles p
               where p.id = profile_id and (p.status = 'live' or p.user_id = auth.uid()))
  );

create policy athlete_contacts_write on public.athlete_contacts
  for all to authenticated
  using (private.is_admin()
    or exists (select 1 from public.athlete_profiles p where p.id = profile_id and p.user_id = auth.uid()))
  with check (private.is_admin()
    or exists (select 1 from public.athlete_profiles p where p.id = profile_id and p.user_id = auth.uid()));

-- ── athlete_results & athlete_links (public for live profiles; owner/admin write) ──
create policy athlete_results_select on public.athlete_results
  for select to anon, authenticated
  using (exists (select 1 from public.athlete_profiles p
    where p.id = profile_id and (p.status = 'live' or p.user_id = auth.uid() or private.is_admin())));

create policy athlete_results_write on public.athlete_results
  for all to authenticated
  using (exists (select 1 from public.athlete_profiles p where p.id = profile_id and (p.user_id = auth.uid() or private.is_admin())))
  with check (exists (select 1 from public.athlete_profiles p where p.id = profile_id and (p.user_id = auth.uid() or private.is_admin())));

create policy athlete_links_select on public.athlete_links
  for select to anon, authenticated
  using (exists (select 1 from public.athlete_profiles p
    where p.id = profile_id and (p.status = 'live' or p.user_id = auth.uid() or private.is_admin())));

create policy athlete_links_write on public.athlete_links
  for all to authenticated
  using (exists (select 1 from public.athlete_profiles p where p.id = profile_id and (p.user_id = auth.uid() or private.is_admin())))
  with check (exists (select 1 from public.athlete_profiles p where p.id = profile_id and (p.user_id = auth.uid() or private.is_admin())));

-- ── athlete_references (names/notes public for live profiles; owner/admin write) ──
create policy athlete_references_select on public.athlete_references
  for select to anon, authenticated
  using (exists (select 1 from public.athlete_profiles p
    where p.id = profile_id and (p.status = 'live' or p.user_id = auth.uid() or private.is_admin())));

create policy athlete_references_write on public.athlete_references
  for all to authenticated
  using (exists (select 1 from public.athlete_profiles p where p.id = profile_id and (p.user_id = auth.uid() or private.is_admin())))
  with check (exists (select 1 from public.athlete_profiles p where p.id = profile_id and (p.user_id = auth.uid() or private.is_admin())));

-- ── athlete_reference_contacts (raw contact — owner + admin only) ──
create policy athlete_reference_contacts_select on public.athlete_reference_contacts
  for select to authenticated
  using (exists (
    select 1 from public.athlete_references r
    join public.athlete_profiles p on p.id = r.profile_id
    where r.id = reference_id and (p.user_id = auth.uid() or private.is_admin())
  ));

create policy athlete_reference_contacts_write on public.athlete_reference_contacts
  for all to authenticated
  using (exists (select 1 from public.athlete_references r join public.athlete_profiles p on p.id = r.profile_id
    where r.id = reference_id and (p.user_id = auth.uid() or private.is_admin())))
  with check (exists (select 1 from public.athlete_references r join public.athlete_profiles p on p.id = r.profile_id
    where r.id = reference_id and (p.user_id = auth.uid() or private.is_admin())));

-- ── verification_docs (private — owner + admin only) ──
create policy verification_docs_select on public.verification_docs
  for select to authenticated
  using (exists (select 1 from public.athlete_profiles p where p.id = profile_id and (p.user_id = auth.uid() or private.is_admin())));

create policy verification_docs_write on public.verification_docs
  for all to authenticated
  using (exists (select 1 from public.athlete_profiles p where p.id = profile_id and (p.user_id = auth.uid() or private.is_admin())))
  with check (exists (select 1 from public.athlete_profiles p where p.id = profile_id and (p.user_id = auth.uid() or private.is_admin())));

-- ── verification_evidence (admin only — future automation seam) ──
create policy verification_evidence_admin on public.verification_evidence
  for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

-- ── gym_profiles (private to owner + admin in v1; not browsable) ──
create policy gym_profiles_select on public.gym_profiles
  for select to authenticated
  using (user_id = auth.uid() or private.is_admin());

create policy gym_profiles_insert on public.gym_profiles
  for insert to authenticated
  with check (user_id = auth.uid());

create policy gym_profiles_update on public.gym_profiles
  for update to authenticated
  using (user_id = auth.uid() or private.is_admin())
  with check (user_id = auth.uid() or private.is_admin());

create policy gym_profiles_delete on public.gym_profiles
  for delete to authenticated
  using (user_id = auth.uid() or private.is_admin());

-- ── contact_unlocks (future paywall — gym owner of the unlock + admin) ──
create policy contact_unlocks_rw on public.contact_unlocks
  for all to authenticated
  using (gym_user_id = auth.uid() or private.is_admin())
  with check (gym_user_id = auth.uid() or private.is_admin());
