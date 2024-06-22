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
    R2_READONLY_TOKEN: z.string().min(1),
    R2_READONLY_ACCESS_KEY_ID: z.string().min(1),
    R2_READONLY_SECRET_ACCESS_KEY: z.string().min(1),
    R2_S3_ENDPOINT: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_BUCKET_NAME: z.string().min(1),
  },
  client: {},
  // @ts-ignore vite runtime env
  runtimeEnv: import.meta.env,
  clientPrefix: "PUBLIC_",
});
