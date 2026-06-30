export default function AdminLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      {/* Page title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-40 bg-smoke/20 rounded-sm mb-2" />
          <div className="h-4 w-20 bg-smoke/10 rounded-sm" />
        </div>
        <div className="h-9 w-24 bg-smoke/20 rounded-sm" />
      </div>

      {/* List rows */}
      <div className="bg-charcoal border border-smoke/20 rounded-sm overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 px-5 py-4 ${i !== 5 ? "border-b border-smoke/20" : ""}`}
          >
            <div className="w-14 aspect-video bg-smoke/20 rounded-sm shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-3/4 bg-smoke/20 rounded" />
              <div className="h-3 w-1/3 bg-smoke/10 rounded" />
            </div>
            <div className="h-7 w-14 bg-smoke/10 rounded-sm shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
