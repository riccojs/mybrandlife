-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WristbandName" ADD VALUE 'PURPLE';
ALTER TYPE "WristbandName" ADD VALUE 'PINK';
ALTER TYPE "WristbandName" ADD VALUE 'SILVER';
ALTER TYPE "WristbandName" ADD VALUE 'GRAY';
ALTER TYPE "WristbandName" ADD VALUE 'GOLD';
ALTER TYPE "WristbandName" ADD VALUE 'TEAL';
ALTER TYPE "WristbandName" ADD VALUE 'NEON_GREEN';
ALTER TYPE "WristbandName" ADD VALUE 'NEON_PINK';
ALTER TYPE "WristbandName" ADD VALUE 'NAVY';
ALTER TYPE "WristbandName" ADD VALUE 'BROWN';
ALTER TYPE "WristbandName" ADD VALUE 'TAN';
ALTER TYPE "WristbandName" ADD VALUE 'CLEAR';
