-- MatLink v2 — allow a user to update their own users row (choose/switch role)
-- but never self-assign admin. Admins retain full rights via users_update_admin.
create policy users_update_self on public.users
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role is distinct from 'admin');
