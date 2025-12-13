import { relations } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { user } from "./auth-schema";

export const userInfo = mysqlTable("user_info", {
  id: varchar("id", { length: 36 }).primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  middleName: varchar("middle_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  address: varchar("address", { length: 100 }).notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const userRelations = relations(userInfo, ({ one }) => ({
  user: one(user, {
    fields: [userInfo.userId],
    references: [user.id],
  }),
}));
