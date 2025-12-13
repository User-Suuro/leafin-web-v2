// app/api/batches/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { calculateFishStage, calculatePlantStage } from "@/lib/batchUtils";
import { eq } from "drizzle-orm";

function formatDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD only
}

export async function GET(req: Request) {
  console.log("API /api/batches called");
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if (type === "fish") {
      const result = await db
        .select()
        .from(fishBatch)
        .orderBy(fishBatch.fishBatchId);
      const formatted = result.map((r) => ({
        ...r,
        dateAdded: formatDate(r.dateAdded),
        expectedHarvestDate: formatDate(r.expectedHarvestDate),
      }));
      return NextResponse.json(formatted);
    }

    if (type === "plant") {
      const result = await db
        .select()
        .from(plantBatch)
        .orderBy(plantBatch.plantBatchId);
      const formatted = result.map((r) => ({
        ...r,
        dateAdded: formatDate(r.dateAdded),
        expectedHarvestDate: formatDate(r.expectedHarvestDate),
      }));
      return NextResponse.json(formatted);
    }

    // If no type specified, return both
    const [fish, plant] = await Promise.all([
      db.select().from(fishBatch).orderBy(fishBatch.fishBatchId),
      db.select().from(plantBatch).orderBy(plantBatch.plantBatchId),
    ]);

    // Process Fish Batches
    const fishFormatted = await Promise.all(
      fish.map(async (r) => {
        const { stage, status } = calculateFishStage(r.dateAdded);

        // Update DB if stage or status changed (and status isn't incorrectly overwritten if harvested/discarded)
        // Note: we only auto-update to "ready" or change stage, we don't revert "harvested" or "discarded"
        if (
          r.batchStatus !== "harvested" &&
          r.batchStatus !== "discarded" &&
          (r.condition !== stage || (status === "ready" && r.batchStatus !== "ready"))
        ) {
          await db
            .update(fishBatch)
            .set({ condition: stage, batchStatus: status === "ready" ? "ready" : r.batchStatus })
            .where(eq(fishBatch.fishBatchId, r.fishBatchId));
        }

        return {
          ...r,
          condition: stage, // Return calculated stage
          batchStatus:
            r.batchStatus === "harvested" || r.batchStatus === "discarded"
              ? r.batchStatus
              : status === "ready"
                ? "ready"
                : r.batchStatus,
          dateAdded: formatDate(r.dateAdded),
          expectedHarvestDate: formatDate(r.expectedHarvestDate),
        };
      })
    );

    // Process Plant Batches
    const plantFormatted = await Promise.all(
      plant.map(async (r) => {
        const { stage, status } = calculatePlantStage(r.dateAdded);

        if (
          r.batchStatus !== "harvested" &&
          r.batchStatus !== "discarded" &&
          (r.condition !== stage || (status === "ready" && r.batchStatus !== "ready"))
        ) {
          await db
            .update(plantBatch)
            .set({ condition: stage, batchStatus: status === "ready" ? "ready" : r.batchStatus })
            .where(eq(plantBatch.plantBatchId, r.plantBatchId));
        }

        return {
          ...r,
          condition: stage,
          batchStatus:
            r.batchStatus === "harvested" || r.batchStatus === "discarded"
              ? r.batchStatus
              : status === "ready"
                ? "ready"
                : r.batchStatus,
          dateAdded: formatDate(r.dateAdded),
          expectedHarvestDate: formatDate(r.expectedHarvestDate),
        };
      })
    );

    return NextResponse.json({ fish: fishFormatted, plant: plantFormatted });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}
