-- Add Blog table
CREATE TABLE IF NOT EXISTS `Blog` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`description` text,
	`theme` text,
	`userId` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
-- Add index for Blog
CREATE INDEX IF NOT EXISTS `Blog_userId_idx` ON `Blog` (`userId`);
--> statement-breakpoint
-- Add blogId to Post table (check if column doesn't exist first)
ALTER TABLE `Post` ADD COLUMN `blogId` integer;
--> statement-breakpoint
-- Create Blog records for existing users who have posts
INSERT INTO `Blog` (`userId`, `title`, `description`, `theme`, `createdAt`, `updatedAt`)
SELECT DISTINCT `userId`, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM `Post`
WHERE `userId` NOT IN (SELECT `userId` FROM `Blog`);
--> statement-breakpoint
-- Update existing posts to link to their user's blog
UPDATE `Post`
SET `blogId` = (
    SELECT `Blog`.`id`
    FROM `Blog`
    WHERE `Blog`.`userId` = `Post`.`userId`
    LIMIT 1
)
WHERE `blogId` IS NULL;
--> statement-breakpoint
-- Add index for Post blogId
CREATE INDEX IF NOT EXISTS `Post_blogId_idx` ON `Post` (`blogId`);
