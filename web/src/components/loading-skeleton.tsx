export function LoadingSkeleton() {
  return (
    <div className="mt-6">
      {/* Analysis pills skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="animate-shimmer h-8 w-36 rounded-full" />
        <div className="animate-shimmer h-8 w-24 rounded-full" />
        <div className="animate-shimmer h-8 w-28 rounded-full" />
      </div>

      {/* 2-column layout matching ResultsDisplay */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Left: response card skeleton */}
        <div className="bg-white rounded-2xl border border-border/30 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8">
          <div className="space-y-4">
            <div className="animate-shimmer h-6 w-48 rounded-lg" />
            <div className="space-y-2.5">
              <div className="animate-shimmer h-4 w-full rounded" />
              <div className="animate-shimmer h-4 w-full rounded" />
              <div className="animate-shimmer h-4 w-5/6 rounded" />
              <div className="animate-shimmer h-4 w-full rounded" />
              <div className="animate-shimmer h-4 w-3/4 rounded" />
            </div>
            <div className="animate-shimmer h-6 w-40 rounded-lg mt-8" />
            <div className="space-y-2.5">
              <div className="animate-shimmer h-4 w-full rounded" />
              <div className="animate-shimmer h-4 w-full rounded" />
              <div className="animate-shimmer h-4 w-2/3 rounded" />
            </div>
          </div>
        </div>

        {/* Right: sidebar skeleton */}
        <div className="space-y-6">
          {/* Article cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="animate-shimmer h-5 w-5 rounded-md" />
              <div className="animate-shimmer h-4 w-28 rounded" />
            </div>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-border/40"
              >
                <div className="p-5 space-y-3">
                  <div className="flex justify-between">
                    <div className="animate-shimmer h-7 w-20 rounded-lg" />
                    <div className="animate-shimmer h-7 w-16 rounded-lg" />
                  </div>
                  <div className="animate-shimmer h-5 w-44 rounded" />
                  <div className="animate-shimmer h-4 w-52 rounded" />
                  <div className="flex gap-1.5">
                    <div className="animate-shimmer h-6 w-16 rounded-full" />
                    <div className="animate-shimmer h-6 w-14 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interpello cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="animate-shimmer h-5 w-5 rounded-md" />
              <div className="animate-shimmer h-4 w-24 rounded" />
            </div>
            {[1, 2].map((i) => (
              <div
                key={`ip-${i}`}
                className="bg-white rounded-xl border border-border/40"
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
  );
}
