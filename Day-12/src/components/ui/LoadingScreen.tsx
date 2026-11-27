export function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f7f8fc]" role="status" aria-label="Loading dashboard">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="size-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
        Loading your workspace...
      </div>
    </div>
  )
}
