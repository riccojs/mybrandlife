/*
  Warnings:

  - The values [OPEN,ERROR] on the enum `PlatformStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `url` on the `bpsPlatfrom` table. All the data in the column will be lost.
  - You are about to drop the `bpsDrive` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bpsWorkspace` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlatformStatus_new" AS ENUM ('CREATED', 'CONNECTED', 'EXPIRED', 'DISCONNECTED');
ALTER TABLE "bpsPlatfrom" ALTER COLUMN "status" TYPE "PlatformStatus_new" USING ("status"::text::"PlatformStatus_new");
ALTER TYPE "PlatformStatus" RENAME TO "PlatformStatus_old";
ALTER TYPE "PlatformStatus_new" RENAME TO "PlatformStatus";
DROP TYPE "public"."PlatformStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "bpsDrive" DROP CONSTRAINT "bpsDrive_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "bpsWorkspace" DROP CONSTRAINT "bpsWorkspace_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "bpsWorkspace" DROP CONSTRAINT "bpsWorkspace_staffId_fkey";

-- AlterTable
ALTER TABLE "bpsMembership" ADD COLUMN     "csAccountId" TEXT,
ADD COLUMN     "csWorkspaceId" TEXT;

-- AlterTable
ALTER TABLE "bpsPlatfrom" DROP COLUMN "url",
ADD COLUMN     "csAccountId" TEXT,
ADD COLUMN     "csWorkspaceId" TEXT;

-- DropTable
DROP TABLE "bpsDrive";

-- DropTable
DROP TABLE "bpsWorkspace";
