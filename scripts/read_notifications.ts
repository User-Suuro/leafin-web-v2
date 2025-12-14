
import { db } from "../src/lib/db/drizzle";
import { notifications } from "../src/lib/db/schema/notifications";
import { desc } from "drizzle-orm";

async function check() {
    console.log("\n--- Checking Notifications in DB ---");
    try {
        const recent = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(10);

        console.log("Found " + recent.length + " recent notifications:");
        recent.forEach((n) => {
            console.log(`[${n.type}] ${n.title}: ${n.message}`);
        });
    } catch (e) {
        console.log("Error querying DB:", e);
    }
    process.exit(0);
}

check();
