import { defineAction, z } from "astro:actions";
import { env } from "@repo/env/web";
import { R2 } from "@repo/r2/admin";
import { PutObjectCommand } from "@repo/r2/client-s3";
import { getSignedUrl } from "@repo/r2/s3-request-presigner";
import { nanoid } from "@repo/utils/id";

export const handleImageUpload = defineAction({
  input: z.object({
    image: z.object({
      size: z.number(),
      type: z.string(),
    }),
    prefix: z.string(),
  }),
  handler: async ({ image, prefix }) => {
    const id = nanoid();
    const key = `${prefix}/${id}.png`;

    const cmd = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      ContentLength: image.size,
      ContentType: image.type,
    });

    const presignedUrl = await getSignedUrl(R2, cmd, {
      expiresIn: 60 * 60,
    });

    return {
      id,
      presignedUrl,
    };
  },
});
