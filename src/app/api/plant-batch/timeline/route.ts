// app/api/plant-batch/timeline/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { plantBatch } from "@/lib/db/schema/plantBatch";

export async function GET() {
  try {
    // Fetch all plant batches sorted by dateAdded
    const batches = await db
      .select()
      .from(plantBatch)
      .orderBy(plantBatch.dateAdded);

    const withTimeline = batches.map((b) => {
      const created = new Date(b.dateAdded);
      const plantDays = Math.floor(
        (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
      );

      // expected harvest date = dateAdded + plantDays
      const expectedHarvestDate = new Date(created);
      expectedHarvestDate.setDate(created.getDate() + plantDays);

      return {
        id: b.plantBatchId,
        quantity: b.plantQuantity,
        plantDays,
        dateAdded: created,
        condition: b.condition,
        expectedHarvestDate,
      };
    });

    return NextResponse.json(withTimeline);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch plant batch timeline." },
      { status: 500 }
    );
  }
}
