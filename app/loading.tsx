function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-gray-700 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      {/* Header skeleton */}
      <div className="border-b border-gray-700 bg-gray-900 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Pulse className="h-8 w-8" />
          <div className="space-y-1.5">
            <Pulse className="h-6 w-52" />
            <Pulse className="h-3.5 w-64" />
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* Form skeleton */}
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
          <Pulse className="mb-4 h-3.5 w-48" />
          {/* Row 1: destination + date + max layover */}
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1.5">
                <Pulse className="h-3 w-28" />
                <Pulse className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
          {/* Row 2: origins */}
          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1.5">
                <Pulse className="h-3 w-24" />
                <Pulse className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <Pulse className="h-10 w-40 rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
