import { z } from "zod";

const envSchema = z.object({
  DB_URI: z.string().nonempty("DB_URI is required"),
  BETTER_AUTH_URL: z.string().nonempty("BETTER_AUTH_URL is required"),
  BETTER_AUTH_SECRET: z.string().nonempty("BETTER_AUTH_SECRET is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Missing or invalid environment variables:");
  process.exit(1);
}

export const env = parsed.data;
