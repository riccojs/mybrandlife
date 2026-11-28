/*
  Warnings:

  - You are about to drop the column `accountEmail` on the `setting` table. All the data in the column will be lost.
  - You are about to drop the column `parentFolderId` on the `setting` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `setting` table. All the data in the column will be lost.
  - You are about to drop the column `rootFolderId` on the `setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "setting" DROP COLUMN "accountEmail",
DROP COLUMN "parentFolderId",
DROP COLUMN "refreshToken",
DROP COLUMN "rootFolderId";
