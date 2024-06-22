import { db } from "@repo/db";
import { socialTypes } from "@repo/db/schema";
import { generateId } from "@repo/utils/id";
import { defineAction, z } from "astro:actions";

export const createSocialType = defineAction({
  input: z.object({
    name: z.string(),
    url: z.string(),
    icon: z.string(),
  }),
  handler: async ({ name, url, icon }) => {
    if (url[url.length - 1] === "/") {
      url = url.slice(0, -1);
    }
    try {
      await db.insert(socialTypes).values({
        id: generateId(),
        name,
        url,
        icon,
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

export const getSocialTypes = defineAction({
  handler: async () => {
    const res = await db
      .select({
        id: socialTypes.id,
        name: socialTypes.name,
        icon: socialTypes.icon,
      })
      .from(socialTypes);

    return res;
  },
});
