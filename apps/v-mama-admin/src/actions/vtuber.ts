import { defineAction, z } from "astro:actions";
import { db } from "@repo/db";
import { socials, vtuberSocials, vtubers } from "@repo/db/schema";
import { generateId } from "@repo/utils/id";

export const createVtuber = defineAction({
  input: z.object({
    name: z.string(),
    jp: z.optional(z.string()),
    en: z.optional(z.string()),
    kr: z.optional(z.string()),
    description: z.optional(z.string()),
    website: z.optional(z.string()),
    debut: z.string(),
    retired: z.boolean().default(false),
    retiredAt: z.optional(z.string()),
    gender: z.string(),
    birthday: z.string(),
    icon: z.string(),
    smallIcon: z.string(),
    agencyId: z.string(),
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
    debut,
    retired,
    retiredAt,
    gender,
    birthday,
    icon,
    smallIcon,
    agencyId,
    socialList,
  }) => {
    const debutDate = new Date(debut);
    const retireDate = retiredAt ? new Date(retiredAt) : undefined;
    const birthdayDate = new Date(birthday);
    const id = generateId();
    const socialUpload = socialList.map((s) => ({
      id: generateId(),
      typeId: s.type,
      handle: s.handle,
      name: s.name,
    }));

    try {
      await db.transaction(async (tx) => {
        await tx.insert(vtubers).values({
          id,
          name,
          jp,
          en,
          kr,
          description,
          website,
          debut: debutDate,
          retired,
          retireDate,
          gender,
          birthday: birthdayDate,
          icon,
          smallIcon,
          agencyId,
        });
        await tx.insert(socials).values(socialUpload);
        await tx.insert(vtuberSocials).values(
          socialUpload.map((s) => ({
            vtuberId: id,
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
