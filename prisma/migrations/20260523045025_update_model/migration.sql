/*
  Warnings:

  - You are about to drop the column `enableBrandshare` on the `userTemplete` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "enableBrandshare" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "userTemplete" DROP COLUMN "enableBrandshare";
