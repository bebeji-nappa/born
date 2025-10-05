CREATE TABLE `EmailVerificationToken` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `EmailVerificationToken_token_unique` ON `EmailVerificationToken` (`token`);--> statement-breakpoint
CREATE INDEX `EmailVerificationToken_userId_idx` ON `EmailVerificationToken` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `EmailVerificationToken_token_key` ON `EmailVerificationToken` (`token`);