// db/plantSales.ts
import { mysqlTable, int, date, decimal, varchar, text } from "drizzle-orm/mysql-core";
import { plantBatch } from "./plantBatch";

export const plantSales = mysqlTable("plant_sales", {
  plantSaleId: int("plant_sale_id").primaryKey().autoincrement(),
  plantBatchId: int("plant_batch_id")
    .notNull()
    .references(() => plantBatch.plantBatchId, { onDelete: "cascade" }),
  saleDate: date("sale_date").notNull(),
  totalSaleAmount: decimal("total_sale_amount", { precision: 10, scale: 2 }).notNull(), // presyo ng buong batch
  customerName: varchar("customer_name", { length: 100 }),
  notes: text("notes"),
});

export type PlantSales = typeof plantSales.$inferSelect;
export type NewPlantSales = typeof plantSales.$inferInsert;
