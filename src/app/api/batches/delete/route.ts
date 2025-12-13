import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Added import
import { headers } from "next/headers"; // Added import
import { logAction } from "@/lib/logger"; // Added import

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, batchId } = (await req.json()) as {
      type: "fish" | "plant";
      batchId: number;
    };
    if (!batchId || !type)
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const table = type === "fish" ? fishBatch : plantBatch;
    const idColumn =
      type === "fish" ? fishBatch.fishBatchId : plantBatch.plantBatchId;

    const [batch] = await db.select().from(table).where(eq(idColumn, batchId));
    if (!batch)
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    await db.delete(table).where(eq(idColumn, batchId));

    await logAction(
      session.user.id,
      "DELETE",
      "BATCH",
      { type, batchId },
      String(batchId),
      `Deleted ${type} batch #${batchId}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete batch", details: (error as Error).message },
      { status: 500 }
    );
  }
}
