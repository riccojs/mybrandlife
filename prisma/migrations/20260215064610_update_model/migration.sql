-- CreateEnum
CREATE TYPE "WistbandStatus" AS ENUM ('PAID', 'INPRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELED', 'REFUNDED', 'LOST', 'DISABLED', 'PENDING');

-- CreateTable
CREATE TABLE "brandtap" (
    "id" TEXT NOT NULL,
    "landerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseDomain" TEXT NOT NULL,
    "basePath" TEXT NOT NULL,
    "idPrefix" TEXT NOT NULL,
    "nextSequence" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brandtap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brandtapWistband" (
    "id" TEXT NOT NULL,
    "brandtapId" TEXT NOT NULL,
    "brandtapIdPrefix" TEXT NOT NULL,
    "color" "WisetbandName" NOT NULL,
    "unitePrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "assignedFirstName" TEXT,
    "assignedLastName" TEXT,
    "assignedNickname" TEXT,
    "status" "WistbandStatus" NOT NULL DEFAULT 'PENDING',
    "shippingCarrier" TEXT,
    "trackingNumber" TEXT NOT NULL,
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brandtapWistband_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brandTapData" (
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

    CONSTRAINT "brandTapData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "brandtap" ADD CONSTRAINT "brandtap_landerId_fkey" FOREIGN KEY ("landerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brandtapWistband" ADD CONSTRAINT "brandtapWistband_brandtapId_fkey" FOREIGN KEY ("brandtapId") REFERENCES "brandtap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brandTapData" ADD CONSTRAINT "brandTapData_brandtapId_fkey" FOREIGN KEY ("brandtapId") REFERENCES "brandtap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brandTapData" ADD CONSTRAINT "brandTapData_landerId_fkey" FOREIGN KEY ("landerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
