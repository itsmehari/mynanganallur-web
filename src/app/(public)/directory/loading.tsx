export default function DirectoryLoading() {
  return (
    <div className="mx-auto max-w-[1280px] animate-pulse px-4 py-10 sm:px-6">
      <div className="h-4 w-24 rounded bg-[var(--border)]" />
      <div className="mt-6 h-8 w-80 max-w-full rounded bg-[var(--border)]" />
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[72px] rounded-2xl bg-[var(--border)]" />
        ))}
      </div>
    </div>
  );
}
