-- Add description to User table
ALTER TABLE "User" ADD COLUMN "description" TEXT;

-- Add createdAt column (nullable first, then update existing rows)
ALTER TABLE "User" ADD COLUMN "createdAt" DATETIME;

-- Update existing rows to have a createdAt value
UPDATE "User" SET "createdAt" = CURRENT_TIMESTAMP WHERE "createdAt" IS NULL;

-- Add screen_name column (nullable)
ALTER TABLE "User" ADD COLUMN "screen_name" TEXT;
