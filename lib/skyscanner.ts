export interface FlightOption {
  price: number;
  airline: string;
  flightNumbers: string; // "IX539" or "IX539 / FD171" for multi-segment
  stops: number;
  duration: string;      // "9h 30m"
  durationMins: number;  // raw minutes for scoring/filtering
  departureTime: string; // "07:05"
  arrivalTime: string;   // "15:40"
  layoverMins: number;   // 0 for direct; computed from segments for connecting
}

export interface FlightSearchResult {
  lowestPrice: number;
  averagePrice: number;
  currency: string;
  cheapestAirline: string;
  options: FlightOption[];
}

interface RawSegment {
  flight: string;
  from: string;
  to: string;
  dep: string;
  arr: string;
  dur_min: number;
}

interface RawLeg {
  from: string;
  to: string;
  dep: string;
  arr: string;
  dur_min: number;
  stops: number;
  segments: RawSegment[];
}

interface RawResult {
  price_raw: number;
  carriers: string[];
  legs: RawLeg[];
}

interface RawResponse {
  success: boolean;
  currency: string;
  results: RawResult[];
}

function minsToHuman(mins: number): string {
  if (mins <= 0) return "0h 0m";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function fmtTime(iso: string): string {
  const t = iso?.split("T")[1];
  return t ? t.slice(0, 5) : "—";
}

// Total layover = total leg duration minus the sum of all flight segment durations.
// For a direct flight (0 or 1 segment), layover is 0.
function calcLayoverMins(leg: RawLeg): number {
  if (!leg || !leg.segments || leg.segments.length <= 1) return 0;
  const flightMins = leg.segments.reduce((s, seg) => s + (seg.dur_min ?? 0), 0);
  return Math.max(0, (leg.dur_min ?? 0) - flightMins);
}

export async function searchFlights(
  origin: string,
  destination: string,
  date: string
): Promise<FlightSearchResult> {
  const key = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST;

  if (!key || !host) {
    throw new Error("RAPIDAPI_KEY and RAPIDAPI_HOST environment variables are required");
  }

  const qs = new URLSearchParams({ origin, destination, date, adults: "1" });
  const url = `https://${host}/api/v1/search?${qs}`;

  console.log(`[skyscanner] GET ${url}`);

  const res = await fetch(url, {
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": host,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "<unreadable>");
    const hdrs: Record<string, string> = {};
    res.headers.forEach((v, k) => { hdrs[k] = v; });
    console.error(`[skyscanner] HTTP ${res.status} ${res.statusText}`);
    console.error(`[skyscanner] Response headers: ${JSON.stringify(hdrs, null, 2)}`);
    console.error(`[skyscanner] Response body: ${body}`);
    throw new Error(`Skyscanner API HTTP ${res.status}: ${body.slice(0, 300)}`);
  }

  const data: RawResponse = await res.json();

  if (!data.success || !data.results?.length) {
    throw new Error(`No flights found for ${origin} → ${destination} on ${date}`);
  }

  const valid = data.results
    .filter((r): r is RawResult => typeof r.price_raw === "number" && r.price_raw > 0)
    .sort((a, b) => a.price_raw - b.price_raw);

  if (!valid.length) {
    throw new Error("No valid prices in API response");
  }

  const currency = data.currency ?? "USD";
  const prices = valid.map((r) => r.price_raw);
  const lowestPrice = prices[0];
  const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  const options: FlightOption[] = valid.slice(0, 10).map((r) => {
    const leg = r.legs?.[0];
    const durMins = leg?.dur_min ?? 0;
    const flightNumbers =
      leg?.segments
        ?.map((s) => s.flight)
        .filter(Boolean)
        .join(" / ") || "—";
    return {
      price: Math.round(r.price_raw * 100) / 100,
      airline: r.carriers[0] ?? "Unknown",
      flightNumbers,
      stops: leg?.stops ?? 0,
      duration: minsToHuman(durMins),
      durationMins: durMins,
      departureTime: fmtTime(leg?.dep ?? ""),
      arrivalTime: fmtTime(leg?.arr ?? ""),
      layoverMins: calcLayoverMins(leg),
    };
  });

  return {
    lowestPrice: Math.round(lowestPrice * 100) / 100,
    averagePrice: Math.round(averagePrice * 100) / 100,
    currency,
    cheapestAirline: valid[0].carriers[0] ?? "Unknown",
    options,
  };
}
