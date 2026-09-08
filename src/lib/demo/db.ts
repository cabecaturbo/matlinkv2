/* eslint-disable @typescript-eslint/no-explicit-any */
// A tiny in-memory stand-in for the Supabase client, covering exactly the
// PostgREST surface this app uses. It exists so the whole product can be
// demoed with no Supabase project, no migrations and no logins.
//
// It is deliberately swapped in at the client seam (lib/supabase/{server,client})
// so that not a single page, action or component had to change. Delete this
// folder and the two `if (DEMO_MODE)` lines to remove demo mode entirely.

import { buildStore, type DemoRow, type DemoStore } from "./data";

// ---------------------------------------------------------------- store

// Survives dev hot-reloads so wizard edits persist while you click around.
const globalStore = globalThis as typeof globalThis & {
  __matlinkDemoStore?: DemoStore;
};

export function demoStore(): DemoStore {
  if (!globalStore.__matlinkDemoStore) {
    globalStore.__matlinkDemoStore = buildStore();
  }
  return globalStore.__matlinkDemoStore;
}

/** Primary key per table (defaults to `id`). */
const PRIMARY_KEY: Record<string, string> = {
  athlete_contacts: "profile_id",
  athlete_reference_contacts: "reference_id",
};

/** Child table -> the column pointing back at the parent row's `id`. */
const EMBED_FK: Record<string, string> = {
  athlete_results: "profile_id",
  athlete_links: "profile_id",
  athlete_references: "profile_id",
  athlete_contacts: "profile_id",
  verification_docs: "profile_id",
  verification_evidence: "profile_id",
};

// ---------------------------------------------------------------- filtering

type Filter =
  | { kind: "cmp"; col: string; op: string; val: any }
  | { kind: "or"; parts: Filter[] };

/** Turn a PostgREST `ilike` pattern (`*foo*` / `%foo%`) into a regex. */
function likeRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  const body = escaped.replace(/\*/g, ".*").replace(/%/g, ".*");
  return new RegExp(`^${body}$`, "i");
}

function matches(row: DemoRow, f: Filter): boolean {
  if (f.kind === "or") return f.parts.some((p) => matches(row, p));

  const v = row[f.col];
  switch (f.op) {
    case "eq":
      return v === f.val;
    case "neq":
      return v !== f.val;
    case "is":
      return v === f.val;
    case "in":
      return Array.isArray(f.val) && f.val.includes(v);
    case "overlaps":
      return (
        Array.isArray(v) &&
        Array.isArray(f.val) &&
        v.some((x) => (f.val as any[]).includes(x))
      );
    case "contains":
      return (
        Array.isArray(v) &&
        Array.isArray(f.val) &&
        (f.val as any[]).every((x) => v.includes(x))
      );
    case "gt":
      return v != null && v > f.val;
    case "gte":
      return v != null && v >= f.val;
    case "lt":
      return v != null && v < f.val;
    case "lte":
      return v != null && v <= f.val;
    case "ilike":
      return typeof v === "string" && likeRegex(String(f.val)).test(v);
    case "like":
      return typeof v === "string" && likeRegex(String(f.val)).test(v);
    default:
      return true;
  }
}

/** Parse `full_name.ilike.*x*,academy.ilike.*x*` into OR parts. */
function parseOr(expr: string): Filter {
  const parts: Filter[] = [];
  for (const clause of expr.split(",")) {
    const [col, op, ...rest] = clause.split(".");
    if (!col || !op) continue;
    parts.push({ kind: "cmp", col, op, val: rest.join(".") });
  }
  return { kind: "or", parts };
}

/** Pull `athlete_results(...)` embeds out of a select string. */
function parseEmbeds(cols: string): string[] {
  const out: string[] = [];
  const re = /([a-z_]+)\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cols)) !== null) {
    if (EMBED_FK[m[1]]) out.push(m[1]);
  }
  return out;
}

// ---------------------------------------------------------------- result

export type DemoResult<T = any> = {
  data: T;
  error: { message: string } | null;
  count: number | null;
  status: number;
};

const ok = <T,>(data: T, count: number | null = null): DemoResult<T> => ({
  data,
  error: null,
  count,
  status: 200,
});

// ---------------------------------------------------------------- builder

type Mode = "select" | "insert" | "update" | "upsert" | "delete";

class DemoQuery<T = any> implements PromiseLike<DemoResult<T>> {
  private filters: Filter[] = [];
  private orders: { col: string; asc: boolean }[] = [];
  private limitN: number | null = null;
  private mode: Mode = "select";
  private payload: any = null;
  private embeds: string[] = [];
  private wantCount = false;
  private headOnly = false;
  private singleMode: "none" | "one" | "maybe" = "none";

  constructor(
    private store: DemoStore,
    private table: string,
  ) {}

  private get rows(): DemoRow[] {
    if (!this.store[this.table]) this.store[this.table] = [];
    return this.store[this.table];
  }

  // -- projection / modifiers ------------------------------------------

  select(cols = "*", opts?: { count?: string; head?: boolean }) {
    this.embeds = parseEmbeds(cols);
    if (opts?.count) this.wantCount = true;
    if (opts?.head) this.headOnly = true;
    return this;
  }

  private cmp(col: string, op: string, val: any) {
    this.filters.push({ kind: "cmp", col, op, val });
    return this;
  }

  eq(col: string, val: any) { return this.cmp(col, "eq", val); }
  neq(col: string, val: any) { return this.cmp(col, "neq", val); }
  is(col: string, val: any) { return this.cmp(col, "is", val); }
  in(col: string, val: any[]) { return this.cmp(col, "in", val); }
  overlaps(col: string, val: any[]) { return this.cmp(col, "overlaps", val); }
  contains(col: string, val: any[]) { return this.cmp(col, "contains", val); }
  gt(col: string, val: any) { return this.cmp(col, "gt", val); }
  gte(col: string, val: any) { return this.cmp(col, "gte", val); }
  lt(col: string, val: any) { return this.cmp(col, "lt", val); }
  lte(col: string, val: any) { return this.cmp(col, "lte", val); }
  ilike(col: string, val: string) { return this.cmp(col, "ilike", val); }
  like(col: string, val: string) { return this.cmp(col, "like", val); }

  or(expr: string) {
    this.filters.push(parseOr(expr));
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this.orders.push({ col, asc: opts?.ascending !== false });
    return this;
  }

  limit(n: number) {
    this.limitN = n;
    return this;
  }

  range(from: number, to: number) {
    this.limitN = to - from + 1;
    return this;
  }

  // -- writes -----------------------------------------------------------

  insert(payload: any) {
    this.mode = "insert";
    this.payload = payload;
    return this;
  }

  upsert(payload: any) {
    this.mode = "upsert";
    this.payload = payload;
    return this;
  }

  update(payload: any) {
    this.mode = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.mode = "delete";
    return this;
  }

  // -- terminators ------------------------------------------------------

  single() {
    this.singleMode = "one";
    return this;
  }

  maybeSingle() {
    this.singleMode = "maybe";
    return this;
  }

  throwOnError() {
    return this;
  }

  then<R1 = DemoResult<T>, R2 = never>(
    onfulfilled?: ((v: DemoResult<T>) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((r: unknown) => R2 | PromiseLike<R2>) | null,
  ): PromiseLike<R1 | R2> {
    return Promise.resolve(this.run()).then(onfulfilled, onrejected);
  }

  // -- execution --------------------------------------------------------

  private filtered(): DemoRow[] {
    return this.rows.filter((r) => this.filters.every((f) => matches(r, f)));
  }

  private withEmbeds(rows: DemoRow[]): DemoRow[] {
    if (!this.embeds.length) return rows.map((r) => ({ ...r }));
    return rows.map((r) => {
      const copy: DemoRow = { ...r };
      for (const child of this.embeds) {
        const fk = EMBED_FK[child];
        copy[child] = (this.store[child] ?? [])
          .filter((c) => c[fk] === r.id)
          .map((c) => ({ ...c }));
      }
      return copy;
    });
  }

  private defaults(row: DemoRow): DemoRow {
    const now = new Date().toISOString();
    const out = { ...row };
    if (PRIMARY_KEY[this.table] === undefined && out.id === undefined) {
      out.id = crypto.randomUUID();
    }
    if (out.created_at === undefined) out.created_at = now;
    if (out.updated_at === undefined) out.updated_at = now;
    return out;
  }

  private run(): DemoResult<any> {
    switch (this.mode) {
      case "insert":
      case "upsert": {
        const incoming = (
          Array.isArray(this.payload) ? this.payload : [this.payload]
        ).map((r) => this.defaults(r));
        const pk = PRIMARY_KEY[this.table] ?? "id";
        for (const row of incoming) {
          const at = this.rows.findIndex((r) => r[pk] === row[pk]);
          if (at >= 0 && this.mode === "upsert") {
            this.rows[at] = { ...this.rows[at], ...row };
          } else {
            this.rows.push(row);
          }
        }
        const result = incoming.map((r) => ({ ...r }));
        if (this.singleMode !== "none") return ok(result[0] ?? null);
        return ok(result);
      }

      case "update": {
        const now = new Date().toISOString();
        const hit = this.filtered();
        for (const row of hit) Object.assign(row, this.payload, { updated_at: now });
        const result = hit.map((r) => ({ ...r }));
        if (this.singleMode !== "none") return ok(result[0] ?? null);
        return ok(result);
      }

      case "delete": {
        const doomed = new Set(this.filtered());
        this.store[this.table] = this.rows.filter((r) => !doomed.has(r));
        return ok([]);
      }

      default: {
        let rows = this.filtered();

        for (const { col, asc } of [...this.orders].reverse()) {
          rows = [...rows].sort((a, b) => {
            const x = a[col];
            const y = b[col];
            if (x === y) return 0;
            if (x == null) return 1;
            if (y == null) return -1;
            return (x > y ? 1 : -1) * (asc ? 1 : -1);
          });
        }

        const total = rows.length;
        if (this.limitN != null) rows = rows.slice(0, this.limitN);

        if (this.headOnly) return ok(null, total);

        const data = this.withEmbeds(rows);
        if (this.singleMode === "one") {
          return data.length === 1
            ? ok(data[0], this.wantCount ? total : null)
            : {
                data: null,
                error: {
                  message: "JSON object requested, multiple (or no) rows returned",
                },
                count: null,
                status: 406,
              };
        }
        if (this.singleMode === "maybe") {
          return ok(data[0] ?? null, this.wantCount ? total : null);
        }
        return ok(data, this.wantCount ? total : null);
      }
    }
  }
}

// ---------------------------------------------------------------- client

export type DemoUser = { id: string; email: string } | null;

const notInDemo = { message: "Not available in demo mode." };

/**
 * A Supabase-shaped client backed by the in-memory demo store.
 * `user` is whoever the visitor is currently "viewing as".
 */
export function createDemoClient(user: DemoUser) {
  const store = demoStore();

  return {
    from: (table: string) => new DemoQuery(store, table),

    auth: {
      getUser: async () => ({ data: { user }, error: null }),
      getSession: async () => ({
        data: { session: user ? { user } : null },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({ data: {}, error: notInDemo }),
      signInWithOtp: async () => ({ data: {}, error: notInDemo }),
      signInWithOAuth: async () => ({ data: {}, error: notInDemo }),
      signUp: async () => ({ data: { user: null, session: null }, error: notInDemo }),
      updateUser: async () => ({ data: { user }, error: notInDemo }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
      verifyOtp: async () => ({ data: {}, error: notInDemo }),
      exchangeCodeForSession: async () => ({ data: {}, error: notInDemo }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },

    storage: {
      from: () => ({
        // Demo docs are plain files under /public, so the "signed" URL is the path.
        createSignedUrl: async (path: string) => ({
          data: { signedUrl: path },
          error: null,
        }),
        // The wizard hands us a data: URL it built in the browser — just echo it.
        upload: async (path: string) => ({ data: { path }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
        remove: async () => ({ data: [], error: null }),
      }),
    },
  };
}

export type DemoClient = ReturnType<typeof createDemoClient>;

/** Throw away any edits made during the demo and rebuild the seed dataset. */
export function resetDemoStore() {
  globalStore.__matlinkDemoStore = buildStore();
}
