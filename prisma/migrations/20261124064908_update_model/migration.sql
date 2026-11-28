/*
  Warnings:

  - Made the column `membershipId` on table `bpsDrive` required. This step will fail if there are existing NULL values in that column.
  - Made the column `folderId` on table `bpsDrive` required. This step will fail if there are existing NULL values in that column.
  - Made the column `folderUrl` on table `bpsDrive` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clientGoogleEmail` on table `bpsDrive` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accessStatus` on table `bpsDrive` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdSharedAt` on table `bpsDrive` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sharedAt` on table `bpsDrive` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bpsDrive" ALTER COLUMN "membershipId" SET NOT NULL,
ALTER COLUMN "folderId" SET NOT NULL,
ALTER COLUMN "folderUrl" SET NOT NULL,
ALTER COLUMN "clientGoogleEmail" SET NOT NULL,
ALTER COLUMN "accessStatus" SET NOT NULL,
ALTER COLUMN "createdSharedAt" SET NOT NULL,
ALTER COLUMN "sharedAt" SET NOT NULL;
