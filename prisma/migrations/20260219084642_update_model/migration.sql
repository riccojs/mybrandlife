/*
  Warnings:

  - You are about to drop the column `uniqeId` on the `wristbandOrder` table. All the data in the column will be lost.
  - You are about to drop the column `uniqeId` on the `wristbandOrderItem` table. All the data in the column will be lost.
  - Added the required column `idPrefix` to the `wristbandOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wristbandOrder" DROP COLUMN "uniqeId",
ADD COLUMN     "idPrefix" TEXT;

-- AlterTable
ALTER TABLE "wristbandOrderItem" DROP COLUMN "uniqeId",
ADD COLUMN     "idPrefix" TEXT NOT NULL;
