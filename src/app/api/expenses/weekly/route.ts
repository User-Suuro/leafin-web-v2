// app/api/expenses/weekly/route.ts
import { db } from "@/lib/db/drizzle";
import { expenses } from "@/lib/db/schema/expenses";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Build a week label like "2025-W03" using YEARWEEK (ISO mode = 1)
    // Avoid DATE_FORMAT %x/%v for broader compatibility.
    const weekly = await db
      .select({
        week: sql<string>`
          CONCAT(
            YEARWEEK(${expenses.expenseDate}, 1) DIV 100,
            '-W',
            LPAD(YEARWEEK(${expenses.expenseDate}, 1) % 100, 2, '0')
          )
        `,
        total: sql<number>`SUM(${expenses.amount})`,
      })
      .from(expenses).groupBy(sql`
        CONCAT(
          YEARWEEK(${expenses.expenseDate}, 1) DIV 100,
          '-W',
          LPAD(YEARWEEK(${expenses.expenseDate}, 1) % 100, 2, '0')
        )
      `).orderBy(sql`
        CONCAT(
          YEARWEEK(${expenses.expenseDate}, 1) DIV 100,
          '-W',
          LPAD(YEARWEEK(${expenses.expenseDate}, 1) % 100, 2, '0')
        )
      `);

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
