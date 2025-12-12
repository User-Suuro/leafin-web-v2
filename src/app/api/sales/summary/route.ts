// app/api/sales/summary/route.ts
import { db } from "@/lib/db/drizzle";
import { fishSales } from "@/lib/db/schema/fishSales";
import { plantSales } from "@/lib/db/schema/plantSales";
import { expenses } from "@/lib/db/schema/expenses";
import { sql, and, gte, lte } from "drizzle-orm";

export async function GET() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Fish sales
  const fishRevenue = await db
    .select({ total: sql`SUM(${fishSales.totalSaleAmount})` })
    .from(fishSales)
    .where(
      and(gte(fishSales.saleDate, firstDay), lte(fishSales.saleDate, lastDay))
    );

  // Plant sales
  const plantRevenue = await db
    .select({ total: sql`SUM(${plantSales.totalSaleAmount})` })
    .from(plantSales)
    .where(
      and(gte(plantSales.saleDate, firstDay), lte(plantSales.saleDate, lastDay))
    );

  // Expenses
  const totalExpenses = await db
    .select({ total: sql`SUM(${expenses.amount})` })
    .from(expenses)
    .where(
      and(
        gte(expenses.expenseDate, firstDay),
        lte(expenses.expenseDate, lastDay)
      )
    );

  const revenue =
    Number(fishRevenue[0].total ?? 0) + Number(plantRevenue[0].total ?? 0);
  const expense = Number(totalExpenses[0].total ?? 0);
  const netProfit = revenue - expense;
  const roi = expense > 0 ? (netProfit / expense) * 100 : 0;

  return Response.json({
    revenue,
    expense,
    netProfit,
    roi,
  });
}
