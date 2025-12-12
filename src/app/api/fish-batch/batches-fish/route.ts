// app/api/fish-batch/batches-fish/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const batches = await db
      .select({
        id: fishBatch.fishBatchId,
        name: sql<string>`CONCAT('Batch #', ${fishBatch.fishBatchId})`,
      })
      .from(fishBatch);
    return NextResponse.json(batches);
  } catch (error) {
    console.error("Error fetching fish batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch fish batches" },
      { status: 500 }
    );
  }
}
