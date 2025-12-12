import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { plantBatch } from "@/lib/db/schema/plantBatch";

export async function GET() {
  try {
    const allBatches = await db.select().from(plantBatch);

    // Initialize stage counts
    const stageCounts: Record<string, number> = {
      "Seedling Stage": 0,
      "Vegetative Growth": 0,
      "Harvest Ready": 0,
      "Bolting & Seeding": 0,
    };

    allBatches.forEach((b) => {
      const created = new Date(b.dateAdded);
      const ageDays = Math.floor(
        (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
      );

      let stage = "Seedling Stage";
      if (ageDays > 14 && ageDays <= 35) stage = "Vegetative Growth";
      else if (ageDays > 35 && ageDays <= 50) stage = "Harvest Ready";
      else if (ageDays > 50) stage = "Bolting & Seeding";

      // Count the batch
      stageCounts[stage] += 1;
    });

    return NextResponse.json(stageCounts);
  } catch (error) {
    console.error("Error fetching plant stage distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant stages" },
      { status: 500 }
    );
  }
}
