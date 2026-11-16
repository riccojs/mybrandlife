-- AlterTable
ALTER TABLE "referralCode" ADD COLUMN     "expire_in" TIMESTAMP(3),
ADD COLUMN     "label" TEXT,
ADD COLUMN     "limit" INTEGER,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "logo" TEXT;
