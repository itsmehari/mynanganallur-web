import Script from "next/script";

/**
 * Inserts the hCaptcha widget. Renders a small text fallback when no site key
 * is configured so dev/preview submissions still work.
 *
 * The captcha token arrives in FormData as `h-captcha-response` — the server
 * action reads it via `formData.get("h-captcha-response")`.
 */
export function HCaptchaWidget() {
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
  if (!siteKey) {
    return (
      <p className="text-xs text-[var(--muted)]">
        (Captcha disabled in this environment.)
      </p>
    );
  }
  return (
    <>
      <Script src="https://js.hcaptcha.com/1/api.js" async defer />
      <div className="h-captcha" data-sitekey={siteKey} />
    </>
  );
}
