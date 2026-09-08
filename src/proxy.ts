import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { DEMO_MODE } from "@/lib/demo/mode";

// Next.js 16 "proxy" convention (formerly middleware): refreshes the Supabase
// session and enforces auth-based route protection on every request.
export async function proxy(request: NextRequest) {
  // Demo mode: no sessions to refresh and no routes to gate — the visitor
  // picks which role they are viewing as from the demo bar.
  if (DEMO_MODE) return NextResponse.next({ request });

  return await updateSession(request);
}

export const config = {
  // Run on all routes except static assets and image files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
