import { defineAction, z } from "astro:actions";
import { db } from "@repo/db";

export const query = defineAction({
  input: z.object({
    month: z.number().min(1).max(12),
  }),
  handler: async ({ month }) => {
    console.log(month);
  },
});
