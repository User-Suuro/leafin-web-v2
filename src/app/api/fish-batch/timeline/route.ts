// app/api/fish-batch/timeline/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";

export async function GET() {
  try {
    // Fetch batches sorted by dateAdded
    const batches = await db
      .select()
      .from(fishBatch)
      .orderBy(fishBatch.dateAdded);

    const withTimeline = batches.map((b) => {
      const created = new Date(b.dateAdded);
      const fishDays = Math.floor(
        (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
      );

      // expected harvest date = dateAdded + fishDays (or + fixed cycle days if gusto mo)
      const expectedHarvestDate = new Date(created);
      expectedHarvestDate.setDate(created.getDate() + fishDays);

      return {
        id: b.fishBatchId,
        quantity: b.fishQuantity,
        fishDays,
        dateAdded: created,
        condition: b.condition,
        expectedHarvestDate,
      };
    });

    return NextResponse.json(withTimeline);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch fish batch timeline." },
      { status: 500 }
    );
  }
}
