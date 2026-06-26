"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950 px-6">
      <p className="text-4xl">⚠️</p>
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="text-sm text-gray-400">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500"
      >
        Try again
      </button>
    </div>
  );
}
