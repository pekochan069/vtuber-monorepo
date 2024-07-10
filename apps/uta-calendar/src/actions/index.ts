import { defineAction, z } from "astro:actions";
import { like } from "drizzle-orm";

import { db } from "@repo/db";
import { calenderView } from "@repo/db/schema";

export const server = {
  queryCalender: defineAction({
    input: z.number().min(1).max(12),
    handler: async (month) => {
      const monthString = month.toString().padStart(2, "0");
      try {
        const res = await db
          .select()
          .from(calenderView)
          .where(like(calenderView.date, `${monthString}-%`));
        return res;
      } catch {
        return [];
      }
    },
  }),
};
