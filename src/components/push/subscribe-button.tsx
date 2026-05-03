"use client";

import { useEffect, useState } from "react";
import { isFlagOn } from "@/lib/flags";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export function PushSubscribeButton() {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "subscribing" | "subscribed" | "denied" | "err">(
    "idle",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isFlagOn("push")) return;
    setSupported(
      "serviceWorker" in navigator && "PushManager" in window,
    );
  }, []);

  if (!supported) return null;

  const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapid) return null;

  async function subscribe() {
    setState("subscribing");
    try {
      const reg = await navigator.serviceWorker.ready;
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState("denied");
        return;
      }
      const applicationServerKey = urlBase64ToUint8Array(vapid) as BufferSource;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      const r = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setState(r.ok ? "subscribed" : "err");
    } catch {
      setState("err");
    }
  }

  return (
    <button
      type="button"
      onClick={subscribe}
      disabled={state === "subscribing" || state === "subscribed"}
      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] disabled:opacity-60"
    >
      {state === "subscribed"
        ? "Push notifications on"
        : state === "denied"
          ? "Notifications blocked"
          : state === "err"
            ? "Try again"
            : "Get push alerts"}
    </button>
  );
}
