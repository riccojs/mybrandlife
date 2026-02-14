/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CodeType" AS ENUM ('MONTHLY', 'PERCENT', 'LIFETIME');

-- CreateEnum
CREATE TYPE "Shiping" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'RECEIVED', 'COMPLETE', 'CANCELED');

-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('LINKTYPE', 'FORMTYPE');

-- CreateEnum
CREATE TYPE "WisetbandName" AS ENUM ('BLACK', 'RED', 'GREEN', 'YELLOW', 'BLUE', 'WHITE', 'ORANGE');

-- CreateEnum
CREATE TYPE "ButtonName" AS ENUM ('FACEBOOK', 'TWITTER', 'LINKEDIN', 'YOUTUBE', 'CUSTOM', 'SNAPCHAT', 'TIKTOK', 'EMAIL', 'PHONE', 'INSTAGRAM', 'REDDIT', 'TUMBLR', 'PINTEREST', 'WHATSAPP', 'WECHAT', 'TELIGRAM', 'DISCORD', 'TWITCH', 'GITHUB', 'SOUNDCLOUD', 'VIMEO', 'SPOTIFY', 'CLUBHOUSE', 'PERISCOPE', 'DRIBBLE', 'BEHANCE', 'DAILYMOTION', 'MIXCLOUD', 'FLICKR', 'ANCHOR', 'PATREON', 'NEXTDOOR');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('IMAGE', 'COLOR');

-- CreateEnum
CREATE TYPE "Layout" AS ENUM ('LEFT', 'RIGHT', 'CENTER');

-- CreateEnum
CREATE TYPE "EchoStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'EXPIRED', 'CANCELED', 'PAID', 'DEACTIVATE');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELED', 'EXPIRED', 'DEACTIVATE');

-- CreateEnum
CREATE TYPE "ActivationStatus" AS ENUM ('PENDING', 'ACTIVATE', 'DEACTIVATE', 'SUSPEND');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "midName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "secondEmail" TEXT,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "profile" TEXT,
    "addressOne" TEXT,
    "addressTow" TEXT,
    "landerName" TEXT,
    "nickName" TEXT,
    "aggreement" BOOLEAN,
    "package" TEXT,
    "frequency" TEXT,
    "status" "ActivationStatus" NOT NULL DEFAULT 'PENDING',
    "domain" TEXT,
    "planKey" TEXT,
    "planPrice" DOUBLE PRECISION,
    "planOldPrice" DOUBLE PRECISION,
    "planId" TEXT,
    "secureKey" TEXT,
    "role" "Role" NOT NULL,
    "discount" INTEGER,
    "discountType" "CodeType",
    "calendarId" TEXT,
    "stripeAccountId" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "ShowCalendar" BOOLEAN NOT NULL DEFAULT false,
    "enableDirectory" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wisetband" (
    "id" TEXT NOT NULL,
    "orderId" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "shipping" "Shiping" NOT NULL DEFAULT 'PENDING',
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wisetband_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wisetbandItem" (
    "id" TEXT NOT NULL,
    "name" "WisetbandName" NOT NULL,
    "value" INTEGER NOT NULL,
    "wisetbandId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wisetbandItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userMembership" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" TEXT NOT NULL,
    "expired" BOOLEAN NOT NULL,
    "activate_at" TIMESTAMP(3),
    "oldPrice" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT,
    "status" "ActivationStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userTemplete" (
    "id" TEXT NOT NULL,
    "layout" "Layout" NOT NULL,
    "officialColor" TEXT,
    "bio" TEXT,
    "tagLine" TEXT,
    "offerings" TEXT,
    "funnySaying" TEXT,
    "logo" TEXT,
    "portrait" TEXT,
    "banner" TEXT,
    "background" TEXT,
    "epkFile" TEXT,
    "favicon" TEXT,
    "heading" TEXT,
    "title" TEXT,
    "footerText" TEXT,
    "footerWidget" TEXT,
    "headBtnLeft" TEXT,
    "headBtnRight" TEXT,
    "centerHeading" TEXT,
    "centerDescripion" TEXT,
    "vcfFile" TEXT,
    "echoTips" TEXT[],
    "headerBgType" "Type" NOT NULL,
    "headerBg" TEXT,
    "ContentBGType" "Type" NOT NULL,
    "ContentBg" TEXT,
    "footerBgType" "Type" NOT NULL,
    "FooterBg" TEXT,
    "merchendiseUrl" TEXT,
    "merchendiseStatus" BOOLEAN,
    "songRequest" TEXT,
    "verify" BOOLEAN DEFAULT false,
    "status" "ActivationStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "enableEvent" BOOLEAN NOT NULL DEFAULT false,
    "enableEcho" BOOLEAN NOT NULL DEFAULT false,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userTemplete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buttonSet" (
    "id" TEXT NOT NULL,
    "name" "ButtonName" NOT NULL,
    "url" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buttonSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customPlatfrom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customPlatfrom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otpModel" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expireIn" TIMESTAMP(3) NOT NULL,
    "code" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otpModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domainReq" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domainReq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templateInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "accu" DOUBLE PRECISION,
    "templateId" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templateInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "times" TEXT[],
    "userId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "echo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "tip" DOUBLE PRECISION,
    "status" "EchoStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "shoutOut" TEXT,
    "city" TEXT,
    "userId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "echo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referralCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "CodeType" NOT NULL,
    "value" INTEGER NOT NULL,
    "joined" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "linkText" TEXT,
    "link" TEXT,
    "type" "PartnerType" NOT NULL,
    "recipent" TEXT,
    "logo" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_landerName_key" ON "user"("landerName");

-- CreateIndex
CREATE UNIQUE INDEX "wisetband_orderId_key" ON "wisetband"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "userMembership_userId_key" ON "userMembership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "otpModel_code_key" ON "otpModel"("code");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "referralCode_code_key" ON "referralCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "referralCode_userId_key" ON "referralCode"("userId");

-- AddForeignKey
ALTER TABLE "wisetband" ADD CONSTRAINT "wisetband_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wisetbandItem" ADD CONSTRAINT "wisetbandItem_wisetbandId_fkey" FOREIGN KEY ("wisetbandId") REFERENCES "wisetband"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userMembership" ADD CONSTRAINT "userMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userTemplete" ADD CONSTRAINT "userTemplete_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "userTemplete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buttonSet" ADD CONSTRAINT "buttonSet_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "userTemplete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customPlatfrom" ADD CONSTRAINT "customPlatfrom_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "userTemplete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otpModel" ADD CONSTRAINT "otpModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount" ADD CONSTRAINT "discount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templateInfo" ADD CONSTRAINT "templateInfo_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "userTemplete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot" ADD CONSTRAINT "slot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "echo" ADD CONSTRAINT "echo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referralCode" ADD CONSTRAINT "referralCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
