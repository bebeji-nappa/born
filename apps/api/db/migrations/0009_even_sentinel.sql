CREATE TABLE `PasswordResetToken` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `PasswordResetToken_token_unique` ON `PasswordResetToken` (`token`);--> statement-breakpoint
CREATE INDEX `PasswordResetToken_userId_idx` ON `PasswordResetToken` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `PasswordResetToken_token_key` ON `PasswordResetToken` (`token`);