/*
  Warnings:

  - The values [TELIGRAM] on the enum `ButtonName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ButtonName_new" AS ENUM ('FACEBOOK', 'TWITTER', 'LINKEDIN', 'YOUTUBE', 'CUSTOM', 'SNAPCHAT', 'TIKTOK', 'EMAIL', 'PHONE', 'INSTAGRAM', 'REDDIT', 'TUMBLR', 'PINTEREST', 'WHATSAPP', 'WECHAT', 'TELEGRAM', 'DISCORD', 'TWITCH', 'GITHUB', 'SOUNDCLOUD', 'VIMEO', 'SPOTIFY', 'CLUBHOUSE', 'PERISCOPE', 'DRIBBLE', 'BEHANCE', 'DAILYMOTION', 'MIXCLOUD', 'FLICKR', 'ANCHOR', 'PATREON', 'NEXTDOOR');
ALTER TABLE "buttonSet" ALTER COLUMN "name" TYPE "ButtonName_new" USING ("name"::text::"ButtonName_new");
ALTER TYPE "ButtonName" RENAME TO "ButtonName_old";
ALTER TYPE "ButtonName_new" RENAME TO "ButtonName";
DROP TYPE "public"."ButtonName_old";
COMMIT;
