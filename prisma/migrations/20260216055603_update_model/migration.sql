/*
  Warnings:

  - A unique constraint covering the columns `[basePath]` on the table `brandtap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uniqeId]` on the table `brandtap` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "brandtap" ALTER COLUMN "uniqeId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "brandtap_basePath_key" ON "brandtap"("basePath");

-- CreateIndex
CREATE UNIQUE INDEX "brandtap_uniqeId_key" ON "brandtap"("uniqeId");
