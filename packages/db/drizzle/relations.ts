import { relations } from "drizzle-orm/relations";
import { vtuber_socials, vtuber_agency_socials, vtuber_agencies, vtuber_social_types, vtuber_vtuber_socials, vtuber_vtubers, vmama_illustrator_socials, vmama_illustrators, vmama_outfits, vmama_admin_users, vmama_admin_sessions } from "./schema";

export const vtuber_agency_socialsRelations = relations(vtuber_agency_socials, ({one}) => ({
	vtuber_social: one(vtuber_socials, {
		fields: [vtuber_agency_socials.social_id],
		references: [vtuber_socials.id]
	}),
	vtuber_agency: one(vtuber_agencies, {
		fields: [vtuber_agency_socials.agency_id],
		references: [vtuber_agencies.id]
	}),
}));

export const vtuber_socialsRelations = relations(vtuber_socials, ({one, many}) => ({
	vtuber_agency_socials: many(vtuber_agency_socials),
	vtuber_social_type: one(vtuber_social_types, {
		fields: [vtuber_socials.type_id],
		references: [vtuber_social_types.id]
	}),
	vtuber_vtuber_socials: many(vtuber_vtuber_socials),
	vmama_illustrator_socials: many(vmama_illustrator_socials),
}));

export const vtuber_agenciesRelations = relations(vtuber_agencies, ({many}) => ({
	vtuber_agency_socials: many(vtuber_agency_socials),
	vtuber_vtubers: many(vtuber_vtubers),
}));

export const vtuber_social_typesRelations = relations(vtuber_social_types, ({many}) => ({
	vtuber_socials: many(vtuber_socials),
}));

export const vtuber_vtuber_socialsRelations = relations(vtuber_vtuber_socials, ({one}) => ({
	vtuber_social: one(vtuber_socials, {
		fields: [vtuber_vtuber_socials.social_id],
		references: [vtuber_socials.id]
	}),
	vtuber_vtuber: one(vtuber_vtubers, {
		fields: [vtuber_vtuber_socials.vtuber_id],
		references: [vtuber_vtubers.id]
	}),
}));

export const vtuber_vtubersRelations = relations(vtuber_vtubers, ({one, many}) => ({
	vtuber_vtuber_socials: many(vtuber_vtuber_socials),
	vtuber_agency: one(vtuber_agencies, {
		fields: [vtuber_vtubers.agency_id],
		references: [vtuber_agencies.id]
	}),
	vmama_outfits: many(vmama_outfits),
}));

export const vmama_illustrator_socialsRelations = relations(vmama_illustrator_socials, ({one}) => ({
	vtuber_social: one(vtuber_socials, {
		fields: [vmama_illustrator_socials.social_id],
		references: [vtuber_socials.id]
	}),
	vmama_illustrator: one(vmama_illustrators, {
		fields: [vmama_illustrator_socials.illustrator_id],
		references: [vmama_illustrators.id]
	}),
}));

export const vmama_illustratorsRelations = relations(vmama_illustrators, ({many}) => ({
	vmama_illustrator_socials: many(vmama_illustrator_socials),
	vmama_outfits: many(vmama_outfits),
}));

export const vmama_outfitsRelations = relations(vmama_outfits, ({one}) => ({
	vmama_illustrator: one(vmama_illustrators, {
		fields: [vmama_outfits.illustrator_id],
		references: [vmama_illustrators.id]
	}),
	vtuber_vtuber: one(vtuber_vtubers, {
		fields: [vmama_outfits.vtuber_id],
		references: [vtuber_vtubers.id]
	}),
}));

export const vmama_admin_sessionsRelations = relations(vmama_admin_sessions, ({one}) => ({
	vmama_admin_user: one(vmama_admin_users, {
		fields: [vmama_admin_sessions.user_id],
		references: [vmama_admin_users.id]
	}),
}));

export const vmama_admin_usersRelations = relations(vmama_admin_users, ({many}) => ({
	vmama_admin_sessions: many(vmama_admin_sessions),
}));