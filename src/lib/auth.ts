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
    .single();

  return { user, role: (data?.role ?? null) as Role | null };
}

/** Require any signed-in user; redirect to /login otherwise. */
export async function requireUser() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  return session;
}

/** Require an admin; redirect non-admins to their dashboard. */
export async function requireAdmin() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/dashboard");
  return session;
}

/** Require an athlete; redirect others to their dashboard. */
export async function requireAthlete() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role !== "athlete") redirect("/dashboard");
  return session;
}

/** Require a gym; redirect others to their dashboard. */
export async function requireGym() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role !== "gym") redirect("/dashboard");
  return session;
}
