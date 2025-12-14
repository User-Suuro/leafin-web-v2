import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema/auth-schema";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const users = await db.select({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }).from(user);

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
