/* eslint-disable @typescript-eslint/no-explicit-any */
// Demo dataset — the marketplace you see when MatLink runs without a backend.
//
// NOTE ON CONTENT: the three headline athletes are real competitors and the
// photos are real, but every *account* detail here is invented for the demo —
// availability, relocation plans, references, WhatsApp numbers and emails are
// placeholders, not real contact details. Competition results are included to
// make the profiles feel real; treat them as demo copy and correct them before
// this is shown anywhere public.

export type DemoRow = Record<string, any>;
export type DemoStore = Record<string, DemoRow[]>;

// Stable ids so /athletes/<id> URLs don't move between restarts.
export const DEMO_USER_IDS = {
  lucas: "11111111-1111-4111-8111-111111111111",
  kaynan: "22222222-2222-4222-8222-222222222222",
  felipe: "33333333-3333-4333-8333-333333333333",
  gym: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  admin: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
} as const;

export const DEMO_PROFILE_IDS = {
  lucas: "0c1a5e70-1111-4a11-8a11-a1a1a1a1a1a1",
  kaynan: "0c2a5e70-2222-4a22-8a22-a2a2a2a2a2a2",
  felipe: "0c3a5e70-3333-4a33-8a33-a3a3a3a3a3a3",
} as const;

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString();

// ---------------------------------------------------------------- helpers

let seq = 0;
const rowId = (prefix: string) =>
  `${prefix}-0000-4000-8000-${String(++seq).padStart(12, "0")}`;

type AthleteInput = Partial<DemoRow> & { id: string; user_id: string };

/** Fill every athlete_profiles column so pages never hit an undefined. */
function athlete(input: AthleteInput): DemoRow {
  return {
    academy: null,
    affiliations: [],
    availability: [],
    belt: null,
    belt_degree: null,
    bio: null,
    coaching_focus: [],
    cover_url: null,
    created_at: daysAgo(30),
    credentials_consent: true,
    dob: null,
    full_name: null,
    headline: null,
    highlights: null,
    ibjjf_number: null,
    languages: [],
    location_city: null,
    location_country: null,
    nationality: null,
    needs_visa: false,
    open_to_relocation: false,
    photo_url: null,
    professor: null,
    rate_note: null,
    rejection_reason: null,
    relocation_regions: [],
    roles: [],
    status: "live",
    updated_at: daysAgo(3),
    verification_method: "manual",
    verification_status: "unverified",
    verified_at: null,
    verified_by: null,
    years_training: null,
    ...input,
  };
}

// ---------------------------------------------------------------- roster

function headliners(): DemoRow[] {
  return [
    athlete({
      id: DEMO_PROFILE_IDS.lucas,
      user_id: DEMO_USER_IDS.lucas,
      full_name: "Lucas Barbosa",
      nationality: "Brazil",
      location_country: "United States",
      location_city: "San Diego",
      belt: "black",
      belt_degree: 2,
      years_training: 18,
      academy: "Atos Jiu-Jitsu",
      professor: "André Galvão",
      ibjjf_number: "160244",
      dob: "1994-06-12",
      photo_url: "/athletes/lucas-barbosa-avatar.jpg",
      cover_url: "/athletes/lucas-barbosa-cover.jpg",
      headline:
        "World-champion black belt building a competition team that actually wins.",
      bio: "Known as “Hulk” — a gi and no-gi competitor who has spent his career at the sharp end of the heaviest divisions in the sport.\n\nI have been coaching alongside competing for the last six years: running the competition class, cornering athletes at the majors, and building the strength side of the programme. What I care about is the pipeline — taking a room of hobbyists and blue belts and turning a handful of them into people who medal, without burning out the other ninety percent who just want to train.\n\nOpen to a head coach or competition-team role for a gym that is serious about building something over the next five years.",
      highlights:
        "IBJJF World Champion at black belt.\nADCC World Championship medallist.\nMultiple-time IBJJF Pan and No-Gi World medallist.\nSix years coaching a competition team alongside a full competition schedule.",
      coaching_focus: ["Gi", "No-Gi", "Competition team", "Private lessons"],
      roles: ["Head coach", "Private lessons coach"],
      languages: ["Portuguese", "English"],
      availability: ["Full-time", "Seminars"],
      relocation_regions: ["North America", "Middle East", "Europe"],
      open_to_relocation: true,
      needs_visa: false,
      affiliations: ["IBJJF", "ADCC", "AJP"],
      verification_status: "verified",
      verified_at: daysAgo(12),
      rate_note: "Negotiable — depends on the role and the equity in the programme.",
      created_at: daysAgo(2),
      updated_at: daysAgo(1),
    }),

    athlete({
      id: DEMO_PROFILE_IDS.kaynan,
      user_id: DEMO_USER_IDS.kaynan,
      full_name: "Kaynan Duarte",
      nationality: "Brazil",
      location_country: "United States",
      location_city: "San Diego",
      belt: "black",
      belt_degree: 2,
      years_training: 16,
      academy: "Atos Jiu-Jitsu",
      professor: "André Galvão",
      ibjjf_number: "170881",
      dob: "1998-09-02",
      photo_url: "/athletes/kaynan-duarte-avatar.jpg",
      cover_url: "/athletes/kaynan-duarte-cover.jpg",
      headline:
        "ADCC gold medallist. Seminars worldwide, and open to the right head-coach seat.",
      bio: "I came up through the Atos competition room and have competed at the top of both gi and no-gi since my first year as a black belt.\n\nMy coaching is built on positional pressure and a very small number of systems drilled to the point of boredom. I would rather a team knows four positions completely than forty positions vaguely — that is what holds up when someone is trying to take your head off in the final.\n\nCurrently teaching seminars internationally. Interested in a full-time head coach role in a gym with a real competition culture, or a recurring seminar residency.",
      highlights:
        "ADCC World Championship gold medallist.\nIBJJF World Champion at black belt.\nIBJJF Pan Championship gold medallist.\nTeaches seminars across North America, Europe and the Middle East.",
      coaching_focus: ["Gi", "No-Gi", "Competition team"],
      roles: ["Head coach", "Assistant coach"],
      languages: ["Portuguese", "English", "Spanish"],
      availability: ["Full-time", "Seminars", "Short camps"],
      relocation_regions: ["North America", "Middle East", "Oceania"],
      open_to_relocation: true,
      needs_visa: false,
      affiliations: ["IBJJF", "ADCC"],
      verification_status: "verified",
      verified_at: daysAgo(9),
      rate_note: "Seminar rate on request. Full-time role negotiable.",
      created_at: daysAgo(4),
      updated_at: daysAgo(2),
    }),

    athlete({
      id: DEMO_PROFILE_IDS.felipe,
      user_id: DEMO_USER_IDS.felipe,
      full_name: "Felipe Pena",
      nationality: "Brazil",
      location_country: "Brazil",
      location_city: "Rio de Janeiro",
      belt: "black",
      belt_degree: 3,
      years_training: 20,
      academy: "Gracie Barra",
      professor: "Ricardo Vieira",
      ibjjf_number: "142907",
      dob: "1990-11-24",
      photo_url: "/athletes/felipe-pena-avatar.jpg",
      cover_url: "/athletes/felipe-pena-cover.jpg",
      headline:
        "Multiple-time world champion. Looking to head a competition programme abroad.",
      bio: "“Preguiça.” Twenty years on the mats, most of them chasing the same few titles.\n\nI have taught in Brazil my whole career and I am now looking to take a programme abroad — a gym that wants to build a competition team from the ground up and is willing to give it the five years it actually takes.\n\nI teach the guard I built my career on, and I teach it in a way that works for people who are not professional athletes. Fluent in Portuguese, working English, learning Spanish.",
      highlights:
        "Multiple-time IBJJF World Champion at black belt.\nADCC World Championship gold medallist.\nTwo decades competing and coaching at the highest level in Brazil.\nBuilt and cornered competition teams in Rio de Janeiro.",
      coaching_focus: ["Gi", "No-Gi", "Competition team", "Fundamentals"],
      roles: ["Head coach", "Private lessons coach"],
      languages: ["Portuguese", "English"],
      availability: ["Full-time"],
      relocation_regions: ["Europe", "Middle East", "North America"],
      open_to_relocation: true,
      needs_visa: true,
      affiliations: ["IBJJF", "ADCC", "CBJJ"],
      verification_status: "verified",
      verified_at: daysAgo(5),
      rate_note: "Open to a salary plus a share of the competition programme.",
      created_at: daysAgo(6),
      updated_at: daysAgo(5),
    }),
  ];
}

/** Supporting inventory so the marketplace and its filters feel populated. */
function supportingCast(): DemoRow[] {
  const cast: AthleteInput[] = [
    {
      id: rowId("0d01"),
      user_id: rowId("0e01"),
      full_name: "Bruno Carvalho",
      nationality: "Brazil",
      location_country: "Portugal",
      location_city: "Lisbon",
      belt: "black",
      belt_degree: 2,
      years_training: 16,
      academy: "Alliance",
      professor: "Fabio Gurgel",
      ibjjf_number: "201234",
      headline: "Black belt competitor & head instructor available in Europe",
      bio: "Two-decade competitor focused on building winning competition teams.",
      coaching_focus: ["Gi", "No-Gi", "Competition team"],
      roles: ["Head coach", "Assistant coach"],
      languages: ["Portuguese", "English", "Spanish"],
      availability: ["Full-time", "Seminars"],
      relocation_regions: ["Europe", "Middle East"],
      open_to_relocation: true,
      verification_status: "verified",
      verified_at: daysAgo(40),
      created_at: daysAgo(20),
    },
    {
      id: rowId("0d02"),
      user_id: rowId("0e02"),
      full_name: "Lucas Ferreira",
      nationality: "Brazil",
      location_country: "Brazil",
      location_city: "Rio de Janeiro",
      belt: "brown",
      years_training: 9,
      academy: "Atos",
      professor: "Andre Galvao",
      ibjjf_number: "305511",
      headline: "Brown belt competitor seeking US head coach role",
      bio: "High-output no-gi competitor ready to relocate and compete for a US academy.",
      coaching_focus: ["No-Gi", "Competition team"],
      roles: ["Head coach", "Social media"],
      languages: ["Portuguese", "English"],
      availability: ["Full-time"],
      relocation_regions: ["North America"],
      open_to_relocation: true,
      needs_visa: true,
      verification_status: "verified",
      verified_at: daysAgo(35),
      created_at: daysAgo(22),
    },
    {
      id: rowId("0d03"),
      user_id: rowId("0e03"),
      full_name: "Mateus Oliveira",
      nationality: "Brazil",
      location_country: "Brazil",
      location_city: "Sao Paulo",
      belt: "black",
      belt_degree: 1,
      years_training: 14,
      academy: "Checkmat",
      professor: "Leo Vieira",
      ibjjf_number: "198822",
      headline: "Black belt instructor — fundamentals & kids programs",
      bio: "Builds strong fundamentals and thriving kids programs from the ground up.",
      coaching_focus: ["Gi", "Fundamentals", "Kids"],
      roles: ["Kids program coach", "Front desk manager"],
      languages: ["Portuguese", "English"],
      availability: ["Full-time", "Part-time"],
      relocation_regions: ["Asia", "Oceania"],
      open_to_relocation: true,
      needs_visa: true,
      verification_status: "pending",
      created_at: daysAgo(11),
      updated_at: daysAgo(8),
      highlights:
        "CBJJ Brasileiro silver medallist at black belt.\nBuilt a 90-child kids programme from scratch in Sao Paulo.\nRuns the fundamentals curriculum for a 300-member academy.",
    },
    {
      id: rowId("0d04"),
      user_id: rowId("0e04"),
      full_name: "Sofia Martins",
      nationality: "Portugal",
      location_country: "Portugal",
      location_city: "Porto",
      belt: "purple",
      years_training: 7,
      academy: "Icon BJJ",
      professor: "Rodrigo Cavaca",
      headline: "Purple belt coach for kids & private lessons",
      bio: "Patient, detail-driven coach specializing in beginners and youth.",
      coaching_focus: ["No-Gi", "Private lessons", "Kids"],
      roles: ["Private lessons coach", "Kids program coach", "Social media"],
      languages: ["Portuguese", "English", "French"],
      availability: ["Part-time", "Seminars"],
      relocation_regions: ["Europe"],
      open_to_relocation: true,
      verification_status: "pending",
      created_at: daysAgo(25),
      updated_at: daysAgo(7),
    },
    {
      id: rowId("0d05"),
      user_id: rowId("0e05"),
      full_name: "Diego Ramirez",
      nationality: "Mexico",
      location_country: "United States",
      location_city: "Austin",
      belt: "black",
      belt_degree: 3,
      years_training: 18,
      academy: "Gracie Barra",
      professor: "Carlos Gracie Jr",
      ibjjf_number: "150099",
      headline: "3rd-degree black belt — head coach & seminars",
      bio: "Veteran coach blending IBJJF competition and MMA grappling programs.",
      coaching_focus: ["Gi", "Competition team", "MMA grappling"],
      roles: ["Head coach", "Sales"],
      languages: ["Spanish", "English"],
      availability: ["Full-time", "Seminars"],
      relocation_regions: ["North America", "Middle East"],
      open_to_relocation: true,
      verification_status: "verified",
      verified_at: daysAgo(60),
      created_at: daysAgo(28),
    },
    {
      id: rowId("0d06"),
      user_id: rowId("0e06"),
      full_name: "Hiroshi Tanaka",
      nationality: "Japan",
      location_country: "Japan",
      location_city: "Tokyo",
      belt: "brown",
      years_training: 10,
      academy: "Carpe Diem",
      professor: "Yuki Nakai",
      ibjjf_number: "221145",
      headline: "Brown belt coach — technical gi & no-gi",
      bio: "Technical coach with a decade developing competitors in Tokyo.",
      coaching_focus: ["Gi", "No-Gi", "Fundamentals"],
      roles: ["Head coach", "Videographer"],
      languages: ["Japanese", "English"],
      availability: ["Full-time"],
      relocation_regions: ["Asia", "Oceania"],
      open_to_relocation: true,
      verification_status: "verified",
      verified_at: daysAgo(30),
      created_at: daysAgo(18),
    },
    {
      id: rowId("0d07"),
      user_id: rowId("0e07"),
      full_name: "Amira Haddad",
      nationality: "United Arab Emirates",
      location_country: "United Arab Emirates",
      location_city: "Abu Dhabi",
      belt: "blue",
      years_training: 5,
      academy: "Commando Group",
      professor: "Ramon Lemos",
      headline: "Blue belt coach for kids & fundamentals",
      bio: "Growing the next generation of grapplers in the UAE.",
      coaching_focus: ["No-Gi", "Kids", "Fundamentals"],
      roles: ["Kids program coach", "Photographer", "Social media"],
      languages: ["Arabic", "English", "French"],
      availability: ["Part-time", "Seminars"],
      relocation_regions: ["Middle East", "Europe"],
      open_to_relocation: true,
      verification_status: "unverified",
      created_at: daysAgo(15),
    },
    {
      id: rowId("0d08"),
      user_id: rowId("0e08"),
      full_name: "Thiago Souza",
      nationality: "Brazil",
      location_country: "Brazil",
      location_city: "Sao Paulo",
      belt: "black",
      belt_degree: 1,
      years_training: 13,
      academy: "PSLPB Cicero Costha",
      professor: "Cicero Costha",
      ibjjf_number: "177654",
      headline: "Black belt competition coach open to relocating",
      bio: "Forged in one of the toughest competition camps in Brazil.",
      coaching_focus: ["Competition team", "No-Gi", "Gi"],
      roles: ["Head coach", "Marketing"],
      languages: ["Portuguese", "English"],
      availability: ["Full-time"],
      relocation_regions: ["Europe", "North America"],
      open_to_relocation: true,
      needs_visa: true,
      verification_status: "verified",
      verified_at: daysAgo(50),
      created_at: daysAgo(26),
    },
  ];

  return cast.map(athlete);
}

// ---------------------------------------------------------------- store

export function buildStore(): DemoStore {
  seq = 0;
  const profiles = [...headliners(), ...supportingCast()];
  const P = DEMO_PROFILE_IDS;

  const results: DemoRow[] = [
    // Lucas Barbosa
    r(P.lucas, "IBJJF World Championship", "Black / Meio-Pesado", 2022, "Gold", 0),
    r(P.lucas, "IBJJF No-Gi World Championship", "Black / Meio-Pesado", 2021, "Gold", 1),
    r(P.lucas, "ADCC World Championship", "88kg", 2022, "Silver", 2),
    r(P.lucas, "IBJJF Pan Championship", "Black / Meio-Pesado", 2019, "Gold", 3),
    // Kaynan Duarte
    r(P.kaynan, "ADCC World Championship", "99kg", 2022, "Gold", 0),
    r(P.kaynan, "ADCC World Championship", "88kg", 2019, "Gold", 1),
    r(P.kaynan, "IBJJF World Championship", "Black / Pesado", 2018, "Gold", 2),
    r(P.kaynan, "IBJJF Pan Championship", "Black / Pesado", 2019, "Gold", 3),
    // Felipe Pena
    r(P.felipe, "ADCC World Championship", "99kg", 2017, "Gold", 0),
    r(P.felipe, "IBJJF World Championship", "Black / Meio-Pesado", 2018, "Gold", 1),
    r(P.felipe, "IBJJF World Championship", "Black / Meio-Pesado", 2016, "Gold", 2),
    r(P.felipe, "IBJJF World Championship", "Black / Meio-Pesado", 2014, "Gold", 3),
  ];

  // One headline result each for the supporting cast.
  const castResults: [string, string, string, number, string][] = [
    ["Bruno Carvalho", "IBJJF World Championship", "Black / Médio", 2022, "Bronze"],
    ["Lucas Ferreira", "IBJJF Pan Championship", "Brown / Leve", 2023, "Gold"],
    ["Mateus Oliveira", "CBJJ Brasileiro", "Black / Pesado", 2021, "Silver"],
    ["Sofia Martins", "AJP Grand Slam", "Purple / Pena", 2023, "Gold"],
    ["Diego Ramirez", "IBJJF World Masters", "Black / Master 2", 2022, "Gold"],
    ["Hiroshi Tanaka", "JJWL Asia Open", "Brown / Leve", 2023, "Gold"],
    ["Amira Haddad", "UAEJJF National", "Blue / Pena", 2023, "Silver"],
    ["Thiago Souza", "IBJJF No-Gi Worlds", "Black / Médio", 2022, "Bronze"],
  ];
  for (const [name, comp, div, year, place] of castResults) {
    const p = profiles.find((x) => x.full_name === name);
    if (p) results.push(r(p.id, comp, div, year, place, 0));
  }

  const links: DemoRow[] = [
    l(P.lucas, "ibjjf", "https://ibjjf.com/"),
    l(P.lucas, "flograppling", "https://www.flograppling.com/"),
    l(P.lucas, "instagram", "https://www.instagram.com/"),
    l(P.kaynan, "ibjjf", "https://ibjjf.com/"),
    l(P.kaynan, "bjjheroes", "https://www.bjjheroes.com/"),
    l(P.kaynan, "instagram", "https://www.instagram.com/"),
    l(P.felipe, "ibjjf", "https://ibjjf.com/"),
    l(P.felipe, "bjjheroes", "https://www.bjjheroes.com/"),
    l(P.felipe, "youtube", "https://www.youtube.com/"),
  ];

  const idOf = (name: string) =>
    profiles.find((x) => x.full_name === name)?.id ?? "";
  const mateus = idOf("Mateus Oliveira");
  const sofia = idOf("Sofia Martins");

  const references: DemoRow[] = [
    ref(P.lucas, "André Galvão", "Head professor, Atos Jiu-Jitsu", "Coached Lucas through his competition career. Happy to speak to any gym considering him."),
    ref(P.lucas, "Marcus Almeida", "Training partner", "Trained together for six years — one of the most consistent people in the room."),
    ref(P.kaynan, "André Galvão", "Head professor, Atos Jiu-Jitsu", "Came up through our competition programme from teenager to world champion."),
    ref(P.felipe, "Ricardo Vieira", "Head professor", "Twenty years of history. Vouches for him without reservation."),
    ref(P.felipe, "Leandro Costa", "Gym owner, Rio de Janeiro", "Ran our competition class for three seasons — attendance doubled."),
    // The two profiles awaiting review — an admin needs something to weigh up.
    ref(mateus, "Leo Vieira", "Head professor, Checkmat", "Trained and promoted him. Reliable, and very good with beginners."),
    ref(mateus, "Paula Nunes", "Parent, kids programme", "My two children have trained with him for four years. He is the reason they stayed."),
    ref(sofia, "Rodrigo Cavaca", "Head professor, Icon BJJ", "Sofia has run our beginners programme for two years. Excellent with new starters."),
  ];

  const referenceContacts: DemoRow[] = references.map((x) => ({
    reference_id: x.id,
    contact: "+55 11 99999-0000 (demo placeholder)",
  }));

  // Docs belong to the profiles in the verification queue (plus one verified
  // athlete, so an admin can see what an approved file set looked like).
  const docs: DemoRow[] = [
    doc(mateus, "Black belt certificate", "/demo-docs/belt-certificate.svg"),
    doc(mateus, "Photo ID", "/demo-docs/photo-id.svg"),
    doc(sofia, "Photo ID", "/demo-docs/photo-id.svg"),
    doc(P.felipe, "Black belt certificate", "/demo-docs/belt-certificate.svg"),
    doc(P.lucas, "Black belt certificate", "/demo-docs/belt-certificate.svg"),
  ];

  const contacts: DemoRow[] = [
    contact(P.lucas, "+5511999990001", "lucas@demo.matlink.app"),
    contact(P.kaynan, "+5511999990002", "kaynan@demo.matlink.app"),
    contact(P.felipe, "+5511999990003", "felipe@demo.matlink.app"),
  ];
  for (const p of profiles) {
    if (contacts.some((c) => c.profile_id === p.id)) continue;
    const handle = String(p.full_name).toLowerCase().split(" ")[0];
    contacts.push(contact(p.id, "+5511999990000", `${handle}@demo.matlink.app`));
  }

  const users: DemoRow[] = [
    { id: DEMO_USER_IDS.lucas, email: "lucas@demo.matlink.app", role: "athlete", created_at: daysAgo(2) },
    { id: DEMO_USER_IDS.kaynan, email: "kaynan@demo.matlink.app", role: "athlete", created_at: daysAgo(4) },
    { id: DEMO_USER_IDS.felipe, email: "felipe@demo.matlink.app", role: "athlete", created_at: daysAgo(6) },
    { id: DEMO_USER_IDS.gym, email: "apex@demo.matlink.app", role: "gym", created_at: daysAgo(14) },
    { id: DEMO_USER_IDS.admin, email: "admin@demo.matlink.app", role: "admin", created_at: daysAgo(90) },
  ];
  for (const p of profiles) {
    if (users.some((u) => u.id === p.user_id)) continue;
    const handle = String(p.full_name).toLowerCase().split(" ")[0];
    users.push({
      id: p.user_id,
      email: `${handle}@demo.matlink.app`,
      role: "athlete",
      created_at: p.created_at,
    });
  }
  // A few gym accounts so the admin stats aren't all athletes.
  for (const [i, name] of ["northside", "apexdubai", "sfgrappling"].entries()) {
    users.push({
      id: rowId("0f0a"),
      email: `${name}@demo.matlink.app`,
      role: "gym",
      created_at: daysAgo(i * 3 + 1),
    });
  }

  const gymProfiles: DemoRow[] = [
    {
      id: rowId("0g01"),
      user_id: DEMO_USER_IDS.gym,
      gym_name: "Apex BJJ Dubai",
      location_country: "United Arab Emirates",
      location_city: "Dubai",
      website: "https://example.com",
      looking_for:
        "Head coach for our competition team. Full-time, visa sponsored, housing included. We have 240 active members and want to be putting people on the podium at the Abu Dhabi Grand Slam within two years.",
      created_at: daysAgo(14),
      updated_at: daysAgo(4),
    },
  ];

  return {
    users,
    athlete_profiles: profiles,
    athlete_contacts: contacts,
    athlete_results: results,
    athlete_links: links,
    athlete_references: references,
    athlete_reference_contacts: referenceContacts,
    verification_docs: docs,
    verification_evidence: [],
    contact_unlocks: [],
    gym_profiles: gymProfiles,
  };
}

// ---------------------------------------------------------------- row builders

function r(
  profile_id: string,
  competition: string,
  division: string | null,
  year: number,
  placement: string,
  sort_order: number,
): DemoRow {
  return {
    id: rowId("0a01"),
    profile_id,
    competition,
    division,
    year,
    placement,
    sort_order,
    created_at: daysAgo(30),
  };
}

function l(profile_id: string, type: string, url: string): DemoRow {
  return { id: rowId("0b01"), profile_id, type, url, created_at: daysAgo(30) };
}

function ref(
  profile_id: string,
  name: string,
  relationship: string,
  note: string,
): DemoRow {
  return {
    id: rowId("0c01"),
    profile_id,
    name,
    relationship,
    note,
    created_at: daysAgo(30),
  };
}

function doc(profile_id: string, doc_type: string, file_url: string): DemoRow {
  return {
    id: rowId("0d0d"),
    profile_id,
    doc_type,
    file_url,
    created_at: daysAgo(6),
  };
}

function contact(
  profile_id: string,
  whatsapp_e164: string,
  public_email: string,
): DemoRow {
  return { profile_id, whatsapp_e164, public_email };
}
