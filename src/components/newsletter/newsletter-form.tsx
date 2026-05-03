"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type Props = {
  source?: string;
  className?: string;
  compact?: boolean;
};

export function NewsletterForm({ source = "footer", className, compact }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    try {
      const r = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await r.json().catch(() => ({}))) as {
        error?: string;
        alreadyConfirmed?: boolean;
      };
      if (!r.ok) {
        setStatus("err");
        setMsg(data.error ?? "Could not subscribe.");
        return;
      }
      setStatus("ok");
      track("newsletter_signup", { source });
      setMsg(
        data.alreadyConfirmed
          ? "You're already subscribed — thanks!"
          : "Check your inbox to confirm.",
      );
      setEmail("");
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-2 ${compact ? "" : "sm:flex-row"} ${className ?? ""}`}
    >
      <label htmlFor={`nl-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`nl-${source}`}
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {msg ? (
        <p
          className={`text-xs ${status === "err" ? "text-red-600" : "text-emerald-700"}`}
        >
          {msg}
        </p>
      ) : null}
    </form>
  );
}
