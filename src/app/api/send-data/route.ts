// File: src/app/api/send-sensor-data/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { sensorData } from "@/lib/db/schema/sensorData";
import { notifications } from "@/lib/db/schema/notifications";
import { desc, sql, and, eq, gt } from "drizzle-orm";
import { createNotification } from "@/lib/notifications";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await db.insert(sensorData).values({
      time: body.time,
      date: body.date,
      ph: body.ph,
      turbid: body.turbid,
      water_temp: body.water_temp,
      tds: body.tds,
      nitrogen: body.nitrogen,
      phosphorus: body.phosphorus,
      potassium: body.potassium,
      water_level: body.water_level || "HIGH", // Default to HIGH (safe) if missing
    });

    // --- Alert Logic ---
    const phVal = parseFloat(body.ph);
    if (!isNaN(phVal)) {
      if (phVal < 6.0) {
        await createNotification("Critical pH Level", `pH level is dangerously low: ${phVal}.`, "alert");
      } else if (phVal > 9.0) {
        await createNotification("Critical pH Level", `pH level is dangerously high: ${phVal}.`, "alert");
      }
    }

    const waterLevel = body.water_level; // Expecting "LOW" or "HIGH" or "1"/"0"
    if (waterLevel === "LOW" || waterLevel === "0") {
      await createNotification("Low Water Level", "Water level detected as LOW. Check the tank immediately.", "alert");
    }

    // -------------------

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/send-sensor-data failed:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(sensorData)
      .orderBy(desc(sensorData.created_at))
      .limit(20);

    if (rows.length === 0) {
      return NextResponse.json({
        connected: false,
        time: "",
        date: "",
        ph: "",
        turbid: "",
        water_temp: "",
        tds: "",
        nitrogen: "",
        phosphorus: "",
        potassium: "",
        water_level: "",
        created_at: null,
        history: [],
      });
    }

    // Get DB time to ensure comparison is consistent (cancels out timezone diffs)
    const [timeRows]: any = await db.execute(sql`SELECT NOW() as db_now`);
    const dbNow = new Date(timeRows[0].db_now).getTime();

    const lastSensorData = rows[0];
    const lastUpdate = new Date(lastSensorData.created_at).getTime();
    let diff = dbNow - lastUpdate;

    console.log("DEBUG PRE-ADJUST: dbNow=", dbNow, " lastUpdate=", lastUpdate, " diff=", diff);

    // Compensation: If diff is ~ -8 hours (sensor time appears 8h in future vs dbNow)
    // This happens if created_at is Local Time and dbNow is UTC.
    if (diff < -10000000) { // If < -2.7 hours (roughly)
      diff += 28800000; // Add 8 hours (28,800,000 ms)
    }

    console.log("DEBUG POST-ADJUST: diff=", diff);

    // If last update was >15s ago, treat as disconnected
    if (diff > 15000) {

      // --- Offline Alert Logic ---
      // check if we created an "alert" with title "Sensor Offline" in the last 2 minutes.
      // Use application time (Date.now()) to match the 'createdAt' we are now enforcing in createNotification
      const appNow = Date.now();
      const oneMinuteAgo = new Date(appNow - 30 * 60 * 1000);

      console.log("DEBUG OFFLINE CHECK:", {
        appNow: new Date(appNow).toISOString(),
        oneMinuteAgo: oneMinuteAgo.toISOString(),
      });

      const recentAlerts = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.title, "Sensor Offline"),
            gt(notifications.createdAt, oneMinuteAgo)
          )
        )
        .limit(1);

      console.log("DEBUG RECENT ALERTS:", recentAlerts);

      if (recentAlerts.length === 0) {
        console.log("CREATING NEW OFFLINE ALERT");
        await createNotification("Sensor Offline", "Sensors have stopped sending data.", "alert");
      }
      // ---------------------------

      return NextResponse.json({
        connected: false,
        time: "",
        date: "",
        ph: "",
        turbid: "",
        water_temp: "",
        tds: "",
        nitrogen: "",
        phosphorus: "",
        potassium: "",
        created_at: lastSensorData.created_at,
        history: rows,
        debug: {
          dbNowRaw: timeRows[0].db_now,
          dbNowISO: new Date(dbNow).toISOString(),
          lastUpdateISO: new Date(lastUpdate).toISOString(),
          diff: diff
        }
      });
    }

    return NextResponse.json({
      connected: true,
      ...lastSensorData,
      history: rows,
      debug: {
        dbNowRaw: timeRows[0].db_now,
        dbNowISO: new Date(dbNow).toISOString(),
        lastUpdateISO: new Date(lastUpdate).toISOString(),
        diff: diff
      }
    });
  } catch (err) {
    console.error("GET /api/send-sensor-data failed:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
