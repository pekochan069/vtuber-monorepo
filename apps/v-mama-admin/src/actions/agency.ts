import { agencies, agencySocials, socials, type Agency } from "@repo/db/schema";
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
      await db.transaction(async (tx) => {
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
        await tx.insert(socials).values(socialUpload);
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

export const getAgencies = defineAction({
  handler: async () => {
    try {
      return await db.select().from(agencies);
    } catch {
      return [] as Agency[];
    }
  },
});

export const queryAgencies = defineAction({
  input: z.string(),
  handler: async (query) => {
    try {
      const res = await db.query.agencies.findMany({
        where: (agency, { or, like }) =>
          or(
            like(agency.name, `%${query}%`),
            like(agency.jp, `%${query}%`),
            like(agency.en, `%${query}%`),
            like(agency.kr, `%${query}%`),
          ),
        limit: 10,
      });

      return res;
    } catch {
      return [] as Agency[];
    }
  },
});
