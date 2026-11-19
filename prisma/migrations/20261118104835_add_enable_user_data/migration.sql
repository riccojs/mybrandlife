/*
  Warnings:

  - You are about to drop the column `enablePrivateDomain` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "enablePrivateDomain",
ADD COLUMN     "enableMblLogo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableQr" BOOLEAN NOT NULL DEFAULT true;
