/*
  Warnings:

  - You are about to drop the column `active` on the `packagePlatform` table. All the data in the column will be lost.
  - You are about to drop the column `expireAt` on the `packagePlatform` table. All the data in the column will be lost.
  - Added the required column `status` to the `packagePlatform` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlatformStatus" AS ENUM ('CREATED', 'OPEN', 'CONNECTED', 'ERROR', 'DISCONNECTED');

-- AlterTable
ALTER TABLE "packagePlatform" DROP COLUMN "active",
DROP COLUMN "expireAt",
ADD COLUMN     "status" "PlatformStatus" NOT NULL,
ALTER COLUMN "url" DROP NOT NULL;
