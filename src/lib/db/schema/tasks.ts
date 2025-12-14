// db/tasks.ts
import { mysqlTable, serial, varchar, text, mysqlEnum, date, time, int } from "drizzle-orm/mysql-core";
import { fishBatch } from "./fishBatch";
import { plantBatch } from "./plantBatch";
import { user } from "./auth-schema";

export const tasks = mysqlTable("tasks", {
  taskId: serial("task_id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  taskType: mysqlEnum("task_type", ["feeding", "maintenance", "cleaning", "harvest", "planting", "other"]).notNull(),
  scheduledDate: date("scheduled_date"),
  scheduledTime: time("scheduled_time"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed"])
    .default("pending"),

  relatedFishBatchId: int("related_fish_batch_id")
    .references(() => fishBatch.fishBatchId, { onDelete: "cascade", onUpdate: "cascade" }),
  relatedPlantBatchId: int("related_plant_batch_id")
    .references(() => plantBatch.plantBatchId, { onDelete: "cascade", onUpdate: "cascade" }),
  assignedTo: varchar("assigned_to", { length: 36 })
    .references(() => user.id, { onDelete: "set null", onUpdate: "cascade" }),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
