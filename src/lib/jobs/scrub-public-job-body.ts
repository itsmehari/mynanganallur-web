/**
 * Strip legacy WhatsApp phone lines from stored job markdown so the public page
 * can stay "apply via button / internal link" even if an old DB row still has digits.
 */
export function scrubPublicJobBody(body: string): string {
  let t = body;
  t = t.replace(
    /\r?\n- \*\*WhatsApp:\*\*\s*\[\+?91[\d\s]+\]\([^)]*\)/gi,
    "",
  );
  t = t.replace(/\r?\n- \*\*WhatsApp:\*\*\s*\+?91[\d\s-–—]{8,}/gi, "");
  t = t.replace(/\+91\s*72001\s*01497/gi, "");
  t = t.replace(/\b7200101497\b/g, "");
  t = t.replace(/https?:\/\/wa\.me\/917200101497\b/gi, "");
  return t.replace(/\n{3,}/g, "\n\n").trimEnd();
}
