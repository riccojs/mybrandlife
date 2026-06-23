/*
  Warnings:

  - You are about to drop the column `createdAt` on the `activityLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activityLog" DROP COLUMN "createdAt",
ADD COLUMN     "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
