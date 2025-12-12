import { db } from "@/lib/db/drizzle";
import { expenses } from "@/lib/db/schema/expenses";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const daily = await db
      .select({
        day: sql<string>`DATE(${expenses.expenseDate})`,
        total: sql<number>`SUM(${expenses.amount})`,
      })
      .from(expenses)
      .groupBy(sql`DATE(${expenses.expenseDate})`)
      .orderBy(sql`DATE(${expenses.expenseDate})`);

    return Response.json(daily);
  } catch (error) {
    console.error("Error fetching daily expenses:", error);
    return Response.json(
      { error: "Failed to fetch daily expenses" },
      { status: 500 }
    );
  }
}
