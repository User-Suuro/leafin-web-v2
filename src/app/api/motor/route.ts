
import { db } from "@/lib/db/drizzle";
import { motor } from "@/lib/db/schema/motor";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await db.select().from(motor).limit(1);

        if (result.length === 0) {
            // Initialize if empty, assuming ID 1
            await db.insert(motor).values({
                id: 1,
                main_pump: false,
                mini_pump: false,
                updated_at: new Date().toISOString(),
            });
            return NextResponse.json({ main_pump: false, mini_pump: false });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Error fetching motor status:", error);
        return NextResponse.json({ error: "Failed to fetch motor status" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, status } = body;

        if ((type !== "main_pump" && type !== "mini_pump") || typeof status !== "boolean") {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        await db
            .update(motor)
            .set({
                [type]: status,
                updated_at: new Date().toISOString(),
            })
            .where(eq(motor.id, 1));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating motor status:", error);
        return NextResponse.json({ error: "Failed to update motor status" }, { status: 500 });
    }
}
