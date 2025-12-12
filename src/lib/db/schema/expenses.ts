// db/schema/expenses.ts
import { mysqlTable, int, date, mysqlEnum, text, decimal } from "drizzle-orm/mysql-core";
import { fishBatch } from "./fishBatch";
import { plantBatch } from "./plantBatch";

export const expenses = mysqlTable("expenses", {
  expenseId: int("expense_id").primaryKey().autoincrement(),
  expenseDate: date("expense_date").notNull(),
  category: mysqlEnum("category", ["feed", "maintenance", "utilities", "other"]).notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),

  relatedFishBatchId: int("related_fish_batch_id").references(() => fishBatch.fishBatchId),
  relatedPlantBatchId: int("related_plant_batch_id").references(() => plantBatch.plantBatchId),
});

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
