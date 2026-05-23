/*
  Warnings:

  - You are about to drop the column `orderFrom` on the `wristbandItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wristbandItem" DROP COLUMN "orderFrom";

-- DropEnum
DROP TYPE "OrderFrom";
