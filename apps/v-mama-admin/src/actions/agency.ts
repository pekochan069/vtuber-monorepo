import { agencies, type AgencyInsert } from "@repo/db/schema";
import { defineAction, z } from "astro:actions";

import { db } from "@repo/db";
import { generateId, nanoid } from "@repo/utils/id";
import { R2 } from "@repo/r2/admin";
import { PutObjectCommand } from "@repo/r2/client-s3";
import { getSignedUrl } from "@repo/r2/s3-request-presigner";
import { env } from "@repo/env/admin";

export const createAgency = defineAction({
  input: z.object({
    name: z.string(),
    jp: z.optional(z.string()),
    en: z.optional(z.string()),
    kr: z.optional(z.string()),
    description: z.optional(z.string()),
    website: z.optional(z.string()),
    createdAt: z.string(),
    defunct: z.boolean().default(false),
    defunctAt: z.optional(z.string()),
    icon: z.string().url(),
  }),
  handler: async (
    {
      name,
      jp,
      en,
      kr,
      description,
      website,
      createdAt,
      defunct,
      defunctAt,
      icon,
    },
    context,
  ) => {
    // convert yyyy-mm-dd to Date
    const createdDate = new Date(createdAt);
    const defunctDate = defunctAt ? new Date(defunctAt) : undefined;

    const id = generateId();

    try {
      await db.insert(agencies).values({
        id,
        name,
        jp,
        en,
        kr,
        description,
        website,
        createdAt: createdDate,
        defunct,
        defunctAt: defunctDate,
        icon,
      });
    } catch {
      return new Response("Failed to create agency", { status: 500 });
    }

    return new Response("Agency created", { status: 201 });
  },
});

export const handleLogoUpload = defineAction({
  input: z.object({
    images: z.array(z.any()).length(4),
  }),
  handler: async ({ images }, context) => {
    const presignedUrls = [] as string[];
    const base = `agency/${nanoid()}`;

    let i = 1;
    for (const image of images) {
      const width = 512 / i;
      i *= 2;
      const key = `${base}-${width}`;

      const cmd = new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        ContentLength: image.size,
        ContentType: image.type,
      });

      const presignedUrl = await getSignedUrl(R2, cmd, { expiresIn: 60 * 60 });

      presignedUrls.push(presignedUrl);
    }

    return {
      baseUrl: `${env.R2_S3_ENDPOINT}/${base}`,
      presignedUrls,
    };
  },
});
