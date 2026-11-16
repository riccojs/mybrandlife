/*
  Warnings:

  - Added the required column `orderFrom` to the `wristbandItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderFrom" AS ENUM ('DASHBOARD', 'SIGNUP');

-- AlterTable
ALTER TABLE "wristbandItem" ADD COLUMN     "orderFrom" "OrderFrom" NOT NULL;
