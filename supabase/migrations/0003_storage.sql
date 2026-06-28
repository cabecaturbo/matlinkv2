-- MatLink v2 — Phase 1: Storage buckets + policies (tech stack §3)
-- Two buckets:
--   • avatars            — public profile/cover photos. Public bucket: objects are
--                          served via the public URL, so NO broad SELECT policy is
--                          needed (and adding one would expose a file listing).
--                          Only owner write policies are defined.
--   • verification-docs  — private ID / belt cert / membership card (owner + admin only)
-- Convention: objects are stored under "<auth.uid>/<filename>", so folder[1] = owner id.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880,
     array['image/jpeg','image/png','image/webp']),
  ('verification-docs', 'verification-docs', false, 10485760,
     array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do nothing;

-- ── avatars (public bucket — owner-only writes; public read via object URL) ──
create policy avatars_owner_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy avatars_owner_update on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy avatars_owner_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ── verification-docs (private bucket) ───────────────────────────────────────
create policy vdocs_owner_or_admin_read on storage.objects
  for select to authenticated
  using (bucket_id = 'verification-docs'
    and ((storage.foldername(name))[1] = auth.uid()::text or private.is_admin()));

create policy vdocs_owner_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'verification-docs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy vdocs_owner_or_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'verification-docs' and ((storage.foldername(name))[1] = auth.uid()::text or private.is_admin()))
  with check (bucket_id = 'verification-docs' and ((storage.foldername(name))[1] = auth.uid()::text or private.is_admin()));

create policy vdocs_owner_or_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'verification-docs' and ((storage.foldername(name))[1] = auth.uid()::text or private.is_admin()));
