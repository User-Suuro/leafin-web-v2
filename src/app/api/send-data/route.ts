// File: src/app/api/send-sensor-data/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { sensorData } from "@/lib/db/schema/sensorData";
import { desc } from "drizzle-orm";

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
      float_switch: body.float_switch,
      nh3_gas: body.nh3_gas,
    });

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
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({
        connected: false,
        time: "",
        date: "",
        ph: "",
        turbid: "",
        water_temp: "",
        tds: "",
        float_switch: false,
        nh3_gas: "",
        created_at: null,
      });
    }

    const lastSensorData = rows[0];
    const now = Date.now();
    const lastUpdate = new Date(lastSensorData.created_at).getTime();

    // If last update was >20s ago, treat as disconnected
    if (now - lastUpdate > 20000) {
      return NextResponse.json({
        connected: false,
        time: "",
        date: "",
        ph: "",
        turbid: "",
        water_temp: "",
        tds: "",
        float_switch: false,
        nh3_gas: "",
        created_at: lastSensorData.created_at,
      });
    }

    return NextResponse.json({
      connected: true,
      ...lastSensorData, // includes created_at directly
    });
  } catch (err) {
    console.error("GET /api/send-sensor-data failed:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
