export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="not-prose space-y-4 py-8"
      data-pagefind-ignore="all"
    >
      <div className="h-8 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  )
}
