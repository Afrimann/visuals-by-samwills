export default function VideoEditLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-28 bg-smoke/20 rounded mb-8" />

      {/* Title */}
      <div className="h-8 w-48 bg-smoke/20 rounded-sm mb-8" />

      {/* Form fields */}
      <div className="flex flex-col gap-6">
        {/* Thumbnail preview */}
        <div className="aspect-video w-full bg-charcoal border border-smoke/20 rounded-sm" />

        {/* Field rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-3 w-24 bg-smoke/20 rounded" />
            <div className="h-10 w-full bg-charcoal border border-smoke/20 rounded-sm" />
          </div>
        ))}

        {/* Bottom row: status + featured + sort */}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-16 bg-smoke/20 rounded" />
              <div className="h-10 bg-charcoal border border-smoke/20 rounded-sm" />
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-32 bg-smoke/20 rounded-sm" />
          <div className="h-10 w-24 bg-smoke/10 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
