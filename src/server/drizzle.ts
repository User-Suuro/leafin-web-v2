import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "@/lib/zod-schema/env";

const pool = mysql.createPool({
  uri: env.DB_URI,
});

export const db = drizzle(pool);
