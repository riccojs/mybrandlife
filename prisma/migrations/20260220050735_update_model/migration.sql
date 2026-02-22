/*
  Warnings:

  - Added the required column `userId` to the `wristbandItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wristbandItem" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "wristbandItem" ADD CONSTRAINT "wristbandItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
