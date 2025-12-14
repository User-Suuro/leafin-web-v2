import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { notifications } from "@/lib/db/schema/notifications";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { desc, eq, or, isNull, and } from "drizzle-orm";

export const dynamic = 'force-dynamic';

// GET: Fetch notifications for the user + system wide
export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        // If no user, maybe just return empty or system wide?
        // Let's assume we want to show system alerts even if not logged in? 
        // Or strictly for logged in users.
        // Given the requirement is for "users", we'll check session. 
        // BUT for "all users", we might want to allow checking without auth if it's a critical system alert?
        // For now, let's enforce auth for the UI bell.

        if (!session?.user?.id) {
            return NextResponse.json([], { status: 401 });
        }

        const userId = session.user.id;

        const notes = await db
            .select()
            .from(notifications)
            .where(
                or(
                    eq(notifications.userId, userId),
                    isNull(notifications.userId)
                )
            )
            .orderBy(desc(notifications.createdAt))
            .limit(50);

        return NextResponse.json(notes);
    } catch (error) {
        console.error("GET /api/notifications error:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

// PATCH: Mark notification as read
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await db
            .update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH /api/notifications error:", error);
        return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
    }
}
