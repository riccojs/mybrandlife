/*
  Warnings:

  - A unique constraint covering the columns `[sequence]` on the table `brandtap` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "brandtap" ADD COLUMN     "sequence" SERIAL NOT NULL,
ALTER COLUMN "uniqeId" DROP NOT NULL,
ALTER COLUMN "idPrefix" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "brandtap_sequence_key" ON "brandtap"("sequence");
