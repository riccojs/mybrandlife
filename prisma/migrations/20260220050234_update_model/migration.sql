/*
  Warnings:

  - You are about to drop the `brandtapWristband` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planWristband` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WristbandMode" AS ENUM ('BRANDTAP', 'GLOBAL');

-- AlterEnum
ALTER TYPE "OrderWristbandStatus" ADD VALUE 'COMPLETE';

-- DropForeignKey
ALTER TABLE "brandtapWristband" DROP CONSTRAINT "brandtapWristband_brandtapId_fkey";

-- DropForeignKey
ALTER TABLE "brandtapWristband" DROP CONSTRAINT "brandtapWristband_wristbandId_fkey";

-- DropForeignKey
ALTER TABLE "planWristband" DROP CONSTRAINT "planWristband_userId_fkey";

-- DropForeignKey
ALTER TABLE "planWristband" DROP CONSTRAINT "planWristband_wristbandId_fkey";

-- DropTable
DROP TABLE "brandtapWristband";

-- DropTable
DROP TABLE "planWristband";

-- CreateTable
CREATE TABLE "wristbandItem" (
    "id" TEXT NOT NULL,
    "brandtapId" TEXT,
    "wristbandId" TEXT NOT NULL,
    "idPrefix" TEXT,
    "uniqeId" TEXT,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "banner" TEXT NOT NULL,
    "color" "WristbandName" NOT NULL,
    "assignedFirstName" TEXT,
    "assignedLastName" TEXT,
    "assignedNickname" TEXT,
    "status" "OrderWristbandStatus" NOT NULL DEFAULT 'PENDING',
    "shippingCarrier" TEXT,
    "trackingNumber" TEXT NOT NULL,
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "complete_at" TIMESTAMP(3),
    "qrCode" TEXT NOT NULL,
    "mode" "WristbandMode" NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wristbandItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wristbandItem_uniqeId_key" ON "wristbandItem"("uniqeId");

-- AddForeignKey
ALTER TABLE "wristbandItem" ADD CONSTRAINT "wristbandItem_brandtapId_fkey" FOREIGN KEY ("brandtapId") REFERENCES "brandtap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wristbandItem" ADD CONSTRAINT "wristbandItem_wristbandId_fkey" FOREIGN KEY ("wristbandId") REFERENCES "wristband"("id") ON DELETE CASCADE ON UPDATE CASCADE;
