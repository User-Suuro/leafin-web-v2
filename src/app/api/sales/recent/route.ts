// app/api/sales/recent/route.ts
import { db } from "@/lib/db/drizzle";
import { fishSales } from "@/lib/db/schema/fishSales";
import { plantSales } from "@/lib/db/schema/plantSales";
import { desc, sql } from "drizzle-orm";

export async function GET() {
  const fish = await db
    .select({
      id: fishSales.fishSaleId,
      date: fishSales.saleDate,
      product: sql`'Fish'`,
      total: fishSales.totalSaleAmount,
      customer: fishSales.customerName,
    })
    .from(fishSales)
    .orderBy(desc(fishSales.saleDate))
    .limit(5);

  const plant = await db
    .select({
      id: plantSales.plantSaleId,
      date: plantSales.saleDate,
      product: sql`'Plant'`,
      total: plantSales.totalSaleAmount,
      customer: plantSales.customerName,
    })
    .from(plantSales)
    .orderBy(desc(plantSales.saleDate))
    .limit(5);

  const recent = [...fish, ...plant].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return Response.json(
    recent.slice(0, 10).map((r) => ({
      ...r,
      uid: `${r.product}-${r.id}`, // unique identifier
    }))
  );
}
