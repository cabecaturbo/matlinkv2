"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string } | undefined;

async function siteOrigin() {
  return (await headers()).get("origin") ?? "";
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const msg = (error.message ?? "").toLowerCase();
    if (msg.includes("confirm")) {
      return {
        error:
          "Your email isn't confirmed yet — check your inbox, or use the magic-link option below.",
      };
    }
    return {
      error: "That email and password don't match. Try again, or reset your password.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email) return { error: "Enter your email." };
  if (password.length < 8) {
    return { error: "Use a password of at least 8 characters." };
  }

  const supabase = await createClient();
  const origin = await siteOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm?next=/role` },
  });

  if (error) {
    if ((error.message ?? "").toLowerCase().includes("already")) {
      return { error: "You already have an account — sign in instead." };
    }
    return { error: error.message };
  }
  // Supabase obscures an existing email (no error) by returning empty identities.
  if (data.user?.identities && data.user.identities.length === 0) {
    return { error: "You already have an account — sign in instead." };
  }

  if (!data.session) {
    return {
      notice:
        "Check your email to confirm your account — then you're in. No email? Use the magic link on the sign-in page.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/role");
}

export async function signInWithMagicLink(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email and we'll send a link." };

  const supabase = await createClient();
  const origin = await siteOrigin();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
      shouldCreateUser: true,
    },
  });
  if (error) return { error: error.message };

  return {
    notice:
      "Check your email for a one-tap sign-in link. It works on your phone too — no password needed.",
  };
}

export async function chooseRole(
  role: "athlete" | "gym",
): Promise<{ error?: string }> {
  if (role !== "athlete" && role !== "gym") {
    return { error: "Pick one to continue." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: row } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!row?.role) {
    const { error } = await supabase.from("users").update({ role }).eq("id", user.id);
    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(role === "gym" ? "/athletes" : "/onboarding");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email." };

  const supabase = await createClient();
  const origin = await siteOrigin();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  return {
    notice:
      "If that email has an account, we've sent a reset link. Check your inbox.",
  };
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { error: "Use a password of at least 8 characters." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your reset link has expired. Request a new one." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
