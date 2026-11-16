/*
  Warnings:

  - You are about to drop the column `nickName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `secondEmail` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "nickName",
DROP COLUMN "secondEmail";
