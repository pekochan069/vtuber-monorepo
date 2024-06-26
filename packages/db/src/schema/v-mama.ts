import {
  integer,
  primaryKey,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";
import { socials, vtubers } from "./vtuber";

const vmamaBuilder = sqliteTableCreator((name) => `vmama_${name}`);

export const illustrators = vmamaBuilder("illustrators", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  jp: text("jp"),
  en: text("en"),
  kr: text("kr"),
  description: text("description"),
  icon: text("icon").notNull(),
  website: text("website"),
});

export const illustratorSocials = vmamaBuilder(
  "illustrator_socials",
  {
    illustratorId: text("illustrator_id")
      .notNull()
      .references(() => illustrators.id),
    socialId: text("social_id")
      .notNull()
      .references(() => socials.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.illustratorId, table.socialId] }),
  }),
);

export const outfits = vmamaBuilder("outfits", {
  id: text("id").notNull().primaryKey(),
  vtuberId: text("vtuber_id")
    .notNull()
    .references(() => vtubers.id),
  illustratorId: text("illustrator_id")
    .notNull()
    .references(() => illustrators.id),
  name: text("name").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  image: integer("image").notNull(),
});

export type Illustrator = typeof illustrators.$inferSelect;
export type IllustratorInsert = typeof illustrators.$inferInsert;
export type IllustratorSocial = typeof illustratorSocials.$inferSelect;
export type IllustratorSocialInsert = typeof illustratorSocials.$inferInsert;
export type Outfit = typeof outfits.$inferSelect;
export type OutfitInsert = typeof outfits.$inferInsert;
