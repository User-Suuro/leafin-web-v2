
import { db } from "./src/lib/db/drizzle";
import { notifications } from "./src/lib/db/schema/notifications";
import { sensorData } from "./src/lib/db/schema/sensorData";
import { desc } from "drizzle-orm";

async function main() {
    console.log("--- Checking Notifications ---");
    const notes = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(10);
    notes.forEach(n => {
        console.log(`[${n.id}] ${n.type} - ${n.title} - ${n.createdAt} (Read: ${n.isRead})`);
    });

    console.log("\n--- Checking Last Sensor Data ---");
    const lastSensor = await db.select().from(sensorData).orderBy(desc(sensorData.created_at)).limit(1);
    if (lastSensor.length > 0) {
        console.log(`Last Sensor Data: ${lastSensor[0].created_at}`);
    } else {
        console.log("No sensor data found.");
    }
}

main().catch(console.error).then(() => process.exit(0));
