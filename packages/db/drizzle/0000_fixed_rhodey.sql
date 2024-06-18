CREATE TABLE `vtuber_agencies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`jp` text,
	`en` text,
	`kr` text,
	`description` text,
	`website` text,
	`created_at` integer NOT NULL,
	`removed` integer DEFAULT false,
	`removed_at` integer,
	`icon` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vtuber_agency_socials` (
	`agency_id` text NOT NULL,
	`social_id` text NOT NULL,
	PRIMARY KEY(`agency_id`, `social_id`),
	FOREIGN KEY (`agency_id`) REFERENCES `vtuber_agencies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`social_id`) REFERENCES `vtuber_socials`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vtuber_social_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`icon` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vtuber_socials` (
	`id` text PRIMARY KEY NOT NULL,
	`type_id` text NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`type_id`) REFERENCES `vtuber_social_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vtuber_vtuber_socials` (
	`vtuber_id` text NOT NULL,
	`social_id` text NOT NULL,
	PRIMARY KEY(`social_id`, `vtuber_id`),
	FOREIGN KEY (`vtuber_id`) REFERENCES `vtuber_vtubers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`social_id`) REFERENCES `vtuber_socials`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vtuber_vtubers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`jp` text,
	`en` text,
	`kr` text,
	`description` text,
	`debut` integer NOT NULL,
	`retired` integer DEFAULT false,
	`retire_date` integer,
	`gender` text,
	`birthday` integer,
	`website` text,
	`icon` text NOT NULL,
	`agency_id` text NOT NULL,
	FOREIGN KEY (`agency_id`) REFERENCES `vtuber_agencies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vmama_illustrator_socials` (
	`illustrator_id` text NOT NULL,
	`social_id` text NOT NULL,
	PRIMARY KEY(`illustrator_id`, `social_id`),
	FOREIGN KEY (`illustrator_id`) REFERENCES `vmama_illustrators`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`social_id`) REFERENCES `vtuber_socials`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vmama_illustrators` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`jp` text,
	`en` text,
	`kr` text,
	`description` text,
	`logo` text NOT NULL,
	`website` text
);
--> statement-breakpoint
CREATE TABLE `vmama_outfits` (
	`id` text PRIMARY KEY NOT NULL,
	`vtuber_id` text NOT NULL,
	`illustrator_id` text NOT NULL,
	`name` text NOT NULL,
	`date` integer NOT NULL,
	`image` integer NOT NULL,
	FOREIGN KEY (`vtuber_id`) REFERENCES `vtuber_vtubers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`illustrator_id`) REFERENCES `vmama_illustrators`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `vtuber_vtubers` (`name`);--> statement-breakpoint
CREATE INDEX `agency_id_idx` ON `vtuber_vtubers` (`agency_id`);