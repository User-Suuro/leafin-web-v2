// app/api/plant-batch/batches-plant/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const batches = await db
      .select({
        id: plantBatch.plantBatchId,
        name: sql<string>`CONCAT('Batch #', ${plantBatch.plantBatchId})`,
      })
      .from(plantBatch)
      .where(eq(plantBatch.condition, "Vegetative Growth"));

    return NextResponse.json(batches);
  } catch (error) {
    console.error("Error fetching plant batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant batches" },
      { status: 500 }
    );
  }
}
