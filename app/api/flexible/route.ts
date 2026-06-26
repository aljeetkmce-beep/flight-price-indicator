import { NextRequest, NextResponse } from "next/server";
import { searchFlights } from "@/lib/skyscanner";
import { getUsdToInr } from "@/lib/exchange";
import { AIRPORT_NAMES } from "@/types";

interface FlightRow {
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

interface CandidateGroup {
  candidateDate: string;
  best: FlightRow;
  secondBest: FlightRow | null;
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

function offsetDate(base: string, days: number): string {
  const d = new Date(base + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const originsParam = searchParams.get("origins") ?? "";
  const destination = (searchParams.get("destination") ?? "").toUpperCase().trim();
  const datesParam = searchParams.get("dates") ?? "";
  const maxLayoverHoursParam = searchParams.get("maxLayoverHours") ?? "20";

  const origins = originsParam
    .split(",")
    .map((o) => o.toUpperCase().trim())
    .filter((o) => /^[A-Z]{3}$/.test(o));

  const candidateDates = datesParam
    .split(",")
    .map((d) => d.trim())
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));

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

  if (candidateDates.length === 0) {
    return NextResponse.json(
      { success: false, error: "At least one candidate date is required" },
      { status: 400 }
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const validCandidateDates = candidateDates.filter((d) => d >= todayStr);
  if (validCandidateDates.length === 0) {
    return NextResponse.json(
      { success: false, error: "All candidate dates are in the past" },
      { status: 400 }
    );
  }

  const maxLayoverHours = Math.max(0, parseFloat(maxLayoverHoursParam) || 20);
  const maxLayoverMinsFilter = maxLayoverHours * 60;

  const exchangeRate = await getUsdToInr().catch(() => 84);

  // Build all (origin, searchDate, candidateDate) triples
  const pairs: Array<{ origin: string; searchDate: string; candidateDate: string }> = [];
  for (const cd of validCandidateDates) {
    const searchDates = [offsetDate(cd, -1), cd, offsetDate(cd, 1)].filter(
      (d) => d >= todayStr
    );
    for (const o of origins) {
      if (o === destination) continue;
      for (const sd of searchDates) {
        pairs.push({ origin: o, searchDate: sd, candidateDate: cd });
      }
    }
  }

  const settled = await Promise.allSettled(
    pairs.map(({ origin, searchDate, candidateDate }) =>
      searchFlights(origin, destination, searchDate).then((result) => ({
        origin,
        searchDate,
        candidateDate,
        result,
      }))
    )
  );

  // Collect rows per candidateDate
  const rowsByCandidate = new Map<string, FlightRow[]>();
  for (const cd of validCandidateDates) rowsByCandidate.set(cd, []);

  let apiErrorSample = "";
  for (const s of settled) {
    if (s.status === "rejected") {
      if (!apiErrorSample && s.reason instanceof Error) apiErrorSample = s.reason.message;
      continue;
    }
    const { origin, searchDate, candidateDate, result } = s.value;
    const rows = rowsByCandidate.get(candidateDate)!;
    for (const opt of result.options) {
      if (opt.layoverMins > maxLayoverMinsFilter) continue;
      rows.push({
        origin,
        destination,
        originCity: AIRPORT_NAMES[origin] ?? origin,
        destCity: AIRPORT_NAMES[destination] ?? destination,
        date: searchDate,
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

  // For each candidate date, score and pick best + secondBest
  const groups: CandidateGroup[] = [];
  const finalOptions: (FlightRow & { candidateDate: string; rank: number })[] = [];

  for (const cd of validCandidateDates) {
    const rows = rowsByCandidate.get(cd) ?? [];
    if (rows.length === 0) continue;

    const maxP = Math.max(...rows.map((r) => r.priceINR));
    const maxD = Math.max(...rows.map((r) => r.durationMins));
    const maxL = Math.max(...rows.map((r) => r.layoverMins));

    const scored = rows
      .map((row) => ({ row, score: scoreRow(row, maxP, maxD, maxL) }))
      .sort((a, b) => a.score - b.score);

    const best = scored[0].row;
    const secondBest = scored.length > 1 ? scored[1].row : null;

    groups.push({ candidateDate: cd, best, secondBest });
    finalOptions.push({ ...best, candidateDate: cd, rank: 0 });
    if (secondBest) finalOptions.push({ ...secondBest, candidateDate: cd, rank: 1 });
  }

  if (groups.length === 0) {
    const detail = apiErrorSample ? ` (${apiErrorSample})` : "";
    return NextResponse.json(
      {
        success: false,
        error: `No flights found for any of the candidate dates${detail}. Try different dates or origins.`,
      },
      { status: 200 }
    );
  }

  // Overall recommendation across all finalOptions
  const allRows = groups.flatMap((g) =>
    [g.best, g.secondBest].filter((x): x is FlightRow => x !== null)
  );
  const maxP = Math.max(...allRows.map((r) => r.priceINR));
  const maxD = Math.max(...allRows.map((r) => r.durationMins));
  const maxL = Math.max(...allRows.map((r) => r.layoverMins));

  const scoredAll = allRows
    .map((row) => ({ row, score: scoreRow(row, maxP, maxD, maxL) }))
    .sort((a, b) => a.score - b.score);

  const recommended = scoredAll[0].row;
  const avgPriceINR = Math.round(allRows.reduce((s, r) => s + r.priceINR, 0) / allRows.length);
  const savingsINR = avgPriceINR - recommended.priceINR;
  const decision: "BOOK NOW" | "WAIT" =
    recommended.priceINR < avgPriceINR * 0.9 ? "BOOK NOW" : "WAIT";

  // TODO: Persist finalOptions to Supabase/PostgreSQL for historical analytics

  return NextResponse.json({
    success: true,
    groups,
    finalOptions,
    recommendation: { row: recommended, avgPriceINR, savingsINR, decision },
    exchangeRate,
    searchedAt: new Date().toISOString(),
  });
}
