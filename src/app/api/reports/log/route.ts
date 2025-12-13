import { NextResponse } from "next/server";
import { logAction } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { reportType, period } = body;

        if (!reportType || !period) {
            return NextResponse.json(
                { error: "Missing report details" },
                { status: 400 }
            );
        }

        await logAction(
            session.user.id,
            "OTHER", // or "CREATE" if considered creating a file
            "REPORT",
            { reportType, period },
            `${reportType}_${period}`,
            `Exported ${reportType} Report (${period})`
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error logging report export:", error);
        return NextResponse.json(
            { error: "Failed to log report action" },
            { status: 500 }
        );
    }
}
