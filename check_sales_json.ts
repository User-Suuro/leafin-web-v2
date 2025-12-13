
import { db } from "@/lib/db/drizzle";
import { fishSales } from "@/lib/db/schema/fishSales";
import { plantSales } from "@/lib/db/schema/plantSales";
import { expenses } from "@/lib/db/schema/expenses";
import { sql } from "drizzle-orm";

async function checkData() {
    console.log("--- Daily Aggregation (JSON) ---");
    const dailyStats: Record<string, { fish: number, plant: number, exp: number }> = {};

    const f = await db.select().from(fishSales);
    const p = await db.select().from(plantSales);
    const e = await db.select().from(expenses);

    f.forEach(item => {
        const d = new Date(item.saleDate).toISOString().split('T')[0];
        if (!dailyStats[d]) dailyStats[d] = { fish: 0, plant: 0, exp: 0 };
        dailyStats[d].fish += Number(item.totalSaleAmount);
    });

    p.forEach(item => {
        const d = new Date(item.saleDate).toISOString().split('T')[0];
        if (!dailyStats[d]) dailyStats[d] = { fish: 0, plant: 0, exp: 0 };
        dailyStats[d].plant += Number(item.totalSaleAmount);
    });

    e.forEach(item => {
        const d = new Date(item.expenseDate).toISOString().split('T')[0];
        if (!dailyStats[d]) dailyStats[d] = { fish: 0, plant: 0, exp: 0 };
        dailyStats[d].exp += Number(item.amount);
    });

    console.log(JSON.stringify(dailyStats, null, 2));
}

checkData().catch(console.error).finally(() => process.exit(0));
