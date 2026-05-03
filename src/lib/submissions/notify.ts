/**
 * Resend transactional emails for submission flow.
 *
 * Falls back to console.info in dev / when RESEND_API_KEY is not set so flows
 * keep working without an API key. Uses a hand-rolled fetch (no SDK) to keep
 * cold-start fast on Vercel.
 */
const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SubmissionMeta = {
  entityType: "job" | "event" | "business" | "property";
  title: string;
  submitterName?: string | null;
  submitterEmail?: string | null;
  submitterPhone?: string | null;
  adminUrl: string;
  publicPreviewUrl?: string;
};

async function sendEmail(payload: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "mynanganallur.in <hello@mynanganallur.in>";

  if (!apiKey) {
    console.info("[email:dev]", payload.subject, "→", payload.to);
    return;
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, ...payload }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.warn("[email] send failed", res.status, text);
  }
}

const ENTITY_LABELS: Record<SubmissionMeta["entityType"], string> = {
  job: "job",
  event: "event",
  business: "business listing",
  property: "property listing",
};

export async function notifyAdminOfSubmission(meta: SubmissionMeta) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) {
    console.info("[email] no ADMIN_NOTIFY_EMAIL set — skipping admin alert");
    return;
  }
  const label = ENTITY_LABELS[meta.entityType];
  await sendEmail({
    to: adminEmail,
    subject: `New ${label} submitted: ${meta.title}`,
    html: `
      <p>A new ${label} was just submitted on mynanganallur.in.</p>
      <p><strong>${escapeHtml(meta.title)}</strong></p>
      <ul>
        ${meta.submitterName ? `<li>From: ${escapeHtml(meta.submitterName)}</li>` : ""}
        ${meta.submitterPhone ? `<li>Phone: ${escapeHtml(meta.submitterPhone)}</li>` : ""}
        ${meta.submitterEmail ? `<li>Email: ${escapeHtml(meta.submitterEmail)}</li>` : ""}
      </ul>
      <p><a href="${meta.adminUrl}">Review in /admin</a></p>
    `,
  });
}

export async function notifySubmitterOfReceipt(meta: SubmissionMeta) {
  if (!meta.submitterEmail) return;
  const label = ENTITY_LABELS[meta.entityType];
  await sendEmail({
    to: meta.submitterEmail,
    subject: `Thanks — your ${label} is in our queue`,
    html: `
      <p>Hi${meta.submitterName ? " " + escapeHtml(meta.submitterName) : ""},</p>
      <p>Thanks for submitting <strong>${escapeHtml(meta.title)}</strong> to
      mynanganallur.in. We review submissions within 24 hours and will email you
      when it goes live.</p>
      <p>If you spot an error, just reply to this email.</p>
      <p>— Team mynanganallur.in</p>
    `,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
