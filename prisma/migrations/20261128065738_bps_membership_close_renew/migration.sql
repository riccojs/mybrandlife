-- AlterTable
ALTER TABLE "bpsMembership" ADD COLUMN     "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canceled_at" TIMESTAMP(3),
ADD COLUMN     "subscriptionId" TEXT;

-- CreateIndex
CREATE INDEX "bpsMembership_subscriptionId_idx" ON "bpsMembership"("subscriptionId");
