// app/api/expenses/monthly/route.ts
import { db } from "@/lib/db/drizzle";
import { expenses } from "@/lib/db/schema/expenses";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Same exact expression in SELECT and GROUP BY (style matches your sales/monthly)
    const monthly = await db
      .select({
        month: sql<string>`DATE_FORMAT(${expenses.expenseDate}, '%Y-%m')`,
        total: sql<number>`SUM(${expenses.amount})`,
      })
      .from(expenses)
      .groupBy(sql`DATE_FORMAT(${expenses.expenseDate}, '%Y-%m')`)
      .orderBy(sql`DATE_FORMAT(${expenses.expenseDate}, '%Y-%m')`);

    // (Optional) keep last 12 months only
    const last12 = monthly.slice(-12);

    return Response.json(last12);
  } catch (error) {
    console.error("Error fetching monthly expenses:", error);
    return Response.json(
      { error: "Failed to fetch monthly expenses" },
      { status: 500 }
    );
  }
}
