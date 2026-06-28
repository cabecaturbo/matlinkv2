import "server-only";

// Transactional email — abstracted so the provider can be swapped. Uses Resend
// via REST (no SDK dependency). When RESEND_API_KEY is unset it logs a stub, so
// the verification flow works end-to-end in dev without sending real mail.
type Decision = "approved" | "rejected";

const FROM = process.env.RESEND_FROM ?? "MatLink <onboarding@resend.dev>";

export async function sendVerificationEmail(
  to: string | null | undefined,
  decision: Decision,
  reason?: string | null,
) {
  if (!to) return;

  const subject =
    decision === "approved"
      ? "You're verified on MatLink"
      : "Your MatLink profile needs a few changes";

  const text =
    decision === "approved"
      ? "Good news — your credentials were reviewed and your MatLink profile is now Verified. Gyms will see the Verified badge on your profile."
      : `We reviewed your MatLink profile and can't verify it yet.${
          reason ? `\n\nReason: ${reason}` : ""
        }\n\nYou can update your profile and resubmit anytime.`;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email stub] → ${to} | ${subject}`);
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, text }),
    });
  } catch (e) {
    console.error("sendVerificationEmail failed", e);
  }
}
