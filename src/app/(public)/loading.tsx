export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-[1280px] animate-pulse px-4 py-14">
      <div className="h-3 w-24 rounded bg-[var(--surface)]" />
      <div className="mt-3 h-9 w-2/3 rounded bg-[var(--surface)]" />
      <div className="mt-4 h-4 w-1/2 rounded bg-[var(--surface)]" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-[var(--surface)]" />
        ))}
      </div>
    </div>
  );
}
