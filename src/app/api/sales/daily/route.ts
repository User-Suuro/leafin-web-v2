// app/api/sales/daily/route.ts
import { db } from "@/lib/db/drizzle";
import { fishSales } from "@/lib/db/schema/fishSales";
import { plantSales } from "@/lib/db/schema/plantSales";
import { expenses } from "@/lib/db/schema/expenses";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Fish sales per day
    const fish = await db
      .select({
        day: sql<string>`DATE_FORMAT(${fishSales.saleDate}, '%Y-%m-%d')`,
        total: sql<number>`SUM(${fishSales.totalSaleAmount})`,
      })
      .from(fishSales)
      .groupBy(sql`DATE_FORMAT(${fishSales.saleDate}, '%Y-%m-%d')`);

    // Plant sales per day
    const plant = await db
      .select({
        day: sql<string>`DATE_FORMAT(${plantSales.saleDate}, '%Y-%m-%d')`,
        total: sql<number>`SUM(${plantSales.totalSaleAmount})`,
      })
      .from(plantSales)
      .groupBy(sql`DATE_FORMAT(${plantSales.saleDate}, '%Y-%m-%d')`);

    // Expenses per day
    const expense = await db
      .select({
        day: sql<string>`DATE_FORMAT(${expenses.expenseDate}, '%Y-%m-%d')`,
        total: sql<number>`SUM(${expenses.amount})`,
      })
      .from(expenses)
      .groupBy(sql`DATE_FORMAT(${expenses.expenseDate}, '%Y-%m-%d')`);

    // Merge results
    const days = new Set([
      ...fish.map((f) => f.day),
      ...plant.map((p) => p.day),
      ...expense.map((e) => e.day),
    ]);

    const dailyData = Array.from(days)
      .sort()
      .map((d) => ({
        day: d,
        fish_sales: Number(fish.find((f) => f.day === d)?.total ?? 0),
        plant_sales: Number(plant.find((p) => p.day === d)?.total ?? 0),
        expenses: Number(expense.find((e) => e.day === d)?.total ?? 0),
      }));

    // Limit to last 30 days (pwede mo adjust)
    const last30 = dailyData.slice(-30);

    return Response.json(last30);
  } catch (error) {
    console.error("Error fetching daily data:", error);
    return Response.json(
      { error: "Failed to fetch daily data" },
      { status: 500 }
    );
  }
}
