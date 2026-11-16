/*
  Warnings:

  - A unique constraint covering the columns `[landerId]` on the table `spining` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "spining" ALTER COLUMN "landerId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "spining_landerId_key" ON "spining"("landerId");
