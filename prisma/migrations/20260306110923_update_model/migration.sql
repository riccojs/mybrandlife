/*
  Warnings:

  - You are about to drop the column `uniqeId` on the `pulsetrack` table. All the data in the column will be lost.
  - You are about to drop the column `brandtapIdPrefix` on the `pulsetrackData` table. All the data in the column will be lost.
  - You are about to drop the column `uniqeId` on the `wristbandItem` table. All the data in the column will be lost.
  - The `idPrefix` column on the `wristbandItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `idPrefix` to the `pulsetrackData` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "pulsetrack_uniqeId_key";

-- DropIndex
DROP INDEX "wristbandItem_uniqeId_key";

-- AlterTable
ALTER TABLE "pulsetrack" DROP COLUMN "uniqeId";

-- AlterTable
ALTER TABLE "pulsetrackData" DROP COLUMN "brandtapIdPrefix",
ADD COLUMN     "idPrefix" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "wristbandItem" DROP COLUMN "uniqeId",
DROP COLUMN "idPrefix",
ADD COLUMN     "idPrefix" INTEGER;
