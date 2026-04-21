/*
  Warnings:

  - You are about to drop the `spiningGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spiningItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "spiningGroup" DROP CONSTRAINT "spiningGroup_landerId_fkey";

-- DropForeignKey
ALTER TABLE "spiningItem" DROP CONSTRAINT "spiningItem_groupId_fkey";

-- DropTable
DROP TABLE "spiningGroup";

-- DropTable
DROP TABLE "spiningItem";

-- CreateTable
CREATE TABLE "spining" (
    "id" TEXT NOT NULL,
    "groupType" "SpinCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isEnable" BOOLEAN NOT NULL DEFAULT false,
    "landerId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spining_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "spining" ADD CONSTRAINT "spining_landerId_fkey" FOREIGN KEY ("landerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
