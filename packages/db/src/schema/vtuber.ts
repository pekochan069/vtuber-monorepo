import {
  index,
  integer,
  primaryKey,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";

const vtuberBuilder = sqliteTableCreator((name) => `vtuber_${name}`);

export const vtubers = vtuberBuilder(
  "vtubers",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    jp: text("jp"),
    en: text("en"),
    kr: text("kr"),
    description: text("description"),
    debut: integer("debut", { mode: "timestamp" }).notNull(),
    retired: integer("retired", { mode: "boolean" }).default(false),
    retireDate: integer("retire_date", { mode: "timestamp" }),
    gender: text("gender"),
    birthday: integer("birthday", { mode: "timestamp" }),
    website: text("website"),
    icon: text("icon").notNull(),
    smallIcon: text("small_icon").notNull(),
    agencyId: text("agency_id")
      .notNull()
      .references(() => agencies.id),
  },
  (table) => ({
    nameIdx: index("name_idx").on(table.name),
    agencyIdIdx: index("agency_id_idx").on(table.agencyId),
  }),
);

export const vtuberSocials = vtuberBuilder(
  "vtuber_socials",
  {
    vtuberId: text("vtuber_id")
      .notNull()
      .references(() => vtubers.id),
    socialId: text("social_id")
      .notNull()
      .references(() => socials.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.vtuberId, table.socialId] }),
  }),
);

export const agencies = vtuberBuilder("agencies", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  jp: text("jp"),
  en: text("en"),
  kr: text("kr"),
  description: text("description"),
  website: text("website"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  defunct: integer("defunct", { mode: "boolean" }).default(false),
  defunctAt: integer("defunct_at", { mode: "timestamp" }),
  icon: text("icon").notNull(),
});

export const agencySocials = vtuberBuilder(
  "agency_socials",
  {
    agencyId: text("agency_id")
      .notNull()
      .references(() => agencies.id),
    socialId: text("social_id")
      .notNull()
      .references(() => socials.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.agencyId, table.socialId] }),
  }),
);

export const socialTypes = vtuberBuilder("social_types", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(),
});

export const socials = vtuberBuilder("socials", {
  id: text("id").notNull().primaryKey(),
  typeId: text("type_id")
    .notNull()
    .references(() => socialTypes.id),
  handle: text("handle").notNull(),
  name: text("name"),
});

export type Vtuber = typeof vtubers.$inferSelect;
export type VtuberInsert = typeof vtubers.$inferInsert;
export type Agency = typeof agencies.$inferSelect;
export type AgencyInsert = typeof agencies.$inferInsert;
export type SocialType = typeof socialTypes.$inferSelect;
export type SocialTypeInsert = typeof socialTypes.$inferInsert;
export type Social = typeof socials.$inferSelect;
export type SocialInsert = typeof socials.$inferInsert;
