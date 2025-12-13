export type ActionType = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "OTHER";
export type ResourceType = "USER" | "BATCH" | "EXPENSE" | "TASK" | "SALES" | "SENSOR" | "AUTH";

import { db } from "@/lib/db/drizzle";
import { logs } from "@/lib/db/schema/logs";

export async function logAction(
    userId: string,
    action: ActionType,
    resourceType: ResourceType,
    details: Record<string, any> = {},
    resourceId?: string,
    notes?: string
) {
    try {
        await db.insert(logs).values({
            userId,
            action,
            resourceType,
            details,
            resourceId,
            notes,
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
        // Don't throw, logging failure shouldn't block main action
    }
}
