
import { db } from "@/lib/db/drizzle";
import { motor } from "@/lib/db/schema/motor";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Added import
import { headers } from "next/headers"; // Added import
import { logAction } from "@/lib/logger"; // Added import

export async function GET() {
    try {
        const result = await db.select().from(motor).limit(1);

        if (result.length === 0) {
            await db.insert(motor).values({
                id: 1,
                main_pump: false,
                feeder: false,
                updated_at: new Date().toISOString(),
            });
            return NextResponse.json({ main_pump: false, feeder: false });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Error fetching motor status:", error);
        return NextResponse.json({ error: "Failed to fetch motor status" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { type, status } = body;

        const validTypes = ["main_pump", "feeder"];
        if (!validTypes.includes(type) || typeof status !== "boolean") {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        await db
            .update(motor)
            .set({
                [type]: status,
                updated_at: new Date().toISOString(),
            })
            .where(eq(motor.id, 1));

        await logAction(
            session.user.id,
            "UPDATE",
            "SENSOR",
            { action: "TOGGLE_MOTOR", device: type, status },
            "1",
            `Toggled ${type} ${status ? "ON" : "OFF"}`
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating motor status:", error);
        return NextResponse.json({ error: "Failed to update motor status" }, { status: 500 });
    }
}
