CREATE TABLE `RateLimit` (
	`key` text PRIMARY KEY NOT NULL,
	`requestCount` integer DEFAULT 0 NOT NULL,
	`windowStart` integer NOT NULL,
	`blockedUntil` integer,
	`expiresAt` integer NOT NULL
);
