import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { success: false, error: "Database not configured. Set DATABASE_URL to enable Price Watch." },
      { status: 503 }
    );
  }
  const { db } = await import("@/lib/db");

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });

  const history = await db.priceHistory.findMany({
    where: { watchId: id },
    orderBy: { dateChecked: "asc" },
  });

  return NextResponse.json({ success: true, history });
}
