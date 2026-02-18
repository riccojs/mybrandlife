/*
  Warnings:

  - Added the required column `subTotal` to the `planWristband` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "planWristband" ADD COLUMN     "subTotal" DOUBLE PRECISION NOT NULL;
