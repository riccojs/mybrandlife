/*
  Warnings:

  - You are about to drop the column `unitePrice` on the `brandtapWistband` table. All the data in the column will be lost.
  - Added the required column `unitPrice` to the `brandtapWistband` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "brandtapWistband" DROP COLUMN "unitePrice",
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;
