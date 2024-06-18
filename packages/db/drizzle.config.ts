import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: env variable
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_TOKEN,
  },
  schema: "./src/schema/index.ts",
});
