/*
  Warnings:

  - Made the column `firstName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `midName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `addressOne` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aggreement` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `package` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `frequency` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `domain` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `planKey` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `planPrice` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `planOldPrice` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `planId` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "midName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "addressOne" SET NOT NULL,
ALTER COLUMN "aggreement" SET NOT NULL,
ALTER COLUMN "package" SET NOT NULL,
ALTER COLUMN "frequency" SET NOT NULL,
ALTER COLUMN "domain" SET NOT NULL,
ALTER COLUMN "planKey" SET NOT NULL,
ALTER COLUMN "planPrice" SET NOT NULL,
ALTER COLUMN "planOldPrice" SET NOT NULL,
ALTER COLUMN "planId" SET NOT NULL;
