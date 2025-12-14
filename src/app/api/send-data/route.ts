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
      water_level: body.water_level || "HIGH",
    });

    // --- Alert Logic ---
    const phVal = parseFloat(body.ph);
    if (!isNaN(phVal)) {
      if (phVal < 6.0) {
        await createNotification("Critical pH Level", `pH level is dangerously low: ${phVal}. Low pH can stall biofiltration and cause acidosis.`, "alert");
      } else if (phVal > 9.0) {
        await createNotification("Critical pH Level", `pH level is dangerously high: ${phVal}. High pH drastically increases ammonia toxicity, distinct direct threat to fish health.`, "alert");
      }
    }

    const waterLevel = body.water_level;
    if (waterLevel === "LOW" || waterLevel === "0") {
      await createNotification("Low Water Level", "Water level detected as LOW. Check the tank immediately.", "alert");
    }

    const nVal = parseFloat(body.nitrogen);
    if (!isNaN(nVal)) {
      if (nVal < 20) {
        await createNotification("Low Nitrogen", `Nitrogen level is low: ${nVal} mg/L. May cause stunted growth.`, "warning");
      } else if (nVal > 100) {
        await createNotification("High Nitrogen", `Nitrogen level is high: ${nVal} mg/L. Potential toxicity or imbalance.`, "alert");
      }
    }

    const pVal = parseFloat(body.phosphorus);
    if (!isNaN(pVal)) {
      if (pVal < 10) {
        await createNotification("Low Phosphorus", `Phosphorus level is low: ${pVal} mg/L. May affect root and flower development.`, "warning");
      } else if (pVal > 100) {
        await createNotification("High Phosphorus", `Phosphorus level is high: ${pVal} mg/L. Can lock out other nutrients.`, "alert");
      }
    }

    const kVal = parseFloat(body.potassium);
    if (!isNaN(kVal)) {
      if (kVal < 20) {
        await createNotification("Low Potassium", `Potassium level is low: ${kVal} mg/L. Essential for plant immunity and quality.`, "warning");
      } else if (kVal > 200) {
        await createNotification("High Potassium", `Potassium level is high: ${kVal} mg/L. May interfere with Calcium/Magnesium uptake.`, "alert");
      }
    }

    const tempVal = parseFloat(body.water_temp);
    if (!isNaN(tempVal)) {
      if (tempVal < 20) {
        await createNotification("Low Water Temperature", `Water temperature is low: ${tempVal}°C. Metabolism slows, fish may stop eating.`, "warning");
      } else if (tempVal > 30) {
        await createNotification("High Water Temperature", `Water temperature is high: ${tempVal}°C. Oxygen levels may drop, causing stress.`, "alert");
      }
    }
    // -----------------------

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
    if (diff < -10000000) { // If < -2.7 hours (roughly)
      diff += 28800000; // Add 8 hours (28,800,000 ms)
    }

    console.log("DEBUG POST-ADJUST: diff=", diff);

    // If last update was >20s ago, treat as disconnected
    if (diff > 20000) {

      // --- Offline Alert Logic ---
      // check if we created an "alert" with title "Sensor Offline" in the last 1 minutes.
      const appNow = Date.now();
      const oneMinuteAgo = new Date(appNow - 30 * 60 * 1000); // 1 minute ago

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
