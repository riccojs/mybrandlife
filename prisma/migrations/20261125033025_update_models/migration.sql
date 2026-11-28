/*
  Warnings:

  - You are about to drop the column `assests` on the `bpsPost` table. All the data in the column will be lost.
  - Changed the type of `priority` on the `bpsPost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `bpsPost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BpsPostStatus" AS ENUM ('CREATED', 'ACCEPTED', 'DRAFT', 'PUBLISHED', 'CANCELED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BpsPostPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- AlterTable
ALTER TABLE "bpsPost" DROP COLUMN "assests",
ADD COLUMN     "assets" TEXT[],
ADD COLUMN     "thumbnail" TEXT,
DROP COLUMN "priority",
ADD COLUMN     "priority" "BpsPostPriority" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BpsPostStatus" NOT NULL;
