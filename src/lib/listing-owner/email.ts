const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendOwnerLoginOtp(opts: {
  to: string;
  code: string;
  phoneDisplay: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ?? "mynanganallur.in <hello@mynanganallur.in>";
  const subject = "Your mynanganallur.in login code";
  const html = `
    <p>Use this code to sign in to manage your business listings on mynanganallur.in.</p>
    <p style="font-size:28px;font-weight:bold;letter-spacing:4px">${escapeHtml(opts.code)}</p>
    <p>Login pair: <strong>${escapeHtml(opts.to)}</strong> + <strong>${escapeHtml(opts.phoneDisplay)}</strong></p>
    <p>This code expires in 10 minutes. If you did not request it, ignore this email.</p>
    <p>— Team mynanganallur.in</p>
  `;

  if (!apiKey) {
    console.info("[listing-owner:otp]", subject, "→", opts.to, "code:", opts.code);
    return;
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: opts.to, subject, html }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.warn("[listing-owner:otp] send failed", res.status, text);
  }
}
