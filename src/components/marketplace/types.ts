export type Filters = {
  q: string;
  sort: string;
  verified: boolean;
  belt: string[];
  country: string;
  roles: string[];
  focus: string[];
  region: string[];
  lang: string[];
  avail: string[];
  reloc: boolean;
  visa: boolean;
  minYears: number;
};

export function buildQuery(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.sort && f.sort !== "verified") p.set("sort", f.sort);
  if (f.verified) p.set("verified", "1");
  if (f.belt.length) p.set("belt", f.belt.join(","));
  if (f.country) p.set("country", f.country);
  if (f.roles.length) p.set("roles", f.roles.join(","));
  if (f.focus.length) p.set("focus", f.focus.join(","));
  if (f.region.length) p.set("region", f.region.join(","));
  if (f.lang.length) p.set("lang", f.lang.join(","));
  if (f.avail.length) p.set("avail", f.avail.join(","));
  if (f.reloc) p.set("reloc", "1");
  if (f.visa) p.set("visa", "1");
  if (f.minYears > 0) p.set("minyears", String(f.minYears));
  return p.toString();
}

export function activeFilterCount(f: Filters): number {
  return (
    f.belt.length +
    f.roles.length +
    f.focus.length +
    f.region.length +
    f.lang.length +
    f.avail.length +
    (f.verified ? 1 : 0) +
    (f.country ? 1 : 0) +
    (f.reloc ? 1 : 0) +
    (f.visa ? 1 : 0) +
    (f.minYears > 0 ? 1 : 0)
  );
}
