"use client";

import { useState } from "react";
import { revalidatePublicContentAction } from "./actions";

export function RevalidatePublicButton() {
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mt-2">
      <button
        type="button"
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        onClick={async () => {
          setMsg(null);
          const r = await revalidatePublicContentAction();
          setMsg(r.ok ? "Layout cache refreshed." : r.error);
        }}
      >
        Revalidate public pages
      </button>
      {msg ? (
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{msg}</p>
      ) : null}
    </div>
  );
}
