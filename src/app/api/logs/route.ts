import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { logs } from "@/lib/db/schema/logs";
import { tasks } from "@/lib/db/schema/tasks";
import { fishSales } from "@/lib/db/schema/fishSales";
import { plantSales } from "@/lib/db/schema/plantSales";
import { expenses } from "@/lib/db/schema/expenses";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        logId: logs.logId,
        eventTime: logs.eventTime,
        notes: logs.notes,

        // ✅ check which relation exists
        taskId: logs.taskId,
        fishSaleId: logs.relatedFishSaleId,
        plantSaleId: logs.relatedPlantSaleId,
        expenseId: logs.relatedExpenseId,
        fishBatchId: logs.fishBatchId,
        plantBatchId: logs.plantBatchId,

        // ✅ corrected joins
        taskTitle: tasks.title, // instead of taskName
        expenseAmount: expenses.amount,
      })
      .from(logs)
      .leftJoin(tasks, eq(logs.taskId, tasks.taskId))
      .leftJoin(fishSales, eq(logs.relatedFishSaleId, fishSales.fishSaleId))
      .leftJoin(plantSales, eq(logs.relatedPlantSaleId, plantSales.plantSaleId))
      .leftJoin(expenses, eq(logs.relatedExpenseId, expenses.expenseId))
      .leftJoin(fishBatch, eq(logs.fishBatchId, fishBatch.fishBatchId))
      .leftJoin(plantBatch, eq(logs.plantBatchId, plantBatch.plantBatchId))
      .orderBy(sql`event_time DESC`);

    // ✅ Normalize logs into a `type`
    const formatted = result.map((row) => {
      let type: "task" | "fish_sale" | "plant_sale" | "expense" | "sensor" =
        "task";

      if (row.fishSaleId) type = "fish_sale";
      else if (row.plantSaleId) type = "plant_sale";
      else if (row.expenseId) type = "expense";
      else if (!row.taskId) type = "sensor"; // fallback

      return {
        log_id: row.logId,
        event_time: row.eventTime,
        notes: row.notes ?? row.taskTitle ?? "", // use notes or fallback to task title
        type,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
