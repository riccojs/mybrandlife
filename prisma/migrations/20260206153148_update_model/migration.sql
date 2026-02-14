/*
  Warnings:

  - The `recipent` column on the `partners` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "partners" DROP COLUMN "recipent",
ADD COLUMN     "recipent" TEXT[] DEFAULT ARRAY[]::TEXT[];
