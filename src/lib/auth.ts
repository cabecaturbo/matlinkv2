import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Role = Database["public"]["Enums"]["user_role"];

/** Current authenticated user + their app role, or null if signed out. */
export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { user, role: (data?.role ?? null) as Role | null };
}

/**
 * Require a signed-in user who has chosen a role.
 * No session → /login. Signed in but no role yet → /role (the post-auth choice).
 */
export async function requireUser() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (!session.role) redirect("/role");
  return session as { user: NonNullable<typeof session.user>; role: Role };
}

/** Require an admin; redirect non-admins to their dashboard. */
export async function requireAdmin() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (!session.role) redirect("/role");
  if (session.role !== "admin") redirect("/dashboard");
  return session;
}

/** Require an athlete; redirect others appropriately. */
export async function requireAthlete() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (!session.role) redirect("/role");
  if (session.role !== "athlete") redirect("/dashboard");
  return session;
}

/** Require a gym; redirect others appropriately. */
export async function requireGym() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (!session.role) redirect("/role");
  if (session.role !== "gym") redirect("/dashboard");
  return session;
}
