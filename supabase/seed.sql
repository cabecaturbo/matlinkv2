-- MatLink v2 — marketplace seed (8 live demo coaches). Idempotent-ish: re-running
-- inserts duplicates, so only run on a fresh DB or clear seed rows first:
--   delete from auth.users where email like '%@seed.matlink.dev';  -- cascades to profiles
-- Applied via the Supabase MCP / SQL editor (service role bypasses RLS + GoTrue
-- email validation). These are display-only accounts (no login).

create or replace function private.seed_athlete(
  p_email text, p_name text, p_nat text, p_country text, p_city text,
  p_belt public.belt_rank, p_degree int, p_years int, p_academy text, p_professor text,
  p_ibjjf text, p_focus text[], p_langs text[], p_avail text[], p_regions text[],
  p_reloc boolean, p_visa boolean, p_verif public.verification_status,
  p_headline text, p_bio text, p_whatsapp text,
  p_comp text, p_div text, p_year int, p_place text
) returns void language plpgsql security definer set search_path = '' as $$
declare uid uuid := gen_random_uuid(); pid uuid;
begin
  insert into auth.users (instance_id, id, aud, role, email, created_at, updated_at,
     raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token,
     email_change, email_change_token_new, email_confirmed_at)
  values ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
     p_email, now(), now(), '{"provider":"email","providers":["email"]}',
     '{"role":"athlete"}', '', '', '', '', now());

  insert into public.athlete_profiles (
    user_id, status, full_name, nationality, location_country, location_city,
    belt, belt_degree, years_training, academy, professor, ibjjf_number,
    coaching_focus, languages, availability, relocation_regions, open_to_relocation,
    needs_visa, verification_status, verified_at, headline, bio, credentials_consent)
  values (uid, 'live', p_name, p_nat, p_country, p_city, p_belt,
    case when p_belt = 'black' then p_degree else null end, p_years, p_academy, p_professor, p_ibjjf,
    p_focus, p_langs, p_avail, p_regions, p_reloc, p_visa, p_verif,
    case when p_verif = 'verified' then now() else null end, p_headline, p_bio, true)
  returning id into pid;

  insert into public.athlete_contacts (profile_id, whatsapp_e164, public_email)
  values (pid, p_whatsapp, p_email);

  insert into public.athlete_results (profile_id, competition, division, year, placement, sort_order)
  values (pid, p_comp, p_div, p_year, p_place, 0);
end $$;

select private.seed_athlete('bruno@seed.matlink.dev','Bruno Carvalho','Brazil','Portugal','Lisbon','black',2,16,'Alliance','Fabio Gurgel','201234',array['Gi','No-Gi','Competition team'],array['Portuguese','English','Spanish'],array['Full-time','Seminars'],array['Europe','Middle East'],true,false,'verified','Black belt competitor & head instructor available in Europe','Two-decade competitor focused on building winning competition teams.','+351912345678','IBJJF World Championship','Black / Médio',2022,'Bronze');
select private.seed_athlete('lucas@seed.matlink.dev','Lucas Ferreira','Brazil','Brazil','Rio de Janeiro','brown',null,9,'Atos','Andre Galvao','305511',array['No-Gi','Competition team'],array['Portuguese','English'],array['Full-time'],array['North America'],true,true,'verified','Brown belt competitor seeking US head coach role','High-output no-gi competitor ready to relocate and compete for a US academy.','+5521987654321','IBJJF Pan Championship','Brown / Leve',2023,'Gold');
select private.seed_athlete('mateus@seed.matlink.dev','Mateus Oliveira','Brazil','Brazil','Sao Paulo','black',1,14,'Checkmat','Leo Vieira','198822',array['Gi','Fundamentals','Kids'],array['Portuguese','English'],array['Full-time','Part-time'],array['Asia','Oceania'],true,true,'pending','Black belt instructor — fundamentals & kids programs','Builds strong fundamentals and thriving kids programs from the ground up.','+5511991112222','CBJJ Brasileiro','Black / Pesado',2021,'Silver');
select private.seed_athlete('sofia@seed.matlink.dev','Sofia Martins','Portugal','Portugal','Porto','purple',null,7,'Icon BJJ','Rodrigo Cavaca',null,array['No-Gi','Private lessons','Kids'],array['Portuguese','English','French'],array['Part-time','Seminars'],array['Europe'],true,false,'unverified','Purple belt coach for kids & private lessons','Patient, detail-driven coach specializing in beginners and youth.','+351933221100','AJP Grand Slam','Purple / Pena',2023,'Gold');
select private.seed_athlete('diego@seed.matlink.dev','Diego Ramirez','Mexico','United States','Austin','black',3,18,'Gracie Barra','Carlos Gracie Jr','150099',array['Gi','Competition team','MMA grappling'],array['Spanish','English'],array['Full-time','Seminars'],array['North America','Middle East'],true,false,'verified','3rd-degree black belt — head coach & seminars','Veteran coach blending IBJJF competition and MMA grappling programs.','+15125550199','IBJJF World Masters','Black / Master 2',2022,'Gold');
select private.seed_athlete('hiroshi@seed.matlink.dev','Hiroshi Tanaka','Japan','Japan','Tokyo','brown',null,10,'Carpe Diem','Yuki Nakai','221145',array['Gi','No-Gi','Fundamentals'],array['Japanese','English'],array['Full-time'],array['Asia','Oceania'],true,false,'verified','Brown belt coach — technical gi & no-gi','Technical coach with a decade developing competitors in Tokyo.','+819012345678','JJWL Asia Open','Brown / Leve',2023,'Gold');
select private.seed_athlete('amira@seed.matlink.dev','Amira Haddad','United Arab Emirates','United Arab Emirates','Abu Dhabi','blue',null,5,'Commando Group','Ramon Lemos',null,array['No-Gi','Kids','Fundamentals'],array['Arabic','English','French'],array['Part-time','Seminars'],array['Middle East','Europe'],true,false,'unverified','Blue belt coach for kids & fundamentals','Growing the next generation of grapplers in the UAE.','+971501234567','UAEJJF National','Blue / Pena',2023,'Silver');
select private.seed_athlete('thiago@seed.matlink.dev','Thiago Souza','Brazil','Brazil','Sao Paulo','black',1,13,'PSLPB Cicero Costha','Cicero Costha','177654',array['Competition team','No-Gi','Gi'],array['Portuguese','English'],array['Full-time'],array['Europe','North America'],true,true,'verified','Black belt competition coach open to relocating','Forged in one of the toughest competition camps in Brazil.','+5511993334444','IBJJF No-Gi Worlds','Black / Médio',2022,'Bronze');

drop function private.seed_athlete(text,text,text,text,text,public.belt_rank,int,int,text,text,text,text[],text[],text[],text[],boolean,boolean,public.verification_status,text,text,text,text,text,int,text);

-- Role/position types per coach (added in migration 0004).
update public.athlete_profiles p set roles = v.roles
from (values
  ('bruno@seed.matlink.dev',   array['Head coach','Assistant coach']),
  ('lucas@seed.matlink.dev',   array['Head coach','Social media']),
  ('mateus@seed.matlink.dev',  array['Kids program coach','Front desk manager']),
  ('sofia@seed.matlink.dev',   array['Private lessons coach','Kids program coach','Social media']),
  ('diego@seed.matlink.dev',   array['Head coach','Sales']),
  ('hiroshi@seed.matlink.dev', array['Head coach','Videographer']),
  ('amira@seed.matlink.dev',   array['Kids program coach','Photographer','Social media']),
  ('thiago@seed.matlink.dev',  array['Head coach','Marketing'])
) as v(email, roles)
where p.user_id = (select id from public.users u where u.email = v.email);
