// app/api/plant-batch/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logUtils";

export async function GET() {
  try {
    const allBatches = await db.select().from(plantBatch);

    const updatedBatches = await Promise.all(
      allBatches.map(async (b) => {
        const ageDays = Math.floor(
          (Date.now() - new Date(b.dateAdded).getTime()) / (1000 * 60 * 60 * 24)
        );

        // 🌱 Determine stage
        let stage = "Seedling Stage";
        if (ageDays > 14 && ageDays <= 35) stage = "Vegetative Growth";
        else if (ageDays > 35 && ageDays <= 50) stage = "Harvest Ready";
        else if (ageDays > 50) stage = "Bolting & Seeding";

        // 🔄 Determine new batchStatus
        let newStatus = b.batchStatus;
        if (stage === "Harvest Ready" || stage === "Bolting & Seeding") {
          newStatus = "ready";
        }

        // ✅ Update only if condition or status changed
        if (b.condition !== stage || b.batchStatus !== newStatus) {
          await db
            .update(plantBatch)
            .set({
              condition: stage,
              batchStatus: newStatus,
            })
            .where(eq(plantBatch.plantBatchId, b.plantBatchId));
        }

        return {
          ...b,
          condition: stage,
          batchStatus: newStatus,
          plantDays: ageDays,
        };
      })
    );

    return NextResponse.json({ batches: updatedBatches });
  } catch (error) {
    console.error("Error fetching plant batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant batches" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { plantQuantity } = data;

    const now = new Date();

    // 🌱 Initial stage
    const condition = "Seedling Stage";

    // Calculate expected harvest date (example: 50 days from now)
    const expectedHarvestDate = new Date(now);
    expectedHarvestDate.setDate(expectedHarvestDate.getDate() + 50);

    const result = await db.insert(plantBatch).values({
      plantQuantity,
      dateAdded: now,
      condition,
      expectedHarvestDate,
      batchStatus: "growing", // initial batch status
    });

    await logActivity({
      notes: `Added Plant Batch with ${plantQuantity} plants.`,
      plantBatchId: Number(result[0].insertId),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting plant batch:", error);
    return NextResponse.json(
      { error: "Failed to insert plant batch" },
      { status: 500 }
    );
  }
}
