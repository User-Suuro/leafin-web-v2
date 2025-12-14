
import { fetch } from "bun";
import { db } from "../src/lib/db/drizzle";
import { notifications } from "../src/lib/db/schema/notifications";
import { desc } from "drizzle-orm";

async function runTest() {
    const baseUrl = "http://localhost:3000/api";
    const commonData = {
        time: "12:00:00",
        date: "2024-01-01",
        turbid: "10",
        water_temp: "25",
        tds: "500",
        nitrogen: "10",
        phosphorus: "5",
        potassium: "5",
        water_level: "HIGH"
    };

    console.log("--- Sending High pH (9.5) ---");
    await fetch(`${baseUrl}/send-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...commonData, ph: "9.5" }),
    });

    console.log("--- Sending Low pH (5.5) ---");
    await fetch(`${baseUrl}/send-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...commonData, ph: "5.5" }),
    });

    console.log("--- Sending Normal pH (7.0) ---");
    await fetch(`${baseUrl}/send-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...commonData, ph: "7.0" }),
    });

    // Give the server a moment
    await new Promise(r => setTimeout(r, 1000));

    console.log("\n--- Checking Notifications in DB ---");
    try {
        const recent = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(5);

        console.log("Found " + recent.length + " recent notifications:");
        recent.forEach((n) => {
            console.log(`[${n.type}] ${n.title}: ${n.message}`);
        });
    } catch (e) {
        console.log("Error querying DB:", e);
    }
    process.exit(0);
}

runTest();
