
import { db } from "@/lib/db/drizzle";
import { fishSales } from "@/lib/db/schema/fishSales";
import { plantSales } from "@/lib/db/schema/plantSales";
import { expenses } from "@/lib/db/schema/expenses";
import { sql } from "drizzle-orm";

async function checkData() {
    console.log("--- Raw Data Counts ---");
    const f = await db.select().from(fishSales);
    const p = await db.select().from(plantSales);
    const e = await db.select().from(expenses);
    console.log(`Fish Sales: ${f.length}`);
    console.log(`Plant Sales: ${p.length}`);
    console.log(`Expenses: ${e.length}`);

    if (f.length > 0) console.log("Sample Fish Sale:", f[0]);
    if (p.length > 0) console.log("Sample Plant Sale:", p[0]);
    if (e.length > 0) console.log("Sample Expense:", e[0]);

    console.log("\n--- Daily Aggregation (JS Calc) ---");
    // Simple aggregation to check
    const dailyStats: Record<string, { fish: number, plant: number, exp: number }> = {};

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

    console.table(dailyStats);
}

checkData().catch(console.error).finally(() => process.exit(0));
