import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { fishSales } from "@/lib/db/schema/fishSales";
import { plantSales } from "@/lib/db/schema/plantSales";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const body = (await req.json()) as {
      type: "fish" | "plant";
      batchId: number;
      customerName: string;
      totalAmount: number;
      notes?: string;
    };

    const { type, batchId, customerName, totalAmount, notes } = body;

    if (
      !batchId ||
      !type ||
      !customerName ||
      !totalAmount ||
      totalAmount <= 0
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const batchTable = type === "fish" ? fishBatch : plantBatch;
    const idColumn =
      type === "fish" ? fishBatch.fishBatchId : plantBatch.plantBatchId;

    // Fetch batch
    const [batch] = await db
      .select()
      .from(batchTable)
      .where(eq(idColumn, batchId));
    if (!batch)
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    // Update batch status
    await db
      .update(batchTable)
      .set({ batchStatus: "harvested" })
      .where(eq(idColumn, batchId));

    const today = new Date();
    const amountStr = totalAmount.toFixed(2); // convert number to string with 2 decimals

    if (type === "fish") {
      const result = await db.insert(fishSales).values({
        fishBatchId: batchId,
        saleDate: today,
        totalSaleAmount: amountStr, // <-- string
        customerName,
        notes: notes || "",
      });

      if (session?.user?.id) {
        await logAction(
          session.user.id,
          "CREATE",
          "SALES",
          {
            batchId,
            type: "fish",
            customerName,
            totalAmount: amountStr,
            notes,
            fishSaleId: Number(result[0].insertId),
          },
          String(result[0].insertId),
          `Harvested Fish Batch #${batchId}: Sold to ${customerName} for ${amountStr}`
        );
      }
    } else {
      const result = await db.insert(plantSales).values({
        plantBatchId: batchId,
        saleDate: today,
        totalSaleAmount: amountStr, // <-- string
        customerName,
        notes: notes || "",
      });

      if (session?.user?.id) {
        await logAction(
          session.user.id,
          "CREATE",
          "SALES",
          {
            batchId,
            type: "plant",
            customerName,
            totalAmount: amountStr,
            notes,
            plantSaleId: Number(result[0].insertId),
          },
          String(result[0].insertId),
          `Harvested Plant Batch #${batchId}: Sold to ${customerName} for ${amountStr}`
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Harvest error:", error);
    return NextResponse.json(
      { error: "Failed to harvest batch", details: (error as Error).message },
      { status: 500 }
    );
  }
}
