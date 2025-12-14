import { mysqlTable, serial, varchar, text, boolean, timestamp } from "drizzle-orm/mysql-core";
import { user } from "./auth-schema";

export const notifications = mysqlTable("notifications", {
    id: serial("id").primaryKey(),
    type: varchar("type", { length: 20 }).notNull(), // 'alert', 'info', 'warning'
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    isRead: boolean("is_read").default(false),
    userId: varchar("user_id", { length: 36 }), // references user.id, if null -> system wide/all users (logic handled in app)
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
