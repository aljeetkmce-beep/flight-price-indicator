import { NextRequest, NextResponse } from "next/server";

const DB_UNAVAILABLE = NextResponse.json(
  { success: false, error: "Database not configured. Set DATABASE_URL to enable Price Watch." },
  { status: 503 }
);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!process.env.DATABASE_URL) return DB_UNAVAILABLE;
  const { db } = await import("@/lib/db");

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const { status } = body as { status?: string };

    if (status && status !== "active" && status !== "paused") {
      return NextResponse.json({ success: false, error: "status must be active or paused" }, { status: 400 });
    }

    const watch = await db.watch.update({
      where: { id },
      data: { ...(status ? { status } : {}) },
    });
    return NextResponse.json({ success: true, watch });
  } catch {
    return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!process.env.DATABASE_URL) return DB_UNAVAILABLE;
  const { db } = await import("@/lib/db");

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });

  try {
    await db.watch.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
  }
}
