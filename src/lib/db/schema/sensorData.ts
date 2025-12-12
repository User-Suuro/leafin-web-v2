import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const sensorData = mysqlTable("sensor_data", {
  id: int("id").primaryKey().autoincrement(),
  time: varchar("time", { length: 100 }).notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  ph: varchar("ph", { length: 100 }).notNull(),
  turbid: varchar("turbid", { length: 100 }).notNull(),
  water_temp: varchar("water_temp", { length: 100 }).notNull(),
  tds: varchar("tds", { length: 100 }).notNull(),
  float_switch: boolean("float_switch").notNull(),
  nh3_gas: varchar("nh3_gas", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
