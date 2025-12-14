import { db } from "./db/drizzle";
import { notifications } from "./db/schema/notifications";

type NotificationType = "alert" | "info" | "warning";

/**
 * Creates a system-wide notification (userId = null) or specific user notification.
 * @param title Title of the notification
 * @param message Body of the notification
 * @param type Type of notification (alert, info, warning)
 * @param userId Optional userId to target a specific user
 */
export async function createNotification(
    title: string,
    message: string,
    type: NotificationType = "info",
    userId: string | null = null
) {
    try {
        await db.insert(notifications).values({
            title,
            message,
            type,
            userId: userId,
            createdAt: new Date(),
        });
    } catch (err) {
        console.error("Failed to create notification:", err);
    }
}
