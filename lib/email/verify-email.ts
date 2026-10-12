/**
 * Verification email sender with safe fallback.
 *
 * When RESEND_API_KEY is set: sends via Resend.
 * When it isn't: logs to console (dev-friendly) and returns success.
 * When Resend isn't installed: falls back to console mode.
 *
 * Upgrade: npm i resend
 */

export interface SendVerificationEmailParams {
  userId?: string;
  email?: string;
  to?: string;
  name?: string;
  verificationUrl?: string;
  expiresInHours?: number;
}

export interface SendVerificationEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  /** True if we fell back to console logging */
  fallback?: boolean;
}

const FROM_ADDRESS =
  process.env.EMAIL_FROM ?? "TradeOps <noreply@tradeops.local>";

export async function sendVerificationEmail(
  params: SendVerificationEmailParams
): Promise<SendVerificationEmailResult> {
  const { to, name, verificationUrl, expiresInHours = 24 } = params;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev fallback — log the link
    console.log(
      `\n[verify-email] → ${to}${name ? ` (${name})` : ""}\n` +
        `  link: ${verificationUrl}\n` +
        `  expires: ${expiresInHours}h\n`
    );
    return { success: true, fallback: true };
  }

  try {
    const mod = await import("resend");
    const Resend = (mod as any).Resend;
    if (!Resend) {
      console.warn("[verify-email] resend package not found — falling back");
      console.log(`[verify-email] link for ${to}: ${verificationUrl}`);
      return { success: true, fallback: true };
    }

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "Verify your TradeOps email",
      text: [
        `Hi${name ? ` ${name}` : ""},`,
        "",
        "Confirm your email address to activate your TradeOps account:",
        verificationUrl,
        "",
        `This link expires in ${expiresInHours} hours.`,
        "",
        "If you didn't sign up, ignore this email.",
      ].join("\n"),
      html: renderVerifyEmailHtml({ name, verificationUrl, expiresInHours }),
    });

    return { success: true, id: result?.data?.id };
  } catch (err) {
    console.error("[verify-email] send failed", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function renderVerifyEmailHtml({
  name,
  verificationUrl,
  expiresInHours,
}: {
  name?: string;
  verificationUrl: string;
  expiresInHours: number;
}): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif; background:#fafafa; padding:32px; color:#18181b;">
  <div style="max-width:520px; margin:0 auto; background:#fff; border-radius:12px; padding:32px; border:1px solid #e4e4e7;">
    <h1 style="font-size:20px; margin:0 0 16px 0;">Verify your email</h1>
    <p style="font-size:14px; line-height:1.6; color:#52525b; margin:0 0 24px 0;">
      Hi${name ? ` ${name}` : ""} — confirm your email address to activate your TradeOps account.
    </p>
    <a href="${verificationUrl}" style="display:inline-block; background:#10b981; color:#04120c; font-weight:600; padding:12px 20px; border-radius:8px; text-decoration:none;">
      Verify email
    </a>
    <p style="font-size:12px; color:#71717a; margin:24px 0 0 0;">
      This link expires in ${expiresInHours} hours.<br>
      Or paste this URL into your browser:<br>
      <span style="font-family: ui-monospace, monospace; word-break: break-all;">${verificationUrl}</span>
    </p>
  </div>
</body>
</html>`;
}
