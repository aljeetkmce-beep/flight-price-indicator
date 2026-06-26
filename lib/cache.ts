// TODO: Implement flight search caching using Supabase/PostgreSQL for production use.
// The SQLite-based cache (CachedFlight model) has been removed to support Vercel deployment.
// Re-export searchFlights directly — callers should import from @/lib/skyscanner instead.
export { searchFlights as cachedSearchFlights } from "@/lib/skyscanner";
