import { NextRequest, NextResponse } from "next/server";
import { checkDueWatches, runWatchNow } from "@/lib/scheduler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { watchId?: number };

    if (body.watchId !== undefined) {
      await runWatchNow(body.watchId);
      return NextResponse.json({ success: true, message: `Watch ${body.watchId} checked` });
    }

    const result = await checkDueWatches();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
