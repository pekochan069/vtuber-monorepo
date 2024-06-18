import { createClient, createDB } from "@repo/db";
import { env } from "@repo/env/web";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_TOKEN,
});

export const db = createDB(client);

export * from "@repo/db/schema";
