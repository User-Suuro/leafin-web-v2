import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Discard body:", body);

    let { type, batchId } = body as { type: string; batchId: number | string };

    // Validate type
    if (
      typeof type !== "string" ||
      !["fish", "plant"].includes(type.toLowerCase())
    ) {
      return NextResponse.json(
        {
          error: "Invalid type, must be 'fish' or 'plant'",
          bodyReceived: body,
        },
        { status: 400 }
      );
    }
    type = type.toLowerCase();

    // Validate batchId
    batchId = Number(batchId);
    if (isNaN(batchId)) {
      return NextResponse.json(
        { error: "Invalid batchId, must be a number", bodyReceived: body },
        { status: 400 }
      );
    }

    const table = type === "fish" ? fishBatch : plantBatch;
    const idColumn =
      type === "fish" ? fishBatch.fishBatchId : plantBatch.plantBatchId;

    const [batch] = await db.select().from(table).where(eq(idColumn, batchId));
    if (!batch) {
      return NextResponse.json(
        { error: "Batch not found", batchId },
        { status: 404 }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ This is the missing piece
    await db
      .update(table)
      .set({ batchStatus: "discarded" })
      .where(eq(idColumn, batchId));

    await logAction(
      session.user.id,
      "UPDATE", // Discard is a status update
      "BATCH",
      {
        notes: `Discarded ${type === "fish" ? "Fish" : "Plant"} Batch #${batchId}.`,
        batchType: type,
        batchId: Number(batchId),
        action: "DISCARD" // add specific sub-action in details
      },
      String(batchId),
      `Discarded ${type} batch #${batchId}`
    );

    // Return the updated batch (optional)
    const [updatedBatch] = await db
      .select()
      .from(table)
      .where(eq(idColumn, batchId));
    console.log("Updated batch:", updatedBatch);

    return NextResponse.json({ success: true, batch: updatedBatch });
  } catch (error) {
    console.error("Discard error:", error);
    return NextResponse.json(
      { error: "Failed to discard batch", details: (error as Error).message },
      { status: 500 }
    );
  }
}
