/*
  Warnings:

  - Added the required column `trackingNumber` to the `planWristband` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "planWristband" ADD COLUMN     "trackingNumber" TEXT NOT NULL;
