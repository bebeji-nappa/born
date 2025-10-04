PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_User` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`screen_name` text,
	`email` text,
	`emailVerified` text,
	`image` text,
	`description` text,
	`hash` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_User`("id", "name", "screen_name", "email", "emailVerified", "image", "description", "hash", "createdAt") SELECT "id", "name", "screen_name", "email", "emailVerified", "image", "description", "hash", "createdAt" FROM `User`;--> statement-breakpoint
DROP TABLE `User`;--> statement-breakpoint
ALTER TABLE `__new_User` RENAME TO `User`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_key` ON `User` (`email`);