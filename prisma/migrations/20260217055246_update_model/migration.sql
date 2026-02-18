/*
  Warnings:

  - You are about to drop the `brandtapWistband` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wisetband` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wisetbandItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WristbandStatus" AS ENUM ('DRAFT', 'PENDING', 'INSTOCK', 'OUTOFSTOCK');

-- CreateEnum
CREATE TYPE "WristbandName" AS ENUM ('BLACK', 'RED', 'GREEN', 'YELLOW', 'BLUE', 'WHITE', 'ORANGE');

-- CreateEnum
CREATE TYPE "OrderWristbandStatus" AS ENUM ('PAID', 'INPRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELED', 'REFUNDED', 'LOST', 'DISABLED', 'PENDING');

-- DropForeignKey
ALTER TABLE "brandtapWistband" DROP CONSTRAINT "brandtapWistband_brandtapId_fkey";

-- DropForeignKey
ALTER TABLE "wisetband" DROP CONSTRAINT "wisetband_userId_fkey";

-- DropForeignKey
ALTER TABLE "wisetbandItem" DROP CONSTRAINT "wisetbandItem_wisetbandId_fkey";

-- DropTable
DROP TABLE "brandtapWistband";

-- DropTable
DROP TABLE "wisetband";

-- DropTable
DROP TABLE "wisetbandItem";

-- DropEnum
DROP TYPE "WisetbandName";

-- DropEnum
DROP TYPE "WistbandStatus";

-- CreateTable
CREATE TABLE "wristband" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "banner" TEXT NOT NULL,
    "color" "WristbandName" NOT NULL,
    "status" "WristbandStatus" NOT NULL,
    "stock" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wristband_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planWristband" (
    "id" TEXT NOT NULL,
    "wristbandId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
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
