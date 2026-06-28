-- MatLink v2 — role is chosen AFTER authentication (passwordless/OAuth friendly,
-- and a clean recoverable step per the auth spec A2/A3). Make it nullable.
alter table public.users alter column role drop default;
alter table public.users alter column role drop not null;

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_role public.user_role;
begin
  if (new.raw_user_meta_data ->> 'role') in ('athlete', 'gym') then
    v_role := (new.raw_user_meta_data ->> 'role')::public.user_role;
  else
    v_role := null; -- chosen on the /role screen after first login
  end if;
  insert into public.users (id, email, role)
  values (new.id, new.email, v_role)
  on conflict (id) do nothing;
  return new;
end;
$$;
