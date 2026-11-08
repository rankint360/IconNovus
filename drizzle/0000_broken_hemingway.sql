CREATE TABLE `marketplace_icons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`style` text NOT NULL,
	`price_cents` integer DEFAULT 100 NOT NULL,
	`formats` text NOT NULL,
	`creator_id` text NOT NULL,
	`creator_email` text NOT NULL,
	`portfolio_url` text,
	`description` text,
	`object_key` text NOT NULL,
	`original_filename` text NOT NULL,
	`content_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`reviewed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `marketplace_icons_slug_unique` ON `marketplace_icons` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_marketplace_icons_status_created` ON `marketplace_icons` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_marketplace_icons_creator` ON `marketplace_icons` (`creator_id`);--> statement-breakpoint
PRAGMA optimize;
