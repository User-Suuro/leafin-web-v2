// app/api/expenses/weekly/route.ts
import { db } from "@/lib/db/drizzle";
import { expenses } from "@/lib/db/schema/expenses";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Build a week label like "2025-W03" using DATE_FORMAT %x-W%v
    // matching sales/weekly/route.ts
    const weekly = await db
      .select({
        week: sql<string>`DATE_FORMAT(${expenses.expenseDate}, '%x-W%v')`,
        total: sql<number>`SUM(${expenses.amount})`,
      })
      .from(expenses)
      .groupBy(sql`DATE_FORMAT(${expenses.expenseDate}, '%x-W%v')`)
      .orderBy(sql`DATE_FORMAT(${expenses.expenseDate}, '%x-W%v')`);

    // (Optional) keep last 12 weeks only
    const last12 = weekly.slice(-12);

    return Response.json(last12);
  } catch (error) {
    console.error("Error fetching weekly expenses:", error);
    return Response.json(
      { error: "Failed to fetch weekly expenses" },
      { status: 500 }
    );
  }
}
