/*
  Warnings:

  - The values [CONFIGURE_APPROVAL,CONFIGURE_REPORTING] on the enum `ProccessStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `bpsPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProccessStatus_new" AS ENUM ('ONBOARD_SUBMITED', 'VERIFY_ONBOARDING', 'VERIFY_BRAND_ASSETS', 'CREATE_WORKSPACE', 'CONNECT_SOCIAL', 'CONFIGURE_CALENDAR', 'FINAL_REVIEW');
ALTER TABLE "bpsProccess" ALTER COLUMN "status" TYPE "ProccessStatus_new" USING ("status"::text::"ProccessStatus_new");
ALTER TYPE "ProccessStatus" RENAME TO "ProccessStatus_old";
ALTER TYPE "ProccessStatus_new" RENAME TO "ProccessStatus";
DROP TYPE "public"."ProccessStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "bpsPost" DROP CONSTRAINT "bpsPost_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "bpsPost" DROP CONSTRAINT "bpsPost_onboardId_fkey";

-- DropForeignKey
ALTER TABLE "bpsPost" DROP CONSTRAINT "bpsPost_staffId_fkey";

-- DropTable
DROP TABLE "bpsPost";

-- DropEnum
DROP TYPE "BpsPostPriority";

-- DropEnum
DROP TYPE "BpsPostStatus";
