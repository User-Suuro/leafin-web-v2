import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    // Extract batchId from URL
    const url = new URL(req.url);
    const idParam = url.pathname.split("/").pop(); // gets last part of URL
    const batchId = Number(idParam);

    if (isNaN(batchId)) {
      return NextResponse.json({ error: "Invalid batch id" }, { status: 400 });
    }

    const batch = await db
      .select()
      .from(fishBatch)
      .where(eq(fishBatch.fishBatchId, batchId))
      .limit(1);

    if (!batch.length) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    const created = new Date(batch[0].dateAdded);
    const ageDays = Math.floor(
      (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({ ...batch[0], fishDays: ageDays });
  } catch (error) {
    console.error("Error fetching batch:", error);
    return NextResponse.json(
      { error: "Failed to fetch batch" },
      { status: 500 }
    );
  }
}
