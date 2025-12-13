
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ROLES } from "@/lib/auth-utils/permissions";
import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";

export const POST = async (req: Request) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || (session.user.role !== ROLES.SUPERADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user exists
        const targetUser = await db.select().from(user).where(eq(user.id, userId)).execute();
        if (targetUser.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const targetUserData = targetUser[0];

        // Cannot delete superadmin
        if (targetUserData.role === ROLES.SUPERADMIN) {
            return NextResponse.json({ error: "Cannot delete Super Admin" }, { status: 403 });
        }

        // Perform actual deletion
        await db.delete(user).where(eq(user.id, userId));

        await logAction(
            session.user.id,
            "DELETE",
            "USER",
            { targetUserId: userId, targetUserEmail: targetUserData.email },
            userId,
            `Deleted user ${targetUserData.email}`
        );

        return NextResponse.json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Internal Server Error"
        }, { status: 500 });
    }
};
