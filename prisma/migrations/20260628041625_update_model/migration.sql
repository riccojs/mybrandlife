/*
  Warnings:

  - You are about to drop the column `privateDomain` on the `userTemplete` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "enablePrivateDomain" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "privateDomain" TEXT;

-- AlterTable
ALTER TABLE "userTemplete" DROP COLUMN "privateDomain";
