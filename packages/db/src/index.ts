import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import * as schema from "./schema";
import { env } from "@repo/env/web";

const client = createClient({
  authToken: env.DATABASE_TOKEN,
  url: env.DATABASE_URL,
});

export const db = drizzle(client, { schema });
