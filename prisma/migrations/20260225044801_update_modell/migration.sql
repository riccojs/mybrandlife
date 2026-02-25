/*
  Warnings:

  - You are about to drop the `brandTapData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `brandtap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "brandTapData" DROP CONSTRAINT "brandTapData_brandtapId_fkey";

-- DropForeignKey
ALTER TABLE "brandTapData" DROP CONSTRAINT "brandTapData_landerId_fkey";

-- DropForeignKey
ALTER TABLE "brandtap" DROP CONSTRAINT "brandtap_landerId_fkey";

-- DropForeignKey
ALTER TABLE "wristbandItem" DROP CONSTRAINT "wristbandItem_brandtapId_fkey";

-- DropTable
DROP TABLE "brandTapData";

-- DropTable
DROP TABLE "brandtap";

-- CreateTable
CREATE TABLE "pulsetrack" (
    "id" TEXT NOT NULL,
    "sequence" SERIAL NOT NULL,
    "landerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseDomain" TEXT NOT NULL,
    "basePath" TEXT NOT NULL,
    "idPrefix" INTEGER,
    "uniqeId" TEXT,
    "active" "BrandtapStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "subTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expediteProduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expediteShipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pulsetrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pulsetrackData" (
    "id" TEXT NOT NULL,
    "brandtapId" TEXT NOT NULL,
    "landerId" TEXT NOT NULL,
    "brandtapIdPrefix" TEXT NOT NULL,
    "tapIdRaw" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "landingUrl" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    "referrerDomain" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "screenWidth" INTEGER NOT NULL,
    "screenHeight" INTEGER NOT NULL,
    "devicePixelRatio" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL,
    "firstVisit" BOOLEAN NOT NULL,
    "isUnique" BOOLEAN NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "geoCity" TEXT NOT NULL,
    "geoRegion" TEXT NOT NULL,
    "geoCountry" TEXT NOT NULL,
    "gpsLat" DOUBLE PRECISION NOT NULL,
    "gpsLan" DOUBLE PRECISION NOT NULL,
    "gpsAccuracy" INTEGER NOT NULL,
    "gpsTimestamp" TIMESTAMP(3) NOT NULL,
    "gpsConsent" BOOLEAN NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pulsetrackData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pulsetrack_sequence_key" ON "pulsetrack"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "pulsetrack_idPrefix_key" ON "pulsetrack"("idPrefix");

-- CreateIndex
CREATE UNIQUE INDEX "pulsetrack_uniqeId_key" ON "pulsetrack"("uniqeId");

-- AddForeignKey
ALTER TABLE "pulsetrack" ADD CONSTRAINT "pulsetrack_landerId_fkey" FOREIGN KEY ("landerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wristbandItem" ADD CONSTRAINT "wristbandItem_brandtapId_fkey" FOREIGN KEY ("brandtapId") REFERENCES "pulsetrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pulsetrackData" ADD CONSTRAINT "pulsetrackData_brandtapId_fkey" FOREIGN KEY ("brandtapId") REFERENCES "pulsetrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pulsetrackData" ADD CONSTRAINT "pulsetrackData_landerId_fkey" FOREIGN KEY ("landerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
