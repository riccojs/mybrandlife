/*
  Warnings:

  - A unique constraint covering the columns `[membershipId,name]` on the table `bpsPlatfrom` will be added. If there are existing duplicate values, this will fail.

*/
-- DropEnum
DROP TYPE "BpsWorkspaceStatus";

-- CreateIndex
CREATE INDEX "bpsMembership_transactionId_idx" ON "bpsMembership"("transactionId");

-- CreateIndex
CREATE INDEX "bpsMembership_csWorkspaceId_idx" ON "bpsMembership"("csWorkspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "bpsPlatfrom_membershipId_name_key" ON "bpsPlatfrom"("membershipId", "name");
