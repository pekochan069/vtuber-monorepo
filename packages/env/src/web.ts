import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().min(1),
    DATABASE_ID: z.string().min(1),
    DATABASE_TOKEN: z.string().min(1),
  },
  client: {},
  runtimeEnv: process.env,
  clientPrefix: "PUBLIC_",
});
