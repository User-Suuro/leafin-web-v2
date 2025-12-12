// db/fishSales.ts
import { mysqlTable, int, date, decimal, varchar, text } from "drizzle-orm/mysql-core";
import { fishBatch } from "./fishBatch";

export const fishSales = mysqlTable("fish_sales", {
  fishSaleId: int("fish_sale_id").primaryKey().autoincrement(),
  fishBatchId: int("fish_batch_id")
    .notNull()
    .references(() => fishBatch.fishBatchId, { onDelete: "cascade" }),
  saleDate: date("sale_date").notNull(),
  totalSaleAmount: decimal("total_sale_amount", { precision: 10, scale: 2 }).notNull(), // presyo ng buong batch
  customerName: varchar("customer_name", { length: 100 }),
  notes: text("notes"),
});

export type FishSales = typeof fishSales.$inferSelect;
export type NewFishSales = typeof fishSales.$inferInsert;
