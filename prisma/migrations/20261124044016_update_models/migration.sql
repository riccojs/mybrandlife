/*
  Warnings:

  - You are about to drop the `bpsMembershipDrive` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bpsMembershipPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bpsMembershipWorkspace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bpsProccessStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bpsMembershipDrive" DROP CONSTRAINT "bpsMembershipDrive_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "bpsMembershipPost" DROP CONSTRAINT "bpsMembershipPost_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "bpsMembershipPost" DROP CONSTRAINT "bpsMembershipPost_onboardId_fkey";

-- DropForeignKey
ALTER TABLE "bpsMembershipPost" DROP CONSTRAINT "bpsMembershipPost_staffId_fkey";

-- DropForeignKey
ALTER TABLE "bpsMembershipWorkspace" DROP CONSTRAINT "bpsMembershipWorkspace_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "bpsProccessStatus" DROP CONSTRAINT "bpsProccessStatus_onboardId_fkey";

-- DropTable
DROP TABLE "bpsMembershipDrive";

-- DropTable
DROP TABLE "bpsMembershipPost";

-- DropTable
DROP TABLE "bpsMembershipWorkspace";

-- DropTable
DROP TABLE "bpsProccessStatus";

-- CreateTable
CREATE TABLE "bpsDrive" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT,
    "folderId" TEXT,
    "folderUrl" TEXT,
    "clientGoogleEmail" TEXT,
    "accessStatus" TEXT,
    "createdSharedAt" TIMESTAMP(3),
    "sharedAt" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsDrive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bpsWorkspace" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT,
    "provider" TEXT NOT NULL,
    "workspaceName" TEXT,
    "staffWorkspaceUrl" TEXT,
    "provisioningStatus" "BpsWorkspaceStatus" NOT NULL DEFAULT 'NOT_CONFIGURED',
    "notes" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bpsPost" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "onboardId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "assests" TEXT[],
    "priority" TEXT NOT NULL,
    "status" "ActivationStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bpsProccess" (
    "id" TEXT NOT NULL,
    "onboardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completeAt" TIMESTAMP(3) NOT NULL,
    "status" "ProccessStatus" NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsProccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bpsDrive_membershipId_key" ON "bpsDrive"("membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "bpsWorkspace_membershipId_key" ON "bpsWorkspace"("membershipId");

-- AddForeignKey
ALTER TABLE "bpsDrive" ADD CONSTRAINT "bpsDrive_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "bpsMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsWorkspace" ADD CONSTRAINT "bpsWorkspace_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "bpsMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsPost" ADD CONSTRAINT "bpsPost_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "bpsMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsPost" ADD CONSTRAINT "bpsPost_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "bpsStaff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsPost" ADD CONSTRAINT "bpsPost_onboardId_fkey" FOREIGN KEY ("onboardId") REFERENCES "bpsOnboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsProccess" ADD CONSTRAINT "bpsProccess_onboardId_fkey" FOREIGN KEY ("onboardId") REFERENCES "bpsOnboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
