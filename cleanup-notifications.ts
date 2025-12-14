
import { db } from "./src/lib/db/drizzle";
import { notifications } from "./src/lib/db/schema/notifications";

async function main() {
    console.log("--- Clearing Notifications ---");
    await db.delete(notifications);
    console.log("Notifications cleared.");
}

main().catch(console.error).then(() => process.exit(0));
