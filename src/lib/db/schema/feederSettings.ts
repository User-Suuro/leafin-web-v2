// db/schema/feederSettings.ts
import { mysqlTable, int, time, boolean, varchar } from "drizzle-orm/mysql-core";

export const feederSettings = mysqlTable("feeder_settings", {
  id: int("id").primaryKey().autoincrement(),

  // 1 → active, 0 → disabled
  isActive: boolean("is_active").default(true).notNull(),

  // number of feedings per day (3x/day)
  frequencyPerDay: int("frequency_per_day").default(1).notNull(),

  // JSON list of schedule times: ["07:00", "12:00", "17:00"]
  schedules: varchar("schedules", { length: 500 }).notNull(),

  // amount in grams
  feedQuantity: int("feed_quantity").default(10).notNull(),

  lastFeedTime: varchar("last_feed_time", { length: 100 }),
  nextFeedTime: varchar("next_feed_time", { length: 100 }),
});
