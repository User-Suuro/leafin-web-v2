
import { db } from "@/lib/db/drizzle";
import { feederSettings } from "@/lib/db/schema/feederSetting";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await db.select().from(feederSettings).limit(1);

        if (result.length === 0) {
            // Initialize if empty
            const defaultSettings = {
                isActive: true,
                frequencyPerDay: 3,
                schedules: JSON.stringify(["07:00", "12:00", "17:00"]),
                feedQuantity: 10,
            };
            await db.insert(feederSettings).values(defaultSettings);
            return NextResponse.json({ ...defaultSettings, id: 1 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Error fetching feeder settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch feeder settings" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, data } = body;

        if (type === "update_settings") {
            await db
                .update(feederSettings)
                .set({
                    isActive: data.isActive,
                    frequencyPerDay: data.frequencyPerDay,
                    feedQuantity: data.feedQuantity,
                    schedules: data.schedules, // Assuming string (JSON)
                })
                .where(eq(feederSettings.id, 1));
            return NextResponse.json({ success: true });
        }

        // Future expansion for manual feed logic
        if (type === "manual_feed") {
            // logic to trigger hardware or log event
            // for now just update last feed time
            const now = new Date().toISOString();
            await db
                .update(feederSettings)
                .set({
                    lastFeedTime: now
                })
                .where(eq(feederSettings.id, 1));
            return NextResponse.json({ success: true, message: "Fed successfully" });
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    } catch (error) {
        console.error("Error updating feeder settings:", error);
        return NextResponse.json(
            { error: "Failed to update feeder settings" },
            { status: 500 }
        );
    }
}
