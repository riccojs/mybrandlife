/*
  Warnings:

  - Made the column `transactionId` on table `bpsMembership` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bpsMembership" ALTER COLUMN "transactionId" SET NOT NULL;
