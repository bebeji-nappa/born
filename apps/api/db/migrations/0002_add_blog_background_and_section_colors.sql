-- Add background image fields to Blog table
ALTER TABLE `Blog` ADD COLUMN `backgroundImage` text;
--> statement-breakpoint
ALTER TABLE `Blog` ADD COLUMN `backgroundImageKey` text;
