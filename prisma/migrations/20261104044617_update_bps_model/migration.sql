-- CreateEnum
CREATE TYPE "ProccessStatus" AS ENUM ('VERIFY_ONBOARDING', 'VERIFY_BRAND_ASSETS', 'CREATE_WORKSPACE', 'CONNECT_SOCIAL', 'CONFIGURE_APPROVAL', 'CONFIGURE_CALENDAR', 'CONFIGURE_REPORTING', 'FINAL_REVIEW');

-- CreateTable
CREATE TABLE "bpsProccessStatus" (
    "id" TEXT NOT NULL,
    "onboardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completeAt" TIMESTAMP(3) NOT NULL,
    "status" "ProccessStatus" NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsProccessStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bpsProccessStatus" ADD CONSTRAINT "bpsProccessStatus_onboardId_fkey" FOREIGN KEY ("onboardId") REFERENCES "bpsOnboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
