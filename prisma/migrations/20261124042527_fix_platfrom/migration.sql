/*
  Warnings:

  - You are about to drop the `packagePlatform` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "packagePlatform" DROP CONSTRAINT "packagePlatform_packageId_fkey";

-- DropTable
DROP TABLE "packagePlatform";

-- CreateTable
CREATE TABLE "bpsPlatfrom" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "name" "PlatformName" NOT NULL,
    "url" TEXT,
    "status" "PlatformStatus" NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsPlatfrom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bpsPlatfrom" ADD CONSTRAINT "bpsPlatfrom_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "bpsMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
