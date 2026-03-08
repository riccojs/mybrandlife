/*
  Warnings:

  - The values [BRANDTAP] on the enum `WristbandMode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WristbandMode_new" AS ENUM ('PULSETRACK', 'GLOBAL');
ALTER TABLE "wristbandItem" ALTER COLUMN "mode" TYPE "WristbandMode_new" USING ("mode"::text::"WristbandMode_new");
ALTER TYPE "WristbandMode" RENAME TO "WristbandMode_old";
ALTER TYPE "WristbandMode_new" RENAME TO "WristbandMode";
DROP TYPE "public"."WristbandMode_old";
COMMIT;
