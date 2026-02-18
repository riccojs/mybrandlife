/*
  Warnings:

  - A unique constraint covering the columns `[idPrefix]` on the table `brandtap` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "brandtap_basePath_key";

-- CreateIndex
CREATE UNIQUE INDEX "brandtap_idPrefix_key" ON "brandtap"("idPrefix");
