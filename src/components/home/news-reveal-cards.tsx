"use client";

import Link from "next/link";
import { useState } from "react";
import type { PublicArticleRow } from "@/domains/news";

function formatDate(d: Date | null) {
  if (!d) return "";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  });
}

export function NewsRevealCard({
  article,
  variant = "bulletin",
}: {
  article: PublicArticleRow;
  variant?: "bulletin" | "pick";
}) {
  const [open, setOpen] = useState(false);
  const href = `/local-news/${article.slug}`;
  const isPick = variant === "pick";

  return (
    <div
      className={`rounded-2xl border transition ${
        isPick
          ? "border-[var(--border)] bg-[var(--foreground)] text-[var(--background)]"
          : "border-[var(--border)] bg-[var(--surface)]"
      } ${open ? "border-[var(--accent)] shadow-md ring-1 ring-[var(--accent)]/20" : ""}`}
    >
      <button
        type="button"
        className="flex w-full flex-col p-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:hidden"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            isPick
              ? "text-[color-mix(in_srgb,var(--background)_70%,transparent)]"
              : "text-[var(--accent)]"
          }`}
        >
          {article.category ?? "Local"}
        </span>
        <span
          className={`mt-2 text-sm font-semibold leading-snug ${
            isPick ? "" : "text-[var(--foreground)]"
          }`}
        >
          {article.title}
        </span>
        <span
          className={`mt-2 text-xs ${
            isPick
              ? "text-[color-mix(in_srgb,var(--background)_65%,transparent)]"
              : "text-[var(--muted)]"
          }`}
        >
          {formatDate(article.publishedAt)} · Tap for deck
        </span>
        {open ? (
          <span className={`mt-3 text-sm ${isPick ? "opacity-90" : "text-[var(--muted)]"}`}>
            {article.dek ?? article.summary ?? ""}
          </span>
        ) : null}
        {open ? (
          <Link
            href={href}
            className={`mt-4 inline-flex text-sm font-semibold ${
              isPick ? "text-[var(--background)] underline" : "text-[var(--accent)]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            Read full story
          </Link>
        ) : null}
      </button>

      <div className="hidden md:block">
        <div
          className="p-5"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              isPick
                ? "text-[color-mix(in_srgb,var(--background)_70%,transparent)]"
                : "text-[var(--accent)]"
            }`}
          >
            {article.category ?? "Local"}
          </span>
          <Link href={href}>
            <h3
              className={`mt-2 text-sm font-semibold leading-snug ${
                isPick ? "" : "text-[var(--foreground)]"
              } hover:underline`}
            >
              {article.title}
            </h3>
          </Link>
          <p
            className={`mt-2 text-xs ${
              isPick
                ? "text-[color-mix(in_srgb,var(--background)_65%,transparent)]"
                : "text-[var(--muted)]"
            }`}
          >
            {formatDate(article.publishedAt)}
          </p>
          <div
            className={`grid transition-all duration-200 ${
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p
                className={`mt-3 text-sm ${
                  isPick ? "opacity-90" : "text-[var(--muted)]"
                }`}
              >
                {article.dek ?? article.summary ?? ""}
              </p>
              <Link
                href={href}
                className={`mt-3 inline-flex text-sm font-semibold ${
                  isPick ? "text-[var(--background)] underline" : "text-[var(--accent)]"
                }`}
              >
                Read full story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsRevealGrid({
  articles,
  variant = "bulletin",
}: {
  articles: PublicArticleRow[];
  variant?: "bulletin" | "pick";
}) {
  if (!articles.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
        No published articles yet. Set{" "}
        <code className="rounded bg-[var(--surface)] px-1">DATABASE_URL</code> and run{" "}
        <code className="rounded bg-[var(--surface)] px-1">npm run db:seed</code>.
      </p>
    );
  }
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {articles.map((a) => (
        <li key={a.id}>
          <NewsRevealCard article={a} variant={variant} />
        </li>
      ))}
    </ul>
  );
}

export function EditorsRevealGrid({ articles }: { articles: PublicArticleRow[] }) {
  if (!articles.length) return null;
  return (
    <ul className="grid gap-4 lg:grid-cols-3">
      {articles.map((a) => (
        <li key={a.id}>
          <NewsRevealCard article={a} variant="pick" />
        </li>
      ))}
    </ul>
  );
}
