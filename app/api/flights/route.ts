import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { searchFlights } from "@/lib/skyscanner";
import { AIRPORT_NAMES } from "@/types";

const FETCH_ROUTES = [
  { origin: "TRV", destination: "BKK" },
  { origin: "COK", destination: "BKK" },
  { origin: "BLR", destination: "BKK" },
] as const;

export async function GET() {
  const depart = new Date();
  depart.setDate(depart.getDate() + 30);
  const dateStr = depart.toISOString().split("T")[0];

  let logId: number | undefined;
  try {
    const log = await db.fetchLog.create({ data: { status: "running" } });
    logId = log.id;
  } catch {
    // DB may not be ready — continue without logging
  }

  const results: {
    origin: string;
    destination: string;
    lowestPrice: number;
    averagePrice: number;
    currency: string;
    airline: string;
  }[] = [];
  const errors: string[] = [];

  for (const { origin, destination } of FETCH_ROUTES) {
    try {
      const flight = await searchFlights(origin, destination, dateStr);

      // Upsert route so this works even if db:seed hasn't been run
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

      // Store each price option as a separate record (up to 10)
      for (const opt of flight.options) {
        await db.priceRecord.create({
          data: {
            routeId: route.id,
            price: opt.price,
            currency: flight.currency,
            airline: opt.airline,
            stops: opt.stops,
            duration: opt.duration,
            departDate: new Date(dateStr),
            tripType: "one_way",
          },
        });
      }

      results.push({
        origin,
        destination,
        lowestPrice: flight.lowestPrice,
        averagePrice: flight.averagePrice,
        currency: flight.currency,
        airline: flight.cheapestAirline,
      });
    } catch (err) {
      errors.push(
        `${origin}→${destination}: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  if (logId !== undefined) {
    try {
      await db.fetchLog.update({
        where: { id: logId },
        data: {
          finishedAt: new Date(),
          status: results.length > 0 ? "success" : "failed",
          recordsFetched: results.length,
          message: errors.length > 0 ? errors.join("; ") : null,
        },
      });
    } catch {
      // Ignore logging failures
    }
  }

  if (!results.length) {
    return NextResponse.json({ success: false, errors }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: results,
    errors: errors.length ? errors : undefined,
  });
}
