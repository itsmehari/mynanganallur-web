export default function PropertiesLoading() {
  return (
    <div className="mx-auto max-w-[1280px] animate-pulse px-4 py-10 sm:px-6">
      <div className="h-4 w-32 rounded bg-[var(--border)]" />
      <div className="mt-6 h-8 w-64 max-w-full rounded bg-[var(--border)]" />
      <div className="mt-4 h-16 max-w-2xl rounded-2xl bg-[var(--border)]" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[72px] rounded-2xl bg-[var(--border)]" />
        ))}
      </div>
    </div>
  );
}
