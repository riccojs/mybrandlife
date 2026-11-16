-- AlterTable
ALTER TABLE "setting" ADD COLUMN     "accountEmail" TEXT,
ADD COLUMN     "parentFolderId" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "rootFolderId" TEXT;
