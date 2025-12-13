// db/schema/logs.ts
import { mysqlTable, int, datetime, text, bigint, json, varchar } from "drizzle-orm/mysql-core";
import { user } from "./auth-schema";

import { sql } from "drizzle-orm";
import { plantBatch } from "./plantBatch";
import { fishBatch } from "./fishBatch";
import { fishSales } from "./fishSales";
import { plantSales } from "./plantSales";
import { expenses } from "./expenses";
import { tasks } from "./tasks";

export const logs = mysqlTable("logs", {
  logId: int("log_id").primaryKey().autoincrement(),
  eventTime: datetime("event_time").default(sql`CURRENT_TIMESTAMP`),
  notes: text("notes"),

  // Audit Fields
  userId: varchar("user_id", { length: 36 }).references(() => user.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }), // CREATE, UPDATE, DELETE, etc.
  resourceType: varchar("resource_type", { length: 100 }), // USER, BATCH, EXPENSE, etc.
  resourceId: varchar("resource_id", { length: 100 }), // Generic ID reference
  details: json("details"), // Store generic details

  taskId: bigint("task_id", { mode: "number", unsigned: true })
    .references(() => tasks.taskId, { onDelete: "cascade", onUpdate: "cascade" }),

  relatedFishSaleId: int("related_fish_sale_id")
    .references(() => fishSales.fishSaleId, { onDelete: "cascade", onUpdate: "cascade" }),

  relatedPlantSaleId: int("related_plant_sale_id")
    .references(() => plantSales.plantSaleId, { onDelete: "cascade", onUpdate: "cascade" }),

  relatedExpenseId: int("related_expense_id")
    .references(() => expenses.expenseId, { onDelete: "cascade", onUpdate: "cascade" }),

  plantBatchId: int("plant_batch_id")
    .references(() => plantBatch.plantBatchId, { onDelete: "cascade", onUpdate: "cascade" }),

  fishBatchId: int("fish_batch_id")
    .references(() => fishBatch.fishBatchId, { onDelete: "cascade", onUpdate: "cascade" }),
});

export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
