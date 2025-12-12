import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.pathname.split("/").pop();
    const batchId = Number(idParam);

    if (isNaN(batchId)) {
      return NextResponse.json({ error: "Invalid batch id" }, { status: 400 });
    }

    const batch = await db
      .select()
      .from(plantBatch)
      .where(eq(plantBatch.plantBatchId, batchId))
      .limit(1);

    if (!batch.length) {
      return NextResponse.json(
        { error: "Plant batch not found" },
        { status: 404 }
      );
    }

    const created = new Date(batch[0].dateAdded);
    const ageDays = Math.floor(
      (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({ ...batch[0], plantDays: ageDays });
  } catch (error) {
    console.error("Error fetching plant batch:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant batch" },
      { status: 500 }
    );
  }
}
