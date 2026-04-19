-- CreateEnum
CREATE TYPE "SpinCategory" AS ENUM ('PEOPLE', 'CLUBS', 'HOTELS', 'RESTAURANTS', 'ALL');

-- CreateTable
CREATE TABLE "spining" (
    "id" TEXT NOT NULL,
    "isEnable" BOOLEAN NOT NULL DEFAULT false,
    "landerId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spiningGroup" (
    "id" TEXT NOT NULL,
    "groupType" "SpinCategory" NOT NULL,
    "isEnable" BOOLEAN NOT NULL DEFAULT false,
    "spiningId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spiningGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spiningItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spiningItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spiningGroup_groupType_key" ON "spiningGroup"("groupType");

-- AddForeignKey
ALTER TABLE "spining" ADD CONSTRAINT "spining_landerId_fkey" FOREIGN KEY ("landerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spiningGroup" ADD CONSTRAINT "spiningGroup_spiningId_fkey" FOREIGN KEY ("spiningId") REFERENCES "spining"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spiningItem" ADD CONSTRAINT "spiningItem_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "spiningGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
