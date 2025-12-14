
import { fetch } from "bun";

async function testFeeder() {
    const baseUrl = "http://localhost:3000/api/motor";

    // Mock session headers - this might fail if auth requires real cookies/headers.
    // For this environment, we might need a real session or just assume the dev environment allows checking DB directly 
    // or we skip auth in the test if we can't easily mock it. 
    // However, the route uses `auth.api.getSession`, which is hard to mock from outside.
    // I will try to call the API, but expect 401 if I can't forge headers.
    // Alternatively, I can just check the DB schema directly to see if 'feeder' column exists

    console.log("Checking DB schema for 'feeder' column...");
    // Direct DB check is better.

    try {
        const { db } = await import("../src/lib/db/drizzle");
        const { motor } = await import("../src/lib/db/schema/motor");

        // Try to select
        let result = await db.select().from(motor).limit(1);

        if (result.length === 0) {
            console.log("Table empty, attempting insert...");
            await db.insert(motor).values({
                id: 1,
                main_pump: false,
                feeder: false,
                updated_at: new Date().toISOString()
            });
            result = await db.select().from(motor).limit(1);
        }

        console.log("Current motor state:", result[0]);

        if (result[0] && 'feeder' in result[0]) {
            console.log("SUCCESS: 'feeder' column exists.");
        } else {
            console.log("FAILURE: 'feeder' column MISSING.");
        }
    } catch (e) {
        console.error("Error accessing DB:", e);
    }
    process.exit(0);
}

testFeeder();
