import { defineAction, z } from "astro:actions";
import { db } from "@repo/db";

export const queryAgency = defineAction({
  input: z.string(),
  handler: async (param) => {
    try {
      const res = await db.query.agencies.findMany({
        where: (agency, { like, or }) =>
          or(
            like(agency.name, `%${param}%`),
            like(agency.jp, `%${param}%`),
            like(agency.en, `%${param}%`),
            like(agency.kr, `%${param}%`),
          ),
        limit: 20,
      });

      return res;
    } catch {
      return [];
    }
  },
});
