/*
  Warnings:

  - You are about to drop the column `status` on the `brandtap` table. All the data in the column will be lost.
  - You are about to drop the `wristbandOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wristbandOrderItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "wristbandOrder" DROP CONSTRAINT "wristbandOrder_brandtapId_fkey";

-- DropForeignKey
ALTER TABLE "wristbandOrder" DROP CONSTRAINT "wristbandOrder_userId_fkey";

-- DropForeignKey
ALTER TABLE "wristbandOrderItem" DROP CONSTRAINT "wristbandOrderItem_orderId_fkey";

-- AlterTable
ALTER TABLE "brandtap" DROP COLUMN "status",
ADD COLUMN     "active" "BrandtapStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "expediteProduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "expediteShipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "transactionId" TEXT;

-- DropTable
DROP TABLE "wristbandOrder";

-- DropTable
DROP TABLE "wristbandOrderItem";

-- CreateTable
CREATE TABLE "planWristband" (
    "id" TEXT NOT NULL,
    "wristbandId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "banner" TEXT NOT NULL,
    "color" "WristbandName" NOT NULL,
    "status" "OrderWristbandStatus" NOT NULL DEFAULT 'PENDING',
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planWristband_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brandtapWristband" (
    "id" TEXT NOT NULL,
    "brandtapId" TEXT NOT NULL,
    "brandtapIdPrefix" TEXT NOT NULL,
    "wristbandId" TEXT NOT NULL,
    "color" "WristbandName" NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "assignedFirstName" TEXT,
    "assignedLastName" TEXT,
    "assignedNickname" TEXT,
    "status" "OrderWristbandStatus" NOT NULL DEFAULT 'PENDING',
    "shippingCarrier" TEXT,
    "trackingNumber" TEXT NOT NULL,
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "qrCode" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brandtapWristband_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "planWristband" ADD CONSTRAINT "planWristband_wristbandId_fkey" FOREIGN KEY ("wristbandId") REFERENCES "wristband"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planWristband" ADD CONSTRAINT "planWristband_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brandtapWristband" ADD CONSTRAINT "brandtapWristband_brandtapId_fkey" FOREIGN KEY ("brandtapId") REFERENCES "brandtap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brandtapWristband" ADD CONSTRAINT "brandtapWristband_wristbandId_fkey" FOREIGN KEY ("wristbandId") REFERENCES "wristband"("id") ON DELETE CASCADE ON UPDATE CASCADE;
