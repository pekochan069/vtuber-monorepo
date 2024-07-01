import { defineAction, z } from "astro:actions";
import { db } from "@repo/db";

export const queryIllustrators = defineAction({
  input: z.string(),
  handler: async (param) => {
    try {
      const res = await db.query.illustrators.findMany({
        where: (illustrator, { like, or }) =>
          or(
            like(illustrator.name, `%${param}%`),
            like(illustrator.jp, `%${param}%`),
            like(illustrator.en, `%${param}%`),
            like(illustrator.kr, `%${param}%`),
          ),
        limit: 20,
      });

      return res;
    } catch {
      return [];
    }
  },
});
