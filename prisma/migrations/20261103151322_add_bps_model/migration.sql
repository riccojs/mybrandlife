-- CreateEnum
CREATE TYPE "FeatureName" AS ENUM ('SOCIAL_PLATFORM', 'GENERAL_POST', 'VIDEO_POST', 'MARKETING_CREATION', 'SMART_SCHEDULING', 'SLA_POST', 'SLA_EDIT', 'TIKTOK_INCLUDE', 'ADD_ONS', 'FREE_MYBRANDLIFE', 'INCLUDES', 'YEARLY_SAVING');

-- CreateEnum
CREATE TYPE "PlatformName" AS ENUM ('FACEBOOK', 'TWITTER', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'TELEGRAM', 'REDDIT', 'PINTEREST', 'DISCORD', 'DRIBBLE', 'SNAPCHAT');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('OPERATOR', 'MANAGER', 'LEADER');

-- CreateEnum
CREATE TYPE "BpsApprovalMode" AS ENUM ('APPROVAL_REQUIRED', 'LET_BPS_HANDLE');

-- CreateEnum
CREATE TYPE "BpsWorkspaceStatus" AS ENUM ('NOT_CONFIGURED', 'PENDING', 'CONFIGURED', 'NEEDS_UPDATE');

-- CreateTable
CREATE TABLE "bpsMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "plan" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "setupFee" INTEGER NOT NULL,
    "status" "ActivationStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT NOT NULL,
    "activate_at" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bpsPackage" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "key" "FeatureName" NOT NULL,
    "value" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bpsStaff" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "profile" TEXT,
    "phone" TEXT,
    "secretKey" TEXT NOT NULL,
    "status" "ActivationStatus" NOT NULL DEFAULT 'PENDING',
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bpsOnboard" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "services" TEXT[],
    "businessHour" INTEGER NOT NULL,
    "brandOwner" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "promotions" TEXT[],
    "events" TEXT[],
    "lead" TEXT NOT NULL,
    "targetAudince" TEXT NOT NULL,
    "tarritory" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "brandDo" TEXT[],
    "brandDont" TEXT[],
    "keyClaim" TEXT NOT NULL,
    "avoidTopics" TEXT[],
    "upcommingEvents" TEXT[],
    "logo" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "brandAssests" TEXT[],
    "approvalMode" "BpsApprovalMode" NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsOnboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packagePlatform" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "name" "PlatformName" NOT NULL,
    "url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packagePlatform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bpsApprover" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "onboardId" TEXT NOT NULL,
    "staffname" TEXT NOT NULL,
    "staffemail" TEXT NOT NULL,
    "staffrole" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsApprover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bpsMembershipDrive" (
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

    CONSTRAINT "bpsMembershipDrive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bpsMembershipWorkspace" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT,
    "provider" TEXT NOT NULL,
    "workspaceName" TEXT,
    "staffWorkspaceUrl" TEXT,
    "provisioningStatus" "BpsWorkspaceStatus" NOT NULL DEFAULT 'NOT_CONFIGURED',
    "notes" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bpsMembershipWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bpsMembershipPost" (
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

    CONSTRAINT "bpsMembershipPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bpsMembership_userId_key" ON "bpsMembership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "bpsStaff_secretKey_key" ON "bpsStaff"("secretKey");

-- CreateIndex
CREATE UNIQUE INDEX "bpsMembershipDrive_membershipId_key" ON "bpsMembershipDrive"("membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "bpsMembershipWorkspace_membershipId_key" ON "bpsMembershipWorkspace"("membershipId");

-- AddForeignKey
ALTER TABLE "bpsMembership" ADD CONSTRAINT "bpsMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsPackage" ADD CONSTRAINT "bpsPackage_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "bpsMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsOnboard" ADD CONSTRAINT "bpsOnboard_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "bpsMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packagePlatform" ADD CONSTRAINT "packagePlatform_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "bpsPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsApprover" ADD CONSTRAINT "bpsApprover_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "bpsStaff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsApprover" ADD CONSTRAINT "bpsApprover_onboardId_fkey" FOREIGN KEY ("onboardId") REFERENCES "bpsOnboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsMembershipDrive" ADD CONSTRAINT "bpsMembershipDrive_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "bpsMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsMembershipWorkspace" ADD CONSTRAINT "bpsMembershipWorkspace_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "bpsMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsMembershipPost" ADD CONSTRAINT "bpsMembershipPost_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "bpsMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsMembershipPost" ADD CONSTRAINT "bpsMembershipPost_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "bpsStaff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bpsMembershipPost" ADD CONSTRAINT "bpsMembershipPost_onboardId_fkey" FOREIGN KEY ("onboardId") REFERENCES "bpsOnboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
