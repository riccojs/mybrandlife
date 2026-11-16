/*
  Warnings:

  - You are about to drop the column `brandtapId` on the `pulsetrackData` table. All the data in the column will be lost.
  - You are about to drop the column `brandtapId` on the `wristbandItem` table. All the data in the column will be lost.
  - Added the required column `pulsetrackId` to the `pulsetrackData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pulsetrackData" DROP CONSTRAINT "pulsetrackData_brandtapId_fkey";

-- DropForeignKey
ALTER TABLE "wristbandItem" DROP CONSTRAINT "wristbandItem_brandtapId_fkey";

-- AlterTable
ALTER TABLE "pulsetrackData" DROP COLUMN "brandtapId",
ADD COLUMN     "pulsetrackId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "wristbandItem" DROP COLUMN "brandtapId",
ADD COLUMN     "pulsetrackId" TEXT;

-- AddForeignKey
ALTER TABLE "wristbandItem" ADD CONSTRAINT "wristbandItem_pulsetrackId_fkey" FOREIGN KEY ("pulsetrackId") REFERENCES "pulsetrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pulsetrackData" ADD CONSTRAINT "pulsetrackData_pulsetrackId_fkey" FOREIGN KEY ("pulsetrackId") REFERENCES "pulsetrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
