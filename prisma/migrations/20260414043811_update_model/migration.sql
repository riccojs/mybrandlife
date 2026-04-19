/*
  Warnings:

  - You are about to drop the column `spiningId` on the `spiningGroup` table. All the data in the column will be lost.
  - You are about to drop the `spining` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `landerId` to the `spiningGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "spining" DROP CONSTRAINT "spining_landerId_fkey";

-- DropForeignKey
ALTER TABLE "spiningGroup" DROP CONSTRAINT "spiningGroup_spiningId_fkey";

-- AlterTable
ALTER TABLE "spiningGroup" DROP COLUMN "spiningId",
ADD COLUMN     "landerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "userTemplete" ADD COLUMN     "enableSpin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "spining";

-- AddForeignKey
ALTER TABLE "spiningGroup" ADD CONSTRAINT "spiningGroup_landerId_fkey" FOREIGN KEY ("landerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
