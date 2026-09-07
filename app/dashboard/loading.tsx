export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="h-7 w-44 rounded-lg bg-white/10" />
        <div className="h-9 w-28 rounded-xl bg-white/10" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-black-200 border border-white/10"
          >
            <div className="size-11 shrink-0 rounded-xl bg-white/10" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-3.5 w-2/5 rounded bg-white/10" />
              <div className="h-3 w-3/5 rounded bg-white/5" />
            </div>
            <div className="h-7 w-16 rounded-lg bg-white/10" />
            <div className="h-7 w-16 rounded-lg bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}