import { agencies, agencySocials, socials, type Agency } from "@repo/db/schema";
import { defineAction, z } from "astro:actions";

import { db } from "@repo/db";
import { generateId } from "@repo/utils/id";
import { handleImageUpload } from "./image-upload-handle";
import { Image } from "../components/ui/image";

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
    socialList: z.array(
      z.object({ type: z.string(), handle: z.string(), name: z.string() }),
    ),
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
    socialList,
  }) => {
    console.log(1);
    const createdDate = new Date(createdAt);
    const defunctDate = defunctAt ? new Date(defunctAt) : undefined;
    const id = generateId();
    const socialUpload = socialList.map((s) => ({
      id: generateId(),
      typeId: s.type,
      handle: s.handle,
      name: s.name,
    }));

    try {
      console.log(2);
      await db.transaction(async (tx) => {
        console.log(3);
        await tx.insert(agencies).values({
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
        console.log(4);
        await tx.insert(socials).values(socialUpload);
        console.log(5);
        await tx.insert(agencySocials).values(
          socialUpload.map((s) => ({
            agencyId: id,
            socialId: s.id,
          })),
        );
      });
    } catch {
      return {
        ok: false,
      };
    }

    return {
      ok: true,
    };
  },
});

export const handleLogoUpload = defineAction({
  input: z.object({
    image: z.object({
      size: z.number(),
      width: z.number(),
      type: z.string().refine((t) => t.startsWith("image/")),
    }),
  }),
  handler: async ({ image }) => {
    const res = await handleImageUpload(image, "agency");

    return res;
  },
});

export const getAll = defineAction({
  handler: async () => {
    try {
      return await db.query.agencies.findMany();
    } catch {
      return [] as Agency[];
    }
  },
});
