/*
  Warnings:

  - You are about to drop the column `username` on the `joinUser` table. All the data in the column will be lost.
  - Made the column `phone` on table `joinUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "joinUser_code_key";

-- DropIndex
DROP INDEX "joinUser_email_key";

-- DropIndex
DROP INDEX "joinUser_landerName_key";

-- AlterTable
ALTER TABLE "joinUser" DROP COLUMN "username",
ALTER COLUMN "phone" SET NOT NULL;
