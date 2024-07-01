import { defineAction, z } from "astro:actions";
import { db } from "@repo/db";

export const queryVtuber = defineAction({
  input: z.string(),
  handler: async (param) => {
    try {
      const res = await db.query.vtubers.findMany({
        where: (vtuber, { like, or }) =>
          or(
            like(vtuber.name, `%${param}%`),
            like(vtuber.jp, `%${param}%`),
            like(vtuber.en, `%${param}%`),
            like(vtuber.kr, `%${param}%`),
          ),
        limit: 20,
      });

      return res;
    } catch {
      return [];
    }
  },
});
