import { NextRequest, NextResponse } from "next/server";
import { searchFlights } from "@/lib/skyscanner";
import { getUsdToInr } from "@/lib/exchange";
import { AIRPORT_NAMES } from "@/types";

export interface FlightRow {
  origin: string;
  destination: string;
  originCity: string;
  destCity: string;
  date: string;
  airline: string;
  flightNumbers: string;
  priceINR: number;
  stops: number;
  duration: string;
  durationMins: number;
  departureTime: string;
  arrivalTime: string;
  layoverMins: number;
}

function offsetDate(base: string, days: number): string {
  const d = new Date(base + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}

// Composite score: lower = better.
// Weights: Price 40%, Duration 30%, Stops 20%, Layover 10%.
function scoreRow(
  row: FlightRow,
  maxPrice: number,
  maxDurationMins: number,
  maxLayoverMins: number
): number {
  const priceScore = maxPrice > 0 ? row.priceINR / maxPrice : 0;
  const durScore = maxDurationMins > 0 ? row.durationMins / maxDurationMins : 0;
  const stopsScore = Math.min(row.stops / 3, 1);
  const layoverScore = maxLayoverMins > 0 ? row.layoverMins / maxLayoverMins : 0;
  return priceScore * 0.4 + durScore * 0.3 + stopsScore * 0.2 + layoverScore * 0.1;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const originsParam = searchParams.get("origins") ?? "";
  const destination = (searchParams.get("destination") ?? "").toUpperCase().trim();
  const date = (searchParams.get("date") ?? "").trim();
  const maxLayoverHoursParam = searchParams.get("maxLayoverHours") ?? "20";

  const origins = originsParam
    .split(",")
    .map((o) => o.toUpperCase().trim())
    .filter((o) => /^[A-Z]{3}$/.test(o));

  if (origins.length === 0) {
    return NextResponse.json(
      { success: false, error: "At least one valid 3-letter origin code is required" },
      { status: 400 }
    );
  }

  if (!/^[A-Z]{3}$/.test(destination)) {
    return NextResponse.json(
      { success: false, error: "Destination must be a 3-letter IATA code" },
      { status: 400 }
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ success: false, error: "Date must be YYYY-MM-DD" }, { status: 400 });
  }

  const todayStr = new Date().toISOString().split("T")[0];
  if (date < todayStr) {
    return NextResponse.json(
      { success: false, error: "Travel date must be today or in the future" },
      { status: 400 }
    );
  }

  const maxLayoverHours = Math.max(0, parseFloat(maxLayoverHoursParam) || 20);
  const maxLayoverMinsFilter = maxLayoverHours * 60;

  const dates = [offsetDate(date, -1), date, offsetDate(date, 1)].filter((d) => d >= todayStr);

  const exchangeRate = await getUsdToInr().catch(() => 84);

  const pairs: Array<{ origin: string; date: string }> = [];
  for (const o of origins) {
    for (const d of dates) {
      if (o !== destination) pairs.push({ origin: o, date: d });
    }
  }

  console.log(`[plan] received origins=${JSON.stringify(origins)} destination=${destination} date=${date}`);
  console.log(`[plan] expanded to ${pairs.length} pairs: ${pairs.map(p => `${p.origin}/${p.date}`).join(", ")}`);

  type FulfilledVal = { origin: string; date: string; result: Awaited<ReturnType<typeof searchFlights>> };
  type Settled = { status: "fulfilled"; value: FulfilledVal } | { status: "rejected"; reason: unknown };
  const settled: Settled[] = [];

  for (let i = 0; i < pairs.length; i++) {
    const { origin, date: d } = pairs[i];
    console.log(`[plan] [${i + 1}/${pairs.length}] requesting ${origin} → ${destination} on ${d}`);
    try {
      const result = await searchFlights(origin, destination, d);
      console.log(`[plan] [${i + 1}/${pairs.length}] OK — ${result.options.length} options`);
      settled.push({ status: "fulfilled", value: { origin, date: d, result } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[plan] [${i + 1}/${pairs.length}] ERROR — ${msg}`);
      settled.push({ status: "rejected", reason: err });
    }
    if (i < pairs.length - 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
    }
  }

  const rows: FlightRow[] = [];
  let apiErrorSample = "";
  for (const s of settled) {
    if (s.status === "rejected") {
      if (!apiErrorSample && s.reason instanceof Error) apiErrorSample = s.reason.message;
      continue;
    }
    const { origin, date: d, result } = s.value;
    for (const opt of result.options) {
      if (opt.layoverMins > maxLayoverMinsFilter) continue;
      rows.push({
        origin,
        destination,
        originCity: AIRPORT_NAMES[origin] ?? origin,
        destCity: AIRPORT_NAMES[destination] ?? destination,
        date: d,
        airline: opt.airline,
        flightNumbers: opt.flightNumbers,
        priceINR: Math.round(opt.price * exchangeRate),
        stops: opt.stops,
        duration: opt.duration,
        durationMins: opt.durationMins,
        departureTime: opt.departureTime,
        arrivalTime: opt.arrivalTime,
        layoverMins: opt.layoverMins,
      });
    }
  }

  if (rows.length === 0) {
    const detail = apiErrorSample ? ` (${apiErrorSample})` : "";
    return NextResponse.json(
      {
        success: false,
        error: `No flights found for the given parameters${detail}. Try adjusting your filters or dates.`,
      },
      { status: 200 }
    );
  }

  // Score all rows to pick the best overall option
  const maxPrice = Math.max(...rows.map((r) => r.priceINR));
  const maxDurationMins = Math.max(...rows.map((r) => r.durationMins));
  const maxLayoverMins = Math.max(...rows.map((r) => r.layoverMins));

  const scored = rows.map((row) => ({
    row,
    score: scoreRow(row, maxPrice, maxDurationMins, maxLayoverMins),
  }));
  scored.sort((a, b) => a.score - b.score);

  const recommended = scored[0].row;

  // Sort rows by price for display
  const displayRows = [...rows].sort((a, b) => a.priceINR - b.priceINR);

  const avgPriceINR = Math.round(rows.reduce((s, r) => s + r.priceINR, 0) / rows.length);
  const highestPriceINR = Math.max(...rows.map((r) => r.priceINR));
  const lowestPriceINR = Math.min(...rows.map((r) => r.priceINR));
  const savingsINR = avgPriceINR - recommended.priceINR;
  const decision: "BOOK NOW" | "WAIT" =
    recommended.priceINR < avgPriceINR * 0.9 ? "BOOK NOW" : "WAIT";

  const summary = {
    totalOptions: rows.length,
    lowestINR: lowestPriceINR,
    averageINR: avgPriceINR,
    highestINR: highestPriceINR,
    bestOrigin: recommended.originCity,
    bestDate: recommended.date,
    bestAirline: recommended.airline,
  };

  // TODO: Persist price records to Supabase/PostgreSQL for historical analytics

  return NextResponse.json({
    success: true,
    rows: displayRows,
    recommendation: {
      row: recommended,
      avgPriceINR,
      highestPriceINR,
      savingsINR,
      decision,
    },
    summary,
    exchangeRate,
    searchedAt: new Date().toISOString(),
  });
}
