-- 既存のユーザーでBlogレコードがない場合に作成
INSERT INTO "Blog" ("userId", "title", "description", "createdAt", "updatedAt")
SELECT DISTINCT "Post"."userId", NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Post"
LEFT JOIN "Blog" ON "Post"."userId" = "Blog"."userId"
WHERE "Blog"."id" IS NULL;

-- 既存のPostデータにblogIdを設定（まだ設定されていない場合）
UPDATE "Post"
SET "blogId" = (
    SELECT "Blog"."id"
    FROM "Blog"
    WHERE "Blog"."userId" = "Post"."userId"
    LIMIT 1
)
WHERE "Post"."blogId" IS NULL OR "Post"."blogId" = 0;
