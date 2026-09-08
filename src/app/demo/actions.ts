"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { DEMO_ROLE_COOKIE, isDemoView } from "@/lib/demo/mode";
import { resetDemoStore } from "@/lib/demo/db";

/** Switch which role the visitor is browsing the product as. */
export async function setDemoView(formData: FormData) {
  const view = String(formData.get("view") ?? "");
  if (!isDemoView(view)) return;

  const store = await cookies();
  store.set(DEMO_ROLE_COOKIE, view, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}

/** Put the demo data back the way it started, after clicking around in it. */
export async function resetDemo() {
  resetDemoStore();
  revalidatePath("/", "layout");
}
