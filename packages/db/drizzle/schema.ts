import { sqliteTable, AnySQLiteColumn, text, integer, foreignKey, primaryKey, index, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const vtuber_agencies = sqliteTable("vtuber_agencies", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	jp: text("jp"),
	en: text("en"),
	kr: text("kr"),
	description: text("description"),
	website: text("website"),
	created_at: integer("created_at").notNull(),
	defunct: integer("defunct").default(false),
	defunct_at: integer("defunct_at"),
	icon: text("icon").notNull(),
});

export const vtuber_agency_socials = sqliteTable("vtuber_agency_socials", {
	agency_id: text("agency_id").notNull().references(() => vtuber_agencies.id),
	social_id: text("social_id").notNull().references(() => vtuber_socials.id),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.agency_id, table.social_id], name: "vtuber_agency_socials_agency_id_social_id_pk"})
	}
});

export const vtuber_social_types = sqliteTable("vtuber_social_types", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	url: text("url").notNull(),
	icon: text("icon").notNull(),
});

export const vtuber_socials = sqliteTable("vtuber_socials", {
	id: text("id").primaryKey().notNull(),
	type_id: text("type_id").notNull().references(() => vtuber_social_types.id),
	handle: text("handle").notNull(),
	name: text("name"),
});

export const vtuber_vtuber_socials = sqliteTable("vtuber_vtuber_socials", {
	vtuber_id: text("vtuber_id").notNull().references(() => vtuber_vtubers.id),
	social_id: text("social_id").notNull().references(() => vtuber_socials.id),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.social_id, table.vtuber_id], name: "vtuber_vtuber_socials_social_id_vtuber_id_pk"})
	}
});

export const vtuber_vtubers = sqliteTable("vtuber_vtubers", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	jp: text("jp"),
	en: text("en"),
	kr: text("kr"),
	description: text("description"),
	debut: integer("debut").notNull(),
	retired: integer("retired").default(false),
	retire_date: integer("retire_date"),
	gender: text("gender"),
	birthday: integer("birthday"),
	website: text("website"),
	icon: text("icon").notNull(),
	agency_id: text("agency_id").notNull().references(() => vtuber_agencies.id),
},
(table) => {
	return {
		agency_id_idx: index("agency_id_idx").on(table.agency_id),
		name_idx: index("name_idx").on(table.name),
	}
});

export const vmama_illustrator_socials = sqliteTable("vmama_illustrator_socials", {
	illustrator_id: text("illustrator_id").notNull().references(() => vmama_illustrators.id),
	social_id: text("social_id").notNull().references(() => vtuber_socials.id),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.illustrator_id, table.social_id], name: "vmama_illustrator_socials_illustrator_id_social_id_pk"})
	}
});

export const vmama_illustrators = sqliteTable("vmama_illustrators", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	jp: text("jp"),
	en: text("en"),
	kr: text("kr"),
	description: text("description"),
	icon: text("icon").notNull(),
	website: text("website"),
});

export const vmama_outfits = sqliteTable("vmama_outfits", {
	id: text("id").primaryKey().notNull(),
	vtuber_id: text("vtuber_id").notNull().references(() => vtuber_vtubers.id),
	illustrator_id: text("illustrator_id").notNull().references(() => vmama_illustrators.id),
	name: text("name").notNull(),
	date: integer("date").notNull(),
	image: integer("image").notNull(),
});

export const vmama_admin_sessions = sqliteTable("vmama_admin_sessions", {
	id: text("id").primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => vmama_admin_users.id),
	expires_at: integer("expires_at").notNull(),
});

export const vmama_admin_users = sqliteTable("vmama_admin_users", {
	id: text("id").primaryKey().notNull(),
	username: text("username").notNull(),
	password: text("password").notNull(),
	role: text("role").notNull(),
},
(table) => {
	return {
		username_unique: uniqueIndex("vmama_admin_users_username_unique").on(table.username),
	}
});