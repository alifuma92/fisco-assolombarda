export function LoadingSkeleton() {
  return (
    <div>
      {/* AI Response section skeleton */}
      <div className="mb-10">
        {/* Response card */}
        <div className="glass-strong rounded-2xl border border-white/30 p-8">
          <div className="flex items-center gap-1.5 mb-4">
            <div className="animate-shimmer h-3 w-3 rounded" />
            <div className="animate-shimmer h-3 w-20 rounded" />
          </div>
          <div className="space-y-4">
            <div className="animate-shimmer h-6 w-48 rounded-lg" />
            <div className="space-y-2.5">
              <div className="animate-shimmer h-4 w-full rounded" />
              <div className="animate-shimmer h-4 w-full rounded" />
              <div className="animate-shimmer h-4 w-5/6 rounded" />
              <div className="animate-shimmer h-4 w-full rounded" />
              <div className="animate-shimmer h-4 w-3/4 rounded" />
            </div>
            <div className="animate-shimmer h-6 w-40 rounded-lg mt-6" />
            <div className="space-y-2.5">
              <div className="animate-shimmer h-4 w-full rounded" />
              <div className="animate-shimmer h-4 w-full rounded" />
              <div className="animate-shimmer h-4 w-2/3 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Sources section skeleton — two columns */}
      <div>
        {/* Centered divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-border/20" />
          <div className="animate-shimmer h-3 w-28 rounded" />
          <div className="h-px flex-1 bg-border/20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Articles column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="animate-shimmer h-6 w-6 rounded-lg" />
              <div className="animate-shimmer h-4 w-28 rounded" />
              <div className="animate-shimmer h-5 w-6 rounded-md" />
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="glass-subtle rounded-xl border border-white/30"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between">
                      <div className="animate-shimmer h-7 w-20 rounded-lg" />
                      <div className="animate-shimmer h-7 w-16 rounded-lg" />
                    </div>
                    <div className="animate-shimmer h-5 w-44 rounded" />
                    <div className="animate-shimmer h-4 w-full rounded" />
                    <div className="flex gap-1.5">
                      <div className="animate-shimmer h-6 w-16 rounded-full" />
                      <div className="animate-shimmer h-6 w-14 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interpelli column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="animate-shimmer h-6 w-6 rounded-lg" />
              <div className="animate-shimmer h-4 w-24 rounded" />
              <div className="animate-shimmer h-5 w-6 rounded-md" />
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={`ip-${i}`}
                  className="glass-subtle rounded-xl border border-white/30"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <div className="animate-shimmer h-7 w-20 rounded-lg" />
                        <div className="animate-shimmer h-7 w-16 rounded-full" />
                      </div>
                      <div className="animate-shimmer h-7 w-16 rounded-lg" />
                    </div>
                    <div className="animate-shimmer h-5 w-40 rounded" />
                    <div className="animate-shimmer h-4 w-24 rounded" />
                    <div className="animate-shimmer h-10 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
