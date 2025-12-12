// app/api/fish-batch/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allBatches = await db.select().from(fishBatch);

    const updatedBatches = await Promise.all(
      allBatches.map(async (b) => {
        const ageDays = Math.floor(
          (Date.now() - new Date(b.dateAdded).getTime()) / (1000 * 60 * 60 * 24)
        );

        // 🐟 Determine stage
        let stage = "Larval Stage";
        if (ageDays > 14 && ageDays <= 60) stage = "Juvenile Stage";
        else if (ageDays > 60 && ageDays <= 120) stage = "Grow-Out Stage";
        else if (ageDays > 120) stage = "Ready to Harvest";

        // 🐟 Build update object
        const updateData: Partial<typeof fishBatch.$inferInsert> = {
          condition: stage,
        };

        // If "Ready to Harvest", also update batchStatus to "ready"
        if (stage === "Ready to Harvest") {
          updateData.batchStatus = "ready";
        }

        // Update DB only if something changed
        if (
          b.condition !== stage ||
          (stage === "Ready to Harvest" && b.batchStatus !== "ready")
        ) {
          await db
            .update(fishBatch)
            .set(updateData)
            .where(eq(fishBatch.fishBatchId, b.fishBatchId));
        }

        return {
          ...b,
          fishDays: ageDays,
          condition: stage,
          batchStatus: updateData.batchStatus ?? b.batchStatus,
        };
      })
    );

    const totalFish = updatedBatches.reduce(
      (sum, b) => sum + (b.fishQuantity ?? 0),
      0
    );

    return NextResponse.json({
      batches: updatedBatches,
      totalFish,
    });
  } catch (error) {
    console.error("Error fetching fish batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch fish batches" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { fishQuantity } = data;

    const now = new Date();

    // Set initial stage
    const condition = "Larval Stage";

    // Calculate expected harvest date (example: 120 days from now)
    const expectedHarvestDate = new Date(now);
    expectedHarvestDate.setDate(expectedHarvestDate.getDate() + 120);

    await db.insert(fishBatch).values({
      fishQuantity,
      dateAdded: now,
      condition,
      expectedHarvestDate,
      batchStatus: "growing", // initial batch status
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting fish batch:", error);
    return NextResponse.json(
      { error: "Failed to insert fish batch" },
      { status: 500 }
    );
  }
}
