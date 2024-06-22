import { agencies } from "@repo/db/schema";
import { defineAction, z } from "astro:actions";

import { db } from "@repo/db";
import { generateId } from "@repo/utils/id";
import { handleImageUpload } from "./image-upload-handle";

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
    icon: z.string(),
  }),
  handler: async ({
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
  }) => {
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
    images: z
      .array(
        z.object({
          size: z.number(),
          width: z.number(),
          type: z.string().refine((t) => t.startsWith("image/")),
        }),
      )
      .length(4),
  }),
  handler: async ({ images }) => {
    const res = await handleImageUpload(images, "agency");

    return res;
  },
});
