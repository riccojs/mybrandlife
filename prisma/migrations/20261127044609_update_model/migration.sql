/*
  Warnings:

  - You are about to drop the column `attamp` on the `bpsPlatfrom` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[attemp]` on the table `bpsPlatfrom` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bpsPlatfrom" DROP COLUMN "attamp",
ADD COLUMN     "attemp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bpsPlatfrom_attemp_key" ON "bpsPlatfrom"("attemp");
