/*
  Warnings:

  - The `active` column on the `brandtap` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BrandtapStatus" AS ENUM ('PENDING', 'ACTIVATE', 'DEACTIVATE', 'SUSPEND', 'INPROCESS');

-- AlterTable
ALTER TABLE "brandtap" DROP COLUMN "active",
ADD COLUMN     "active" "BrandtapStatus" NOT NULL DEFAULT 'PENDING';
