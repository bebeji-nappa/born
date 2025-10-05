CREATE TABLE `EmailChangeToken` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`newEmail` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `EmailChangeToken_token_unique` ON `EmailChangeToken` (`token`);--> statement-breakpoint
CREATE INDEX `EmailChangeToken_userId_idx` ON `EmailChangeToken` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `EmailChangeToken_token_key` ON `EmailChangeToken` (`token`);