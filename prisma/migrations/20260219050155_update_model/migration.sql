/*
  Warnings:

  - You are about to drop the column `active` on the `brandtap` table. All the data in the column will be lost.
  - You are about to drop the column `expediteProduction` on the `brandtap` table. All the data in the column will be lost.
  - You are about to drop the column `expediteShipping` on the `brandtap` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `brandtap` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `brandtap` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `brandtap` table. All the data in the column will be lost.
  - You are about to drop the column `delivered_at` on the `brandtapWristband` table. All the data in the column will be lost.
  - You are about to drop the column `shipped_at` on the `brandtapWristband` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCarrier` on the `brandtapWristband` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `brandtapWristband` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `brandtapWristband` table. All the data in the column will be lost.
  - You are about to drop the column `delivered_at` on the `planWristband` table. All the data in the column will be lost.
  - You are about to drop the column `shipped_at` on the `planWristband` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `planWristband` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `planWristband` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `planWristband` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrCode` to the `planWristband` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "brandtap" DROP COLUMN "active",
DROP COLUMN "expediteProduction",
DROP COLUMN "expediteShipping",
DROP COLUMN "subtotal",
DROP COLUMN "total",
DROP COLUMN "transactionId",
ADD COLUMN     "status" "BrandtapStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "brandtapWristband" DROP COLUMN "delivered_at",
DROP COLUMN "shipped_at",
DROP COLUMN "shippingCarrier",
DROP COLUMN "status",
DROP COLUMN "trackingNumber";

-- AlterTable
ALTER TABLE "planWristband" DROP COLUMN "delivered_at",
DROP COLUMN "shipped_at",
DROP COLUMN "status",
DROP COLUMN "trackingNumber",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "qrCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "wristbandOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "expediteProduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expediteShipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "OrderWristbandStatus" NOT NULL DEFAULT 'PENDING',
    "shippingCarrier" TEXT,
    "transactionId" TEXT,
    "brandtapId" TEXT,
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "complete_at" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wristbandOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wristbandOrder_orderNumber_key" ON "wristbandOrder"("orderNumber");

-- AddForeignKey
ALTER TABLE "wristbandOrder" ADD CONSTRAINT "wristbandOrder_brandtapId_fkey" FOREIGN KEY ("brandtapId") REFERENCES "brandtap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planWristband" ADD CONSTRAINT "planWristband_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "wristbandOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
