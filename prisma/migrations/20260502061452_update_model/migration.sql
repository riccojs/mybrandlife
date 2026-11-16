/*
  Warnings:

  - The values [ALL] on the enum `SpinCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpinCategory_new" AS ENUM ('PEOPLE', 'CLUBS', 'HOTELS', 'RESTAURANTS', 'OTHER');
ALTER TABLE "spining" ALTER COLUMN "groupType" TYPE "SpinCategory_new" USING ("groupType"::text::"SpinCategory_new");
ALTER TYPE "SpinCategory" RENAME TO "SpinCategory_old";
ALTER TYPE "SpinCategory_new" RENAME TO "SpinCategory";
DROP TYPE "public"."SpinCategory_old";
COMMIT;
