
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { sql } from "drizzle-orm";

async function checkCounts() {
    console.log("--- Fish Batches ---");
    const fish = await db.select().from(fishBatch);
    const fishStatusCounts: Record<string, number> = {};
    fish.forEach(b => {
        const s = b.batchStatus || 'null';
        fishStatusCounts[s] = (fishStatusCounts[s] || 0) + 1;
    });
    console.table(fishStatusCounts);
    console.log("Total Fish Batches in DB:", fish.length);

    console.log("\n--- Plant Batches ---");
    const plants = await db.select().from(plantBatch);
    const plantStatusCounts: Record<string, number> = {};
    plants.forEach(b => {
        const s = b.batchStatus || 'null';
        plantStatusCounts[s] = (plantStatusCounts[s] || 0) + 1;
    });
    console.table(plantStatusCounts);
    console.log("Total Plant Batches in DB:", plants.length);
}

checkCounts().catch(console.error).finally(() => process.exit(0));
