import { defineConfig } from "drizzle-kit";
import { env } from "@/lib/zod-schema/env";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/lib/db/schema",
  out: "./src/lib/db/migrations",
  dbCredentials: {
    url: env.DB_URI,
  },
  strict: true,
});

/*

run the following commands with bun to use the Drizzle CLI:

drizzle-kit generate,
drizzle-kit drop,
drizzle-kit push,
drizzle-kit migrate,
drizzle-kit check,
drizzle-kit studio

*/
