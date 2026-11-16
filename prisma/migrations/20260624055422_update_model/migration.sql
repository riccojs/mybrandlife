-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ROUTE', 'MODAL');

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "redirectUrl" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "profile" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);
