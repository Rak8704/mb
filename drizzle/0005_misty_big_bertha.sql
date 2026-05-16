CREATE TABLE `referral_codes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`referral_code` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `referral_codes_user_id_unique` ON `referral_codes` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `referral_codes_referral_code_unique` ON `referral_codes` (`referral_code`);--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`referrer_user_id` text NOT NULL,
	`referred_user_id` text NOT NULL,
	`referral_code` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reward_amount` real DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`referrer_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`referred_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
