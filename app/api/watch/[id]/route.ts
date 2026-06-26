import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });

  try {
    await db.watch.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
  }
}
