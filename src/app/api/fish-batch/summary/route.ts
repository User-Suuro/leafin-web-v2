import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        // ✅ total batches
        totalBatches: sql<number>`COUNT(*)`,

        // ✅ total fish based on fishQuantity
        totalFish: sql<number>`SUM(${fishBatch.fishQuantity})`,

        // ✅ average age using dateAdded
        avgAge: sql<number>`AVG(DATEDIFF(CURDATE(), ${fishBatch.dateAdded}))`,

        // ✅ majority stage (batchStatus)
        majorityStage: sql<string>`(
          SELECT ${fishBatch.batchStatus}
          FROM ${fishBatch}
          GROUP BY ${fishBatch.batchStatus}
          ORDER BY COUNT(*) DESC
          LIMIT 1
        )`,
      })
      .from(fishBatch);

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching fish summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch fish summary" },
      { status: 500 }
    );
  }
}
