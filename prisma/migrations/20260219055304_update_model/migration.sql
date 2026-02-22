/*
  Warnings:

  - Added the required column `orderId` to the `brandtapWristband` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "brandtapWristband" ADD COLUMN     "orderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "brandtapWristband" ADD CONSTRAINT "brandtapWristband_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "wristbandOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
