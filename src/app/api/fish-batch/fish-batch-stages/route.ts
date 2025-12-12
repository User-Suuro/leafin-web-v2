import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";

export async function GET() {
  try {
    const allBatches = await db.select().from(fishBatch);

    const stageCounts: Record<string, number> = {
      "Larval Stage": 0,
      "Juvenile Stage": 0,
      "Grow-Out Stage": 0,
      "Harvest Ready": 0,
    };

    allBatches.forEach((b) => {
      const created = new Date(b.dateAdded);
      const ageDays = Math.floor(
        (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
      );

      let stage = "Larval Stage";
      if (ageDays > 30 && ageDays <= 60) stage = "Juvenile Stage";
      else if (ageDays > 60 && ageDays <= 120) stage = "Grow-Out Stage";
      else if (ageDays > 120) stage = "Harvest Ready";

      // Instead of adding fishQuantity, just count the batch
      stageCounts[stage] += 1;
    });

    return NextResponse.json(stageCounts);
  } catch (error) {
    console.error("Error fetching fish stage distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch fish stages" },
      { status: 500 }
    );
  }
}
