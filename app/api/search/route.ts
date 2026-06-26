import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { searchFlights } from "@/lib/skyscanner";
import { getUsdToInr } from "@/lib/exchange";
import { AIRPORT_NAMES } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = (searchParams.get("origin") ?? "").toUpperCase().trim();
  const destination = (searchParams.get("destination") ?? "").toUpperCase().trim();
  const date = (searchParams.get("date") ?? "").trim();

  // ── Validate inputs ────────────────────────────────────────────────────────
  if (!origin || !destination || !date) {
    return NextResponse.json(
      { success: false, error: "origin, destination, and date are required" },
      { status: 400 }
    );
  }

  if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination)) {
    return NextResponse.json(
      { success: false, error: "Airport codes must be 3 letters (e.g. TRV, BKK)" },
      { status: 400 }
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { success: false, error: "Date must be in YYYY-MM-DD format" },
      { status: 400 }
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];
  if (date < todayStr) {
    return NextResponse.json(
      { success: false, error: "Travel date must be today or in the future" },
      { status: 400 }
    );
  }

  // ── Fetch exchange rate + flights in parallel ──────────────────────────────
  const [rateSettled, flightSettled] = await Promise.allSettled([
    getUsdToInr(),
    searchFlights(origin, destination, date),
  ]);

  const exchangeRate =
    rateSettled.status === "fulfilled" ? rateSettled.value : 84;

  if (flightSettled.status === "rejected") {
    const msg =
      flightSettled.reason instanceof Error
        ? flightSettled.reason.message
        : "Flight search failed";
    return NextResponse.json({ success: false, error: msg }, { status: 502 });
  }

  const flight = flightSettled.value;

  // ── Persist to DB + compute 48 h stats (non-fatal if DB fails) ─────────────
  let stats48h: {
    lowest: number;
    average: number;
    highest: number;
    count: number;
  } | null = null;

  try {
    const route = await db.route.upsert({
      where: { origin_destination: { origin, destination } },
      update: {},
      create: {
        origin,
        destination,
        originCity: AIRPORT_NAMES[origin] ?? origin,
        destCity: AIRPORT_NAMES[destination] ?? destination,
      },
    });

    // One PriceRecord per returned option (up to 10)
    for (const opt of flight.options) {
      await db.priceRecord.create({
        data: {
          routeId: route.id,
          price: opt.price,
          currency: flight.currency, // stored as-is (USD from API)
          airline: opt.airline,
          stops: opt.stops,
          duration: opt.duration,
          departDate: new Date(date),
          tripType: "one_way",
        },
      });
    }

    // 48-hour window for this route
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const records48h = await db.priceRecord.findMany({
      where: { routeId: route.id, fetchedAt: { gte: cutoff } },
    });

    if (records48h.length > 0) {
      // Convert stored prices → INR for the stats display
      const prices = records48h.map((r) =>
        r.currency === "USD"
          ? Math.round(r.price * exchangeRate)
          : Math.round(r.price)
      );
      stats48h = {
        lowest: Math.min(...prices),
        average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
        highest: Math.max(...prices),
        count: prices.length,
      };
    }
  } catch {
    // DB failure is non-fatal — live price is still returned
  }

  // ── Return ─────────────────────────────────────────────────────────────────
  return NextResponse.json({
    success: true,
    origin,
    destination,
    originCity: AIRPORT_NAMES[origin] ?? origin,
    destCity: AIRPORT_NAMES[destination] ?? destination,
    date,
    livePrice: Math.round(flight.lowestPrice * exchangeRate),
    airline: flight.cheapestAirline,
    currency: "INR",
    exchangeRate,
    lastUpdated: new Date().toISOString(),
    stats48h,
  });
}
