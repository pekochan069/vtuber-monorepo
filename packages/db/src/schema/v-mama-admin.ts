import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

const vmamaAdminBuilder = sqliteTableCreator((name) => `vmama_admin_${name}`);

export const vmamaAdminUsers = vmamaAdminBuilder("users", {
  id: text("id").notNull().primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
});

export const vmamaAdminSessions = vmamaAdminBuilder("sessions", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => vmamaAdminUsers.id),
  expiresAt: integer("expires_at").notNull(),
});
