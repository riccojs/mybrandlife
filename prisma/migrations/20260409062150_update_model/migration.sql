/*
  Warnings:

  - You are about to drop the `setting` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "maintenance" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "setting";
