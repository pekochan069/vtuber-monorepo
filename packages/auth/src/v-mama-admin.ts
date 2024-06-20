import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from "@repo/db";
import {
  vmamaAdminSessions,
  vmamaAdminUsers,
} from "@repo/db/schema/v-mama-admin";
import { env } from "@repo/env/v-mama-admin";

const adapter = new DrizzleSQLiteAdapter(
  db,
  vmamaAdminSessions,
  vmamaAdminUsers,
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      role: attributes.role,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      username: string;
      role: string;
    };
  }
}
