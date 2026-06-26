// Shared TypeScript types for the Flight Price Indicator
import { AIRPORT_LIST } from "@/lib/airports";

// -------------------------------------------------------
// Airport / Route constants
// -------------------------------------------------------

// Derived from the worldwide airport list in lib/airports.ts.
// Maps IATA code → airport name (e.g. "TRV" → "Trivandrum International")
// so the UI can display "Trivandrum International (TRV)".
export const AIRPORT_NAMES: Record<string, string> = Object.fromEntries(
  AIRPORT_LIST.map((a) => [a.code, a.name])
);

// -------------------------------------------------------
// Trip type
// -------------------------------------------------------

export type TripType = "one_way" | "round_trip";

// -------------------------------------------------------
// Route
// Matches the Prisma Route model
// -------------------------------------------------------

export interface Route {
  id: number;
  origin: string;
  destination: string;
  originCity: string;
  destCity: string;
  active: boolean;
}

// -------------------------------------------------------
// PriceRecord
// Matches the Prisma PriceRecord model
// -------------------------------------------------------

export interface PriceRecord {
  id: number;
  routeId: number;
  price: number;
  currency: string;
  airline: string | null;
  stops: number;
  duration: string | null;
  departDate: Date;
  returnDate: Date | null;
  tripType: TripType;
  fetchedAt: Date;
}

// -------------------------------------------------------
// PriceRecord with route joined (used in dashboard queries)
// -------------------------------------------------------

export interface PriceRecordWithRoute extends PriceRecord {
  route: Route;
}

// -------------------------------------------------------
// FetchLog
// Matches the Prisma FetchLog model
// -------------------------------------------------------

export interface FetchLog {
  id: number;
  startedAt: Date;
  finishedAt: Date | null;
  status: "running" | "success" | "failed";
  message: string | null;
  recordsFetched: number;
}

// -------------------------------------------------------
// API response types
// -------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Used when returning the cheapest price per route
export interface RouteSummary {
  route: Route;
  lowestPrice: number;
  currency: string;
  lastFetched: Date;
  recordCount: number;
}
