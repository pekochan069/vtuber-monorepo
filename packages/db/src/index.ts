import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function createDB(db: D1Database) {
  return drizzle(db, { schema });
}
