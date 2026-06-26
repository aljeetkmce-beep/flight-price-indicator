import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });

  const history = await db.priceHistory.findMany({
    where: { watchId: id },
    orderBy: { dateChecked: "asc" },
  });

  return NextResponse.json({ success: true, history });
}
