CREATE TABLE `demo_bets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`demo_user_id` integer NOT NULL,
	`game_id` text NOT NULL,
	`game_name` text NOT NULL,
	`amount` integer NOT NULL,
	`result` text DEFAULT 'pending' NOT NULL,
	`payout` integer DEFAULT 0 NOT NULL,
	`multiplier` real,
	`created_at` text NOT NULL,
	FOREIGN KEY (`demo_user_id`) REFERENCES `demo_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `demo_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`coins` integer DEFAULT 1000 NOT NULL,
	`role` text DEFAULT 'demo' NOT NULL,
	`created_at` text NOT NULL,
	`last_reset_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `demo_users_email_unique` ON `demo_users` (`email`);