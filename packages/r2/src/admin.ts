import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@repo/env/admin";

export const R2 = new S3Client({
  region: "auto",
  endpoint: env.R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});
