-- AlterTable
ALTER TABLE "wristbandItem" ADD COLUMN     "cancel_at" TIMESTAMP(3),
ADD COLUMN     "disable_at" TIMESTAMP(3),
ADD COLUMN     "inproduction_at" TIMESTAMP(3),
ADD COLUMN     "refund_at" TIMESTAMP(3);
