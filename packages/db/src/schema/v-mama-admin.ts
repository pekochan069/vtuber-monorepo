import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

const vmamaAdminBuilder = sqliteTableCreator((name) => `vmama_admin_${name}`);

export const users = vmamaAdminBuilder("users", {
  id: text("id").notNull().primaryKey(),
  googleId: text("google_id").notNull(),
});

export const sessions = vmamaAdminBuilder("sessions", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});
