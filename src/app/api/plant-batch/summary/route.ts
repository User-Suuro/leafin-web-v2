// app/api/plant-batch/summary/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        // ✅ total batches
        totalBatches: sql<number>`COUNT(*)`,

        // ✅ total plants (based on plantQuantity)
        totalPlants: sql<number>`SUM(${plantBatch.plantQuantity})`,

        // ✅ average age based on dateAdded
        avgAge: sql<number>`AVG(DATEDIFF(CURDATE(), ${plantBatch.dateAdded}))`,

        // ✅ majority stage (batchStatus)
        majorityStage: sql<string>`(
          SELECT ${plantBatch.batchStatus}
          FROM ${plantBatch}
          GROUP BY ${plantBatch.batchStatus}
          ORDER BY COUNT(*) DESC
          LIMIT 1
        )`,
      })
      .from(plantBatch);

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching plant summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant summary" },
      { status: 500 }
    );
  }
}
