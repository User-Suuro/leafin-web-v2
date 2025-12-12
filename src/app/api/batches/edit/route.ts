import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { eq } from "drizzle-orm";

type FishBatchUpdate = Partial<{
  fishQuantity: number;
  batchStatus: "growing" | "ready" | "harvested" | "discarded";
}>;

type PlantBatchUpdate = Partial<{
  plantQuantity: number;
  batchStatus: "growing" | "ready" | "harvested" | "discarded";
}>;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      type: "fish" | "plant";
      batchId: number;
      updates: FishBatchUpdate | PlantBatchUpdate;
    };

    const { type, batchId, updates } = body;

    if (!batchId || !type || !updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Invalid request or no updates" },
        { status: 400 }
      );
    }

    const table = type === "fish" ? fishBatch : plantBatch;
    const idColumn =
      type === "fish" ? fishBatch.fishBatchId : plantBatch.plantBatchId;

    const [batch] = await db.select().from(table).where(eq(idColumn, batchId));
    if (!batch)
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    await db.update(table).set(updates).where(eq(idColumn, batchId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { error: "Failed to edit batch", details: (error as Error).message },
      { status: 500 }
    );
  }
}
