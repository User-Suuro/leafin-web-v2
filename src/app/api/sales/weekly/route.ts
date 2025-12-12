// app/api/sales/weekly/route.ts
import { db } from "@/lib/db/drizzle";
import { fishSales } from "@/lib/db/schema/fishSales";
import { plantSales } from "@/lib/db/schema/plantSales";
import { expenses } from "@/lib/db/schema/expenses";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Fish sales per week
    const fish = await db
      .select({
        week: sql<string>`DATE_FORMAT(${fishSales.saleDate}, '%x-W%v')`, // consistent format e.g. 2025-W35
        total: sql<number>`SUM(${fishSales.totalSaleAmount})`,
      })
      .from(fishSales)
      .groupBy(sql`DATE_FORMAT(${fishSales.saleDate}, '%x-W%v')`);

    // Plant sales per week
    const plant = await db
      .select({
        week: sql<string>`DATE_FORMAT(${plantSales.saleDate}, '%x-W%v')`,
        total: sql<number>`SUM(${plantSales.totalSaleAmount})`,
      })
      .from(plantSales)
      .groupBy(sql`DATE_FORMAT(${plantSales.saleDate}, '%x-W%v')`);

    // Expenses per week
    const expense = await db
      .select({
        week: sql<string>`DATE_FORMAT(${expenses.expenseDate}, '%x-W%v')`,
        total: sql<number>`SUM(${expenses.amount})`,
      })
      .from(expenses)
      .groupBy(sql`DATE_FORMAT(${expenses.expenseDate}, '%x-W%v')`);

    // Merge results
    const weeks = new Set([
      ...fish.map((f) => f.week),
      ...plant.map((p) => p.week),
      ...expense.map((e) => e.week),
    ]);

    const weeklyData = Array.from(weeks)
      .sort()
      .map((w) => ({
        week: w,
        fish_sales: Number(fish.find((f) => f.week === w)?.total ?? 0),
        plant_sales: Number(plant.find((p) => p.week === w)?.total ?? 0),
        expenses: Number(expense.find((e) => e.week === w)?.total ?? 0),
      }));

    // Limit to last 12 weeks
    const last12 = weeklyData.slice(-12);

    return Response.json(last12);
  } catch (error) {
    console.error("Error fetching weekly data:", error);
    return Response.json(
      { error: "Failed to fetch weekly data" },
      { status: 500 }
    );
  }
}
