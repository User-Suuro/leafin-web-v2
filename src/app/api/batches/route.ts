// app/api/batches/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { plantBatch } from "@/lib/db/schema/plantBatch";

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

    const fishFormatted = fish.map((r) => ({
      ...r,
      dateAdded: formatDate(r.dateAdded),
      expectedHarvestDate: formatDate(r.expectedHarvestDate),
    }));

    const plantFormatted = plant.map((r) => ({
      ...r,
      dateAdded: formatDate(r.dateAdded),
      expectedHarvestDate: formatDate(r.expectedHarvestDate),
    }));

    return NextResponse.json({ fish: fishFormatted, plant: plantFormatted });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}
