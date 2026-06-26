import { db } from "@/lib/db";
import { searchFlights, FlightSearchResult, FlightOption } from "@/lib/skyscanner";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function cachedSearchFlights(
  origin: string,
  destination: string,
  date: string
): Promise<FlightSearchResult> {
  const cutoff = new Date(Date.now() - CACHE_TTL_MS);

  const rows = await db.cachedFlight.findMany({
    where: { origin, destination, date, cachedAt: { gte: cutoff } },
    orderBy: { price: "asc" },
  });

  if (rows.length > 0) {
    console.log(`[cache] HIT  ${origin} → ${destination} on ${date} (${rows.length} options)`);

    const prices = rows.map((r) => r.price);
    const options: FlightOption[] = rows.map((r) => ({
      price: r.price,
      airline: r.airline,
      flightNumbers: r.flightNumbers,
      stops: r.stops,
      duration: r.duration,
      durationMins: r.durationMins,
      departureTime: r.departureTime,
      arrivalTime: r.arrivalTime,
      layoverMins: r.layoverMins,
    }));
    return {
      lowestPrice: prices[0],
      averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      currency: "USD",
      cheapestAirline: rows[0].airline,
      options,
    };
  }

  console.log(`[cache] MISS ${origin} → ${destination} on ${date} — calling Skyscanner`);
  const result = await searchFlights(origin, destination, date);

  await db.$transaction([
    db.cachedFlight.deleteMany({ where: { origin, destination, date } }),
    db.cachedFlight.createMany({
      data: result.options.map((opt: FlightOption) => ({
        origin,
        destination,
        date,
        airline: opt.airline,
        flightNumbers: opt.flightNumbers,
        price: opt.price,
        stops: opt.stops,
        duration: opt.duration,
        durationMins: opt.durationMins,
        departureTime: opt.departureTime,
        arrivalTime: opt.arrivalTime,
        layoverMins: opt.layoverMins,
      })),
    }),
  ]);

  return result;
}
