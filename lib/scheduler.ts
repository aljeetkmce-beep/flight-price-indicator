import type { ScheduledTask } from "node-cron";
import { searchFlights } from "./skyscanner";
import { getUsdToInr } from "./exchange";
import { sendAlertEmail, sendWhatsAppAlert } from "./mailer";
import type { Watch } from "@prisma/client";

let cronTask: ScheduledTask | null = null;

export function startScheduler(): void {
  if (!process.env.DATABASE_URL) {
    console.log("[scheduler] DATABASE_URL not set — scheduler disabled");
    return;
  }
  if (cronTask) return;
  import("node-cron").then(({ default: cron }) => {
    cronTask = cron.schedule("* * * * *", () => { void checkDueWatches(); });
    console.log("[scheduler] Started — checking every minute for due watches");
  }).catch((err) => {
    console.error("[scheduler] Failed to start:", err);
  });
}

function localHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

/** Called every minute by cron; also exposed for manual triggers. */
export async function checkDueWatches(): Promise<{ checked: number; errors: string[] }> {
  if (!process.env.DATABASE_URL) {
    return { checked: 0, errors: ["DATABASE_URL not configured"] };
  }
  const { db } = await import("./db");
  const time = localHHMM();
  const today = todayStr();

  const watches = await db.watch.findMany({
    where: { status: "active", checkTime: time },
  });

  if (watches.length) {
    console.log(`[scheduler] ${time} — ${watches.length} watch(es) due`);
  }

  const errors: string[] = [];
  for (const w of watches) {
    try {
      await processWatch(w, today);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Watch ${w.id}: ${msg}`);
      console.error(`[scheduler] Watch ${w.id} error:`, msg);
    }
  }
  return { checked: watches.length, errors };
}

/** Run a single watch immediately (used by the "Check Now" API). */
export async function runWatchNow(watchId: number): Promise<void> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not configured");
  const { db } = await import("./db");
  const w = await db.watch.findUnique({ where: { id: watchId } });
  if (!w) throw new Error(`Watch ${watchId} not found`);
  if (w.status !== "active") throw new Error(`Watch ${watchId} is ${w.status}`);
  await processWatch(w, todayStr());
}

async function processWatch(watch: Watch, today: string): Promise<void> {
  const { db } = await import("./db");
  console.log(`[scheduler] Checking watch ${watch.id}: ${watch.origin} → ${watch.destination} on ${watch.travelDate}`);

  const exchangeRate = await getUsdToInr().catch(() => 84);
  const result = await searchFlights(watch.origin, watch.destination, watch.travelDate);

  // Apply user filters
  const filtered = result.options.filter((opt) => {
    if (watch.maxStops !== null && opt.stops > watch.maxStops) return false;
    if (watch.maxLayoverHours !== null && opt.layoverMins > watch.maxLayoverHours * 60) return false;
    return true;
  });

  if (!filtered.length) {
    console.log(`[scheduler] Watch ${watch.id}: no options after filters`);
    return;
  }

  const bestFare = Math.round(Math.min(...filtered.map((o) => o.price * exchangeRate)));

  // Persist snapshot
  await db.priceHistory.create({
    data: { watchId: watch.id, dateChecked: today, fare: bestFare, currency: "INR" },
  });

  // Compute running stats
  const prevLowest = watch.lowestFareSeen;
  const lowestFareSeen = prevLowest === null ? bestFare : Math.min(prevLowest, bestFare);
  const highestFareSeen = watch.highestFareSeen === null ? bestFare : Math.max(watch.highestFareSeen, bestFare);

  // Evaluate alert rules
  let alertTriggered = false;
  const reasons: string[] = [];

  if (watch.alertType === "below_threshold" || watch.alertType === "both") {
    if (watch.thresholdPrice !== null && bestFare < watch.thresholdPrice) {
      alertTriggered = true;
      reasons.push(
        `Fare ${inr(bestFare)} is below your threshold of ${inr(watch.thresholdPrice)}`
      );
    }
  }

  if (watch.alertType === "new_lowest" || watch.alertType === "both") {
    if (prevLowest !== null && bestFare < prevLowest) {
      alertTriggered = true;
      reasons.push(
        `New lowest fare ${inr(bestFare)} — previous lowest was ${inr(prevLowest)}`
      );
    }
  }

  // Persist updated stats
  const updatedWatch = await db.watch.update({
    where: { id: watch.id },
    data: { currentFare: bestFare, lowestFareSeen, highestFareSeen, lastCheckedAt: new Date() },
  });

  if (alertTriggered) {
    const triggerReason = reasons.join("; ");
    console.log(`[scheduler] Watch ${watch.id} ALERT: ${triggerReason}`);
    await sendAlertEmail({
      watch: updatedWatch,
      currentFareINR: bestFare,
      lowestFareSeen,
      triggerReason,
    });
    if (watch.whatsapp) {
      await sendWhatsAppAlert(
        watch.whatsapp,
        `${watch.origin}→${watch.destination}: ${triggerReason}`
      );
    }
  }
}

function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}
