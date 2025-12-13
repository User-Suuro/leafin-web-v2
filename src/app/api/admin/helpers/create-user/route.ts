
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ROLES } from "@/lib/auth-utils/permissions";
import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema/auth-schema";
import { eq } from "drizzle-orm";

export const POST = async (req: Request) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || (session.user.role !== ROLES.SUPERADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Use core auth to create user. 
        // Note: signUpEmail usually signs the user in, checking headers. 
        // server-side call:
        const result = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            },
            asResponse: false // Get object back, don't trigger response logic yet
        });

        if (!result?.user) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
        }

        // Update role if it's different from default (which is likely user or undefined)
        // AND if the requested role is valid.
        if (role === ROLES.SUPERADMIN || role === ROLES.ADMIN || role === ROLES.UTILITY) {
            await db.update(user).set({ role }).where(eq(user.id, result.user.id));
        }

        return NextResponse.json({
            success: true,
            user: { ...result.user, role }
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Internal Server Error"
        }, { status: 500 });
    }
};
