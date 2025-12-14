import { mysqlTable, int, boolean, text } from "drizzle-orm/mysql-core";

export const motor = mysqlTable("motor", {
    id: int("motor_id").primaryKey().autoincrement(),
    main_pump: boolean("main_pump").notNull(),
    feeder: boolean("feeder").notNull(),
    updated_at: text("updated_at").notNull(),
});