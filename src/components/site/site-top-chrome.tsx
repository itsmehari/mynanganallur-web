"use client";

import { useEffect, useState } from "react";
import { AlertBar } from "./alert-bar";
import { SiteHeader } from "./site-header";

const SCROLL_HIDE_THRESHOLD = 56;

export function SiteTopChrome() {
  const [alertHidden, setAlertHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setAlertHidden(window.scrollY > SCROLL_HIDE_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-top-chrome sticky top-0 z-[60]">
      <div
        className={`site-alert-shell overflow-hidden transition-[max-height,opacity] duration-300 ease-out motion-reduce:transition-none ${
          alertHidden
            ? "max-h-0 opacity-0 pointer-events-none"
            : "max-h-10 opacity-100"
        }`}
        aria-hidden={alertHidden}
      >
        <AlertBar />
      </div>
      <SiteHeader />
    </div>
  );
}
