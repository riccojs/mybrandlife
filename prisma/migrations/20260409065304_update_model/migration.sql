/*
  Warnings:

  - You are about to drop the column `maintenance` on the `admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admin" DROP COLUMN "maintenance";

-- CreateTable
CREATE TABLE "setting" (
    "id" TEXT NOT NULL,
    "maintenance" BOOLEAN NOT NULL DEFAULT false,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);
