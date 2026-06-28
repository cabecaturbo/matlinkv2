-- MatLink v2 — add role/position types an athlete is open to (beyond coaching):
-- front desk, sales, marketing, social media, videographer, photographer, etc.
alter table public.athlete_profiles
  add column roles text[] not null default '{}';

create index idx_athlete_profiles_roles on public.athlete_profiles using gin (roles);
