import { mysqlTable, int, boolean, text } from "drizzle-orm/mysql-core";

export const motor = mysqlTable("motor", {
    id: int("motor_id").primaryKey().autoincrement(),
    main_pump: boolean("main_pump").notNull(),
    mini_pump: boolean("mini_pump").notNull(),
    status: boolean("status").notNull(),
    updated_at: text("updated_at").notNull(),
});