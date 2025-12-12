// app/api/sales/monthly/route.ts
import { db } from "@/lib/db/drizzle";
import { fishSales } from "@/lib/db/schema/fishSales";
import { plantSales } from "@/lib/db/schema/plantSales";
import { expenses } from "@/lib/db/schema/expenses";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Fish sales per month
    const fish = await db
      .select({
        month: sql<string>`DATE_FORMAT(${fishSales.saleDate}, '%Y-%m')`,
        total: sql<number>`SUM(${fishSales.totalSaleAmount})`,
      })
      .from(fishSales)
      .groupBy(sql`DATE_FORMAT(${fishSales.saleDate}, '%Y-%m')`);

    // Plant sales per month
    const plant = await db
      .select({
        month: sql<string>`DATE_FORMAT(${plantSales.saleDate}, '%Y-%m')`,
        total: sql<number>`SUM(${plantSales.totalSaleAmount})`,
      })
      .from(plantSales)
      .groupBy(sql`DATE_FORMAT(${plantSales.saleDate}, '%Y-%m')`);

    // Expenses per month
    const expense = await db
      .select({
        month: sql<string>`DATE_FORMAT(${expenses.expenseDate}, '%Y-%m')`,
        total: sql<number>`SUM(${expenses.amount})`,
      })
      .from(expenses)
      .groupBy(sql`DATE_FORMAT(${expenses.expenseDate}, '%Y-%m')`);

    // Merge results into one array
    const months = new Set([
      ...fish.map((f) => f.month),
      ...plant.map((p) => p.month),
      ...expense.map((e) => e.month),
    ]);

    const monthlyData = Array.from(months)
      .sort()
      .map((m) => ({
        month: m,
        fish_sales: Number(fish.find((f) => f.month === m)?.total ?? 0),
        plant_sales: Number(plant.find((p) => p.month === m)?.total ?? 0),
        expenses: Number(expense.find((e) => e.month === m)?.total ?? 0),
      }));

    // Limit to last 12 months
    const last12 = monthlyData.slice(-12);

    return Response.json(last12);
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    return Response.json(
      { error: "Failed to fetch monthly data" },
      { status: 500 }
    );
  }
}
