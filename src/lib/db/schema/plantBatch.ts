// db/schema/plantBatch.ts
import { mysqlTable, int, datetime, varchar, mysqlEnum, date} from "drizzle-orm/mysql-core";

export const plantBatch = mysqlTable("plant_batch", {
  plantBatchId: int("plant_batch_id").primaryKey().autoincrement(),
  plantQuantity: int("plant_quantity").notNull(),

  dateAdded: datetime("date_added").notNull(),
  condition: varchar("conditions", { length: 50 }),

    // New columns
    expectedHarvestDate: date("expected_harvest_date"), 
    batchStatus: mysqlEnum("batch_status", ["growing", "ready", "harvested", "discarded"])
      .default("growing"),
});

export type PlantBatch = typeof plantBatch.$inferSelect;
export type NewPlantBatch = typeof plantBatch.$inferInsert;
