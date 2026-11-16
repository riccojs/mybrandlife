/*
  Warnings:

  - You are about to drop the column `background` on the `userTemplete` table. All the data in the column will be lost.
  - You are about to drop the column `banner` on the `userTemplete` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `userTemplete` table. All the data in the column will be lost.
  - You are about to drop the column `portrait` on the `userTemplete` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "userTemplete" DROP COLUMN "background",
DROP COLUMN "banner",
DROP COLUMN "logo",
DROP COLUMN "portrait",
ADD COLUMN     "bodyImage" TEXT,
ADD COLUMN     "headerImage" TEXT,
ADD COLUMN     "logoImage" TEXT;
