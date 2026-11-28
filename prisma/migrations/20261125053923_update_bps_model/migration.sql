/*
  Warnings:

  - You are about to drop the column `provider` on the `bpsWorkspace` table. All the data in the column will be lost.
  - You are about to drop the column `provisioningStatus` on the `bpsWorkspace` table. All the data in the column will be lost.
  - You are about to drop the column `staffWorkspaceUrl` on the `bpsWorkspace` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceName` on the `bpsWorkspace` table. All the data in the column will be lost.
  - Added the required column `staffId` to the `bpsWorkspace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staffName` to the `bpsWorkspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bpsWorkspace" DROP COLUMN "provider",
DROP COLUMN "provisioningStatus",
DROP COLUMN "staffWorkspaceUrl",
DROP COLUMN "workspaceName",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "staffId" TEXT NOT NULL,
ADD COLUMN     "staffName" TEXT NOT NULL,
ADD COLUMN     "status" "BpsWorkspaceStatus" NOT NULL DEFAULT 'NOT_CONFIGURED',
ADD COLUMN     "url" TEXT;

-- AddForeignKey
ALTER TABLE "bpsWorkspace" ADD CONSTRAINT "bpsWorkspace_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "bpsStaff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
