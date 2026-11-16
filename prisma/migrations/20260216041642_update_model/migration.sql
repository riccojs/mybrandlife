/*
  Warnings:

  - You are about to drop the column `nextSequence` on the `brandtap` table. All the data in the column will be lost.
  - Added the required column `uniqeId` to the `brandtap` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `idPrefix` on the `brandtap` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `qrCode` to the `brandtapWistband` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "brandtap" DROP COLUMN "nextSequence",
ADD COLUMN     "active" "ActivationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "expediteProduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "expediteShipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "transactionId" TEXT,
ADD COLUMN     "uniqeId" INTEGER NOT NULL,
DROP COLUMN "idPrefix",
ADD COLUMN     "idPrefix" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "brandtapWistband" ADD COLUMN     "qrCode" TEXT NOT NULL;
