/*
  Warnings:

  - You are about to drop the column `addressOne` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `addressTow` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('PRIMARY', 'SHIPPING');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "addressOne",
DROP COLUMN "addressTow",
ADD COLUMN     "phoneCode" TEXT;

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "streetOne" TEXT NOT NULL,
    "streetTow" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "userId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
