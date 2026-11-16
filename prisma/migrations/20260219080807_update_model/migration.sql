/*
  Warnings:

  - You are about to drop the `brandtapWristband` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planWristband` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "brandtapWristband" DROP CONSTRAINT "brandtapWristband_brandtapId_fkey";

-- DropForeignKey
ALTER TABLE "brandtapWristband" DROP CONSTRAINT "brandtapWristband_orderId_fkey";

-- DropForeignKey
ALTER TABLE "brandtapWristband" DROP CONSTRAINT "brandtapWristband_wristbandId_fkey";

-- DropForeignKey
ALTER TABLE "planWristband" DROP CONSTRAINT "planWristband_orderId_fkey";

-- DropForeignKey
ALTER TABLE "planWristband" DROP CONSTRAINT "planWristband_userId_fkey";

-- DropForeignKey
ALTER TABLE "planWristband" DROP CONSTRAINT "planWristband_wristbandId_fkey";

-- DropTable
DROP TABLE "brandtapWristband";

-- DropTable
DROP TABLE "planWristband";

-- CreateTable
CREATE TABLE "wristbandOrderItem" (
    "id" TEXT NOT NULL,
    "uniqeId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "banner" TEXT NOT NULL,
    "color" "WristbandName" NOT NULL,
    "qrCode" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wristbandOrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wristbandOrderItem" ADD CONSTRAINT "wristbandOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "wristbandOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
