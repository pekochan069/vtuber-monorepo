import { db } from "@repo/db";
import { illustrators, illustratorSocials, socials } from "@repo/db/schema";
import { generateId } from "@repo/utils/id";
import { defineAction, z } from "astro:actions";

export const craeteIllustrator = defineAction({
  input: z.object({
    name: z.string(),
    jp: z.string(),
    en: z.string(),
    kr: z.string(),
    description: z.string(),
    icon: z.string(),
    website: z.string(),
    socialList: z.array(
      z.object({ type: z.string(), handle: z.string(), name: z.string() }),
    ),
  }),
  handler: async (
    { name, jp, en, kr, description, icon, website, socialList },
    context,
  ) => {
    const id = generateId();
    const socialUpload = socialList.map((s) => ({
      id: generateId(),
      typeId: s.type,
      handle: s.handle,
      name: s.name,
    }));

    try {
      await db.transaction(async (tx) => {
        await tx.insert(illustrators).values({
          id,
          name,
          jp,
          en,
          kr,
          description,
          website,
          icon,
        });
        await tx.insert(socials).values(socialUpload);
        await tx.insert(illustratorSocials).values(
          socialUpload.map((s) => ({
            illustratorId: id,
            socialId: s.id,
          })),
        );
      });

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
      };
    }
  },
});
