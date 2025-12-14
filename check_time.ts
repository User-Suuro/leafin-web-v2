
import { db } from "./src/lib/db/drizzle";
import { sensorData } from "./src/lib/db/schema/sensorData";
import { desc, sql } from "drizzle-orm";

async function check() {
    // Check DB Time
    const timeResult = await db.execute(sql`SELECT NOW() as db_now`);
    // @ts-ignore
    const dbNowRaw = timeResult[0][0].db_now;
    const dbNow = new Date(dbNowRaw).getTime();

    const rows = await db
        .select()
        .from(sensorData)
        .orderBy(desc(sensorData.created_at))
        .limit(1);

    if (rows.length === 0) {
        console.log("No data");
        return;
    }
    const last = rows[0];
    const createdDate = new Date(last.created_at);
    const lastUpdate = createdDate.getTime();

    console.log("--- DEBUG INFO ---");
    console.log("DB NOW() Raw:      ", dbNowRaw);
    console.log("DB NOW() Timestamp:", dbNow);
    console.log("Last Created Raw:  ", last.created_at);
    console.log("Last Created TS:   ", lastUpdate);
    console.log("Diff (DB - Last):  ", dbNow - lastUpdate);
    console.log("Is Online? (<15s): ", (dbNow - lastUpdate) <= 15000);
    process.exit(0);
}

check();
