import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { searchFlights } from "@/lib/skyscanner";
import { getUsdToInr } from "@/lib/exchange";

export async function GET() {
  const watches = await db.watch.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, watches });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      origin, destination, travelDate,
      maxStops, maxLayoverHours,
      monitoringStartDate, checkTime,
      alertType, thresholdPrice,
      email, whatsapp,
    } = body as {
      origin: string; destination: string; travelDate: string;
      maxStops: number | null; maxLayoverHours: number | null;
      monitoringStartDate: string; checkTime: string;
      alertType: string; thresholdPrice: number | null;
      email: string; whatsapp?: string;
    };

    if (!origin || !destination || !travelDate || !checkTime || !alertType || !email) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (alertType === "below_threshold" && !thresholdPrice) {
      return NextResponse.json(
        { success: false, error: "thresholdPrice required for below_threshold alert type" },
        { status: 400 }
      );
    }

    // Create watch first
    const watch = await db.watch.create({
      data: {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        travelDate,
        maxStops: maxStops ?? null,
        maxLayoverHours: maxLayoverHours ?? null,
        monitoringStartDate: monitoringStartDate || new Date().toISOString().split("T")[0],
        checkTime,
        alertType,
        thresholdPrice: thresholdPrice ?? null,
        email,
        whatsapp: whatsapp || null,
        status: "active",
      },
    });

    // Immediately fetch current fare in the background
    void (async () => {
      try {
        const exchangeRate = await getUsdToInr().catch(() => 84);
        const result = await searchFlights(origin.toUpperCase(), destination.toUpperCase(), travelDate);
        const filtered = result.options.filter((opt) => {
          if (maxStops !== null && opt.stops > maxStops) return false;
          if (maxLayoverHours !== null && opt.layoverMins > maxLayoverHours * 60) return false;
          return true;
        });
        if (!filtered.length) return;
        const bestFare = Math.round(Math.min(...filtered.map((o) => o.price * exchangeRate)));
        const today = new Date().toISOString().split("T")[0];
        await db.$transaction([
          db.priceHistory.create({ data: { watchId: watch.id, dateChecked: today, fare: bestFare } }),
          db.watch.update({
            where: { id: watch.id },
            data: { currentFare: bestFare, lowestFareSeen: bestFare, highestFareSeen: bestFare, lastCheckedAt: new Date() },
          }),
        ]);
      } catch (err) {
        console.error(`[watch] Initial fare fetch failed for watch ${watch.id}:`, err);
      }
    })();

    return NextResponse.json({ success: true, watch });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
