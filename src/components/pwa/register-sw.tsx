"use client";

import { useEffect } from "react";
import { isFlagOn } from "@/lib/flags";

export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (!isFlagOn("pwa")) return;
    if (process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* swallow — non-critical */
    });
  }, []);
  return null;
}
