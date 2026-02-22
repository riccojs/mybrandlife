/*
  Warnings:

  - Added the required column `trackingId` to the `wristbandOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wristbandOrder" ADD COLUMN     "trackingId" TEXT NOT NULL;
