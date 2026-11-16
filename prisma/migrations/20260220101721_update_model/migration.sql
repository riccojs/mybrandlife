/*
  Warnings:

  - You are about to drop the column `subtotal` on the `brandtap` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "brandtap" DROP COLUMN "subtotal",
ADD COLUMN     "subTotal" DOUBLE PRECISION NOT NULL DEFAULT 0;
