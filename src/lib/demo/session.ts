import "server-only";
import { cookies } from "next/headers";
import {
  DEMO_DEFAULT_VIEW,
  DEMO_ROLE_COOKIE,
  isDemoView,
  type DemoView,
} from "./mode";
import { DEMO_USER_IDS } from "./data";
import { demoStore, type DemoUser } from "./db";

/** Who the visitor is currently browsing as. Defaults to the gym owner. */
export async function currentDemoView(): Promise<DemoView> {
  const store = await cookies();
  const value = store.get(DEMO_ROLE_COOKIE)?.value;
  return isDemoView(value) ? value : DEMO_DEFAULT_VIEW;
}

const USER_FOR_VIEW: Record<Exclude<DemoView, "guest">, string> = {
  athlete: DEMO_USER_IDS.lucas,
  gym: DEMO_USER_IDS.gym,
  admin: DEMO_USER_IDS.admin,
};

/** The demo user object the Supabase shim reports as signed in. */
export async function demoUser(): Promise<DemoUser> {
  const view = await currentDemoView();
  if (view === "guest") return null;

  const id = USER_FOR_VIEW[view];
  const row = demoStore().users.find((u) => u.id === id);
  return { id, email: String(row?.email ?? "demo@matlink.app") };
}
